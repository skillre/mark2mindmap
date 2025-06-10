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
      
      // 创建与markmap-cli一致的HTML
      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>Markmap</title>
<style>
* {
  margin: 0;
  padding: 0;
}
#mindmap {
  display: block;
  width: 100vw;
  height: 100vh;
}
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markmap-toolbar@0.15.3/dist/style.css">
</head>
<body>
<svg id="mindmap"></svg>
<script src="https://cdn.jsdelivr.net/npm/d3@6.7.0"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-view@0.15.3"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-toolbar@0.15.3"></script>
<script>
(function(){
  const {Markmap, loadPlugins} = window.markmap;
  const {globals} = window.markmapToolbar;
  
  // 注册工具栏插件
  if (globals) {
    globals.mindmap = {};
  }

  // 生成思维导图
  const mindmap = Markmap.create('svg#mindmap', null, ${JSON.stringify(root)});
  
  // 添加工具栏
  if (window.markmapToolbar) {
    const {Toolbar} = window.markmapToolbar;
    const toolbar = new Toolbar();
    toolbar.attach(mindmap);
    toolbar.setItems([
      'zoomIn', 'zoomOut', 'fit', 'toggleFullscreen',
      {type: 'separator'},
      'screenshot'
    ]);
  }
})();
</script>
</body>
</html>`;
      
      // 返回HTML响应
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
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