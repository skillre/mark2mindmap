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
      
      // 创建包含思维导图的HTML
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>思维导图</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    .markmap {
      width: 100%;
      height: 100vh;
    }
    .markmap > svg {
      width: 100%;
      height: 100%;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/d3@6.7.0"></script>
  <script src="https://cdn.jsdelivr.net/npm/markmap-view@0.15.3"></script>
</head>
<body>
  <div class="markmap"></div>
  <script>
    (function() {
      const { Markmap } = window.markmap;
      const data = ${JSON.stringify(root)};
      const el = document.querySelector('.markmap');
      const mm = Markmap.create(el, undefined, data);
    })();
  </script>
</body>
</html>`;
      
      // 返回HTML响应，确保设置正确的内容类型
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
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

// 配置接收OPTIONS请求，解决CORS问题
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key"
    }
  });
} 