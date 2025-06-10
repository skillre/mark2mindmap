# Mark2MindMap - Markdown转思维导图工具

这是一个基于Next.js和markmap-cli构建的Web应用，可以将Markdown文本转换为交互式思维导图。

## 功能特点

- 将Markdown文本转换为思维导图
- 支持Markdown的标题结构、列表结构、超链接等格式
- 提供RESTful API接口，支持API鉴权
- 美观的用户界面，支持实时编辑预览
- 支持导出SVG格式的思维导图

## 快速开始

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/mark2mindmap.git
cd mark2mindmap
```

2. 安装依赖：

```bash
npm install
# 或
yarn
```

3. 创建环境变量文件：

复制`.env.example`文件并重命名为`.env.local`，然后根据需要修改其中的值。

```bash
cp .env.example .env.local
```

4. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

现在，您可以在浏览器中访问`http://localhost:3000`查看应用。

## API使用说明

### 转换Markdown为思维导图

**请求：**

```bash
POST /api/markdown-to-mindmap
Content-Type: application/json
x-api-key: your-api-key-here

{
  "markdown": "# 这是标题\n## 这是子标题\n- 这是列表项\n  - 这是嵌套列表项"
}
```

**响应：**

```json
{
  "success": true,
  "data": {
    "root": {
      "type": "heading",
      "depth": 1,
      "payload": { "lines": [0, 1] },
      "content": "这是标题",
      "children": [...]
    },
    "features": {
      "linkify": false,
      "katex": false
    }
  }
}
```

更多API使用信息，请查看应用中的API文档页面。

## 部署

该项目可以轻松部署到Vercel：

```bash
npm run build
# 或
vercel
```

## 技术栈

- [Next.js](https://nextjs.org/) - React框架
- [markmap-lib](https://markmap.js.org/) - Markdown思维导图转换库
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架

## 许可

[MIT](LICENSE) 