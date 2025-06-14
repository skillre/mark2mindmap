import { NextRequest, NextResponse } from "next/server";
import { Transformer } from "markmap-lib";

// 创建一个transformer实例
const transformer = new Transformer();

// API密钥验证函数
const validateApiKey = (apiKey: string | null) => {
  // 使用环境变量获取有效的API密钥
  const validApiKey = process.env.API_KEY || "default-api-key-for-development";
  return apiKey === validApiKey;
};

// 支持OPTIONS请求以处理CORS预检
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    },
  });
}

export async function POST(request: NextRequest) {
  // 添加CORS头
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!validateApiKey(apiKey)) {
      headers.set("Content-Type", "application/json");
      return new NextResponse(
        JSON.stringify({ error: "未授权访问，无效的API密钥" }),
        { status: 401, headers }
      );
    }

    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("解析请求体时出错:", parseError);
      headers.set("Content-Type", "application/json");
      return new NextResponse(
        JSON.stringify({ error: "请求体格式无效，请提供有效的JSON" }),
        { status: 400, headers }
      );
    }
    
    // 验证请求体是否包含markdown字段
    if (!body || typeof body.markdown !== "string") {
      headers.set("Content-Type", "application/json");
      return new NextResponse(
        JSON.stringify({ error: "请求格式不正确，缺少markdown字段" }),
        { status: 400, headers }
      );
    }

    try {
      // 转换markdown为思维导图数据
      const { root, features } = transformer.transform(body.markdown);
      
      // 获取文件名（如果提供）或使用默认文件名
      const filename = body.filename ? 
        (body.filename.endsWith('.html') ? body.filename : `${body.filename}.html`) : 
        'mindmap.html';
      
      // 创建HTML文件内容，将filename作为meta标签嵌入
      const htmlContent = generateMarkmapHtml(
        root, 
        body.title || 'Markdown MindMap', 
        filename
      );
      
      // 设置为文件下载
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      headers.set('Content-Type', 'text/html; charset=utf-8');
      headers.set('X-Filename', filename); // 添加自定义头，可能有助于一些系统识别
      
      // 返回HTML文件
      return new NextResponse(htmlContent, {
        status: 200,
        headers,
      });
    } catch (transformError) {
      console.error("转换Markdown时出错:", transformError);
      headers.set("Content-Type", "application/json");
      return new NextResponse(
        JSON.stringify({ error: "转换Markdown失败，请检查输入格式" }),
        { status: 400, headers }
      );
    }
  } catch (error) {
    console.error("处理请求时出错:", error);
    headers.set("Content-Type", "application/json");
    return new NextResponse(
      JSON.stringify({ error: "服务器内部错误" }),
      { status: 500, headers }
    );
  }
}

// 生成完整的HTML文件
function generateMarkmapHtml(root: any, title: string, filename: string): string {
  // 将数据转换为JSON字符串
  const data = JSON.stringify(root);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="markmap-filename" content="${filename}">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
    }
    .markmap-container {
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  </style>
  <!-- 添加隐藏字段，用于帮助系统识别文件名 -->
  <script type="application/json" id="markmap-metadata">
    {"filename":"${filename}"}
  </script>
</head>
<body>
  <div class="markmap-container">
    <svg id="markmap"></svg>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <script src="https://cdn.jsdelivr.net/npm/markmap-view@0.15.3"></script>

  <script>
    (function() {
      // 设置文件名为全局变量，便于外部系统提取
      window.markmapFilename = "${filename}";
      
      // 初始化思维导图
      const { Markmap } = window.markmap;
      const svg = document.getElementById('markmap');
      const mm = Markmap.create(svg, undefined, ${data});
      
      // 设置自动适应视口
      window.addEventListener('resize', () => {
        mm.fit();
      });
      
      // 初始适应视口
      setTimeout(() => {
        mm.fit();
      }, 100);
    })();
  </script>
</body>
</html>`;
} 