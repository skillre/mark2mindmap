# Mark2MindMap - Markdown转思维导图工具

![Mark2MindMap Banner](https://via.placeholder.com/800x200/3b82f6/FFFFFF?text=Mark2MindMap)

Mark2MindMap是一个基于Web的工具，可以将Markdown文本快速转换为美观的、交互式的思维导图。项目采用Next.js构建，提供在线编辑器与API服务，让思维导图创建变得简单高效。

## ✨ 特性

- 💻 **直观的Web界面** - 简洁美观的用户界面，即写即得
- 🔄 **实时预览** - 边写Markdown边看思维导图效果
- 📤 **多格式导出** - 支持导出SVG和HTML格式
- 🔌 **REST API** - 提供API服务，方便集成到其他应用
- 🔐 **API鉴权** - 采用API密钥认证，保护您的服务不被滥用
- 🌍 **CORS支持** - 允许跨域请求，便于前端应用集成
- 📋 **丰富的Markdown支持** - 兼容标题层级、列表、代码块、链接等格式

## 🚀 在线体验

访问我们的[在线演示](https://mark2mindmap.vercel.app)，立即体验：
- 在线编辑器：https://mark2mindmap.vercel.app/editor
- API测试：https://mark2mindmap.vercel.app/api-test
- API文档：https://mark2mindmap.vercel.app/api-docs

## 🛠️ 技术栈

- [Next.js](https://nextjs.org/) - React框架
- [markmap-lib](https://markmap.js.org/) - Markdown思维导图转换库
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Vercel](https://vercel.com/) - 部署平台

## 📋 安装与使用

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn

### 本地安装

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

3. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
```

## 🔌 API使用指南

### 认证

所有API请求都需要通过`x-api-key`请求头进行认证：

```
x-api-key: your-api-key-here
```

### 生成思维导图

**请求示例：**

```bash
curl -X POST \
  https://mark2mindmap.vercel.app/api/markdown-to-mindmap \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: your-api-key-here' \
  -d '{
  "markdown": "# 这是标题\n## 这是子标题\n- 这是列表项\n  - 这是嵌套列表项",
  "title": "我的思维导图",
  "filename": "my-mindmap.html"
}' \
  -o my-mindmap.html
```

**参数说明：**

| 参数 | 类型 | 必填 | 描述 |
|------|-----|------|-----|
| markdown | string | 是 | Markdown格式的文本内容 |
| title | string | 否 | HTML文件的标题（默认为'Markdown MindMap'） |
| filename | string | 否 | 下载的HTML文件名（默认为'mindmap.html'） |

**响应：**

服务器将返回一个HTML文件，其中包含可交互的思维导图。文件可离线使用，并完全支持交互功能。

## 🔧 配置

可通过环境变量进行配置：

```
# API密钥，用于API鉴权
API_KEY=your-api-key-here
```

## 🚀 部署

### Vercel部署

项目已针对Vercel平台进行优化，可一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fmark2mindmap)

部署后，请在Vercel项目设置中添加环境变量`API_KEY`。

## 📚 Markdown支持

支持的Markdown格式包括：

- 标题（H1-H6）
- 有序和无序列表
- 嵌套列表
- 粗体和斜体文本
- 链接和图片
- 代码块和行内代码
- 表格

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出功能建议！

1. Fork 该仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 发起Pull Request

## 📄 许可证

该项目基于 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 📧 联系方式

如有任何问题，请通过以下方式联系：

- 项目维护者：[您的名字](mailto:your.email@example.com)
- 项目仓库：[Github](https://github.com/yourusername/mark2mindmap)

---

<p align="center">用 ❤️ 制作</p> 