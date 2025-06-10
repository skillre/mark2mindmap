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
      
      // 创建HTML文件内容
      const htmlContent = generateMarkmapHtml(root, body.title || 'Markdown MindMap');
      
      // 使用多种方式设置文件名，增加兼容性
      // 1. 标准方式
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      // 2. 替代方式，用于某些代理
      headers.set('X-Filename', filename);
      headers.set('X-File-Name', filename);
      headers.set('X-Custom-Filename', filename);
      headers.set('X-Content-Filename', filename);
      // 3. 设置特殊的Content-Type，包含文件名信息
      headers.set('Content-Type', 'text/html; charset=utf-8; filename=' + encodeURIComponent(filename));
      
      // 检查是否是JSON响应请求（某些API代理可能使用这种方式）
      const acceptsJson = request.headers.get('accept')?.includes('application/json') || 
                          request.headers.get('x-expect-json') === 'true';
      
      if (acceptsJson) {
        // 返回JSON响应，包含HTML内容和文件名
        return NextResponse.json({
          success: true,
          filename: filename,
          content: htmlContent,
          contentType: 'text/html',
          metadata: {
            title: body.title || 'Markdown MindMap',
            filename: filename,
            type: 'html',
            format: 'mindmap'
          }
        }, { headers });
      } else {
        // 返回HTML文件
        return new NextResponse(htmlContent, {
          status: 200,
          headers,
        });
      }
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
function generateMarkmapHtml(root: any, title: string): string {
  // 将数据转换为JSON字符串
  const data = JSON.stringify(root);
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
</head>
<body>
  <div class="markmap-container">
    <svg id="markmap"></svg>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
  <script src="https://cdn.jsdelivr.net/npm/markmap-view@0.15.3"></script>

  <script>
    (function() {
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