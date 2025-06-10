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

export async function POST(request: NextRequest) {
  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: "未授权访问，无效的API密钥" },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    
    // 验证请求体是否包含markdown字段
    if (!body || typeof body.markdown !== "string") {
      return NextResponse.json(
        { error: "请求格式不正确，缺少markdown字段" },
        { status: 400 }
      );
    }

    try {
      // 转换markdown为思维导图数据
      const { root, features } = transformer.transform(body.markdown);
      
      // 创建HTML文件内容
      const htmlContent = generateMarkmapHtml(root, body.title || 'Markdown MindMap');
      
      // 创建响应头，设置为文件下载
      const headers = new Headers();
      headers.set('Content-Disposition', 'attachment; filename="mindmap.html"');
      headers.set('Content-Type', 'text/html; charset=utf-8');
      
      // 返回HTML文件
      return new NextResponse(htmlContent, {
        status: 200,
        headers,
      });
    } catch (transformError) {
      console.error("转换Markdown时出错:", transformError);
      return NextResponse.json(
        { error: "转换Markdown失败，请检查输入格式" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("处理请求时出错:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
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