import { NextRequest, NextResponse } from "next/server";
import { Transformer } from "markmap-lib";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { saveToGitHub } from "../../services/githubService";

// 创建一个transformer实例
const transformer = new Transformer();

// 定义文件存储路径
// 在Vercel无服务器环境中，/tmp是唯一可写的目录
const STORAGE_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(process.cwd(), "public");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MINDMAPS_DIR = path.join(STORAGE_DIR, "mindmaps");
const PUBLIC_MINDMAPS_DIR = path.join(PUBLIC_DIR, "mindmaps");

// 是否启用GitHub存储
const USE_GITHUB_STORAGE = process.env.USE_GITHUB_STORAGE === 'true';

// 确保存储目录存在
const ensureDirectoryExists = async () => {
  try {
    // 检查并创建临时存储目录
    if (!fs.existsSync(MINDMAPS_DIR)) {
      await fsPromises.mkdir(MINDMAPS_DIR, { recursive: true });
    }
    
    // 确保public/mindmaps目录存在（仅在开发环境需要）
    if (process.env.NODE_ENV !== 'production' && !fs.existsSync(PUBLIC_MINDMAPS_DIR)) {
      await fsPromises.mkdir(PUBLIC_MINDMAPS_DIR, { recursive: true });
    }
  } catch (error) {
    console.error("创建目录时出错:", error);
    throw error;
  }
};

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
      // 确保目录存在
      await ensureDirectoryExists();
      
      // 转换markdown为思维导图数据
      const { root, features } = transformer.transform(body.markdown);
      
      // 获取文件名（如果提供）或使用默认文件名
      let filename = body.filename ? 
        (body.filename.endsWith('.html') ? body.filename : `${body.filename}.html`) : 
        'mindmap.html';
      
      // 防止文件名冲突，添加时间戳
      const timestamp = Date.now();
      const fileNameWithoutExt = filename.replace('.html', '');
      filename = `${fileNameWithoutExt}-${timestamp}.html`;
      
      // 创建HTML文件内容
      const htmlContent = generateMarkmapHtml(
        root, 
        body.title || 'Markdown MindMap', 
        filename
      );
      
      // 文件的完整路径
      const filePath = path.join(MINDMAPS_DIR, filename);
      
      // 保存文件到本地（临时）
      await fsPromises.writeFile(filePath, htmlContent);
      
      // 如果是在开发环境，还要复制到public目录
      if (process.env.NODE_ENV !== 'production') {
        const publicFilePath = path.join(PUBLIC_MINDMAPS_DIR, filename);
        await fsPromises.writeFile(publicFilePath, htmlContent);
      }
      
      // 获取Vercel服务基础URL
      const baseUrl = new URL(request.url).origin;
      
      // 构建Vercel服务URL - 始终使用Vercel API路由
      let fileUrl;
      if (process.env.NODE_ENV === 'production') {
        fileUrl = `${baseUrl}/api/mindmap-file/${filename}`;
      } else {
        fileUrl = `${baseUrl}/mindmaps/${filename}`;
      }
      
      let githubData = null;
      
      // 如果启用了GitHub存储，将文件保存到GitHub
      if (USE_GITHUB_STORAGE) {
        try {
          githubData = await saveToGitHub(filename, htmlContent);
          // 注意：这里我们不再使用GitHub的URL，而是继续使用Vercel的URL
        } catch (githubError) {
          console.error("保存到GitHub时出错:", githubError);
          // 记录错误，但不影响返回Vercel URL
        }
      }
      
      // 返回成功信息和文件URL（始终是Vercel URL）
      headers.set("Content-Type", "application/json");
      return new NextResponse(
        JSON.stringify({ 
          success: true, 
          message: "思维导图生成成功", 
          filename: filename,
          url: fileUrl,
          github: githubData,
          storageType: USE_GITHUB_STORAGE ? "github" : "vercel-tmp"
        }),
        { status: 200, headers }
      );
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