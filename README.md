# Mark2MindMap - Markdown转思维导图工具

![Mark2MindMap Banner](https://skillre-typora.oss-cn-beijing.aliyuncs.com/img/markdown%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE%E7%94%9F%E6%88%90%E5%99%A8.png)

Mark2MindMap是一个基于Web的工具，可以将Markdown文本快速转换为美观的、交互式的思维导图。项目采用Next.js构建，提供在线编辑器与API服务，让思维导图创建变得简单高效。

## ✨ 特性

- 💻 **直观的Web界面** - 简洁美观的用户界面，即写即得
- 🔄 **实时预览** - 边写Markdown边看思维导图效果
- 📤 **多格式导出** - 支持导出SVG和HTML格式
- 🔌 **REST API** - 提供API服务，方便集成到其他应用
- 🔐 **API鉴权** - 采用API密钥认证，保护您的服务不被滥用
- 🌍 **CORS支持** - 允许跨域请求，便于前端应用集成
- 📋 **丰富的Markdown支持** - 兼容标题层级、列表、代码块、链接等格式
- 📦 **GitHub存储** - 支持将生成的思维导图存储在GitHub仓库，实现数据持久化

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
- [GitHub API](https://docs.github.com/en/rest) - 用于文件持久化存储

## 📋 安装与使用

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn
- GitHub账号（如果需要使用GitHub存储功能）

### 本地安装

1. 克隆仓库：

```bash
git clone https://github.com/skillre/mark2mindmap.git
cd mark2mindmap
```

2. 安装依赖：

```bash
npm install
# 或
yarn
```

3. 配置环境变量：

创建一个`.env.local`文件，添加以下配置：

```
# API密钥配置
API_KEY=your-api-key-here

# GitHub 配置 (可选，仅当需要GitHub存储时配置)
USE_GITHUB_STORAGE=true
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_OWNER=your-github-username-or-org
GITHUB_REPO=your-repository-name
GITHUB_BRANCH=main
# 如果使用GitHub Pages，可以设置这个变量，否则使用raw.githubusercontent.com URL
# GITHUB_PAGES_URL=https://your-username.github.io/your-repo
```

4. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

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

服务器将返回一个JSON响应，包含生成的思维导图URL和相关信息。

## 🔧 配置

可通过环境变量进行配置：

```
# API密钥，用于API鉴权
API_KEY=your-api-key-here

# GitHub存储配置（可选）
USE_GITHUB_STORAGE=true
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_OWNER=your-github-username-or-org
GITHUB_REPO=your-repository-name
GITHUB_BRANCH=main
```

### GitHub存储配置说明

1. **创建GitHub个人访问令牌**：
   - 访问 GitHub 设置 -> Developer settings -> Personal access tokens -> Fine-grained tokens
   - 创建一个新令牌，至少需要有对目标仓库的读写权限
   - 将生成的令牌保存为 `GITHUB_TOKEN` 环境变量

2. **配置目标仓库**：
   - `GITHUB_OWNER`：您的GitHub用户名或组织名
   - `GITHUB_REPO`：用于存储思维导图的仓库名
   - `GITHUB_BRANCH`：存储文件的分支名（默认为main）

3. **启用GitHub存储**：
   - 设置 `USE_GITHUB_STORAGE=true`

## 🚀 部署

### Vercel部署

项目已针对Vercel平台进行优化，可一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fmark2mindmap)

部署后，请在Vercel项目设置中添加以下环境变量：
- `API_KEY`：API访问密钥
- `USE_GITHUB_STORAGE`：设置为true启用GitHub存储
- `GITHUB_TOKEN`：GitHub个人访问令牌
- `GITHUB_OWNER`：GitHub用户名/组织名
- `GITHUB_REPO`：用于存储思维导图的仓库名
- `GITHUB_BRANCH`：分支名（可选）

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

<aside>
<img src="https://skillre-typora.oss-cn-beijing.aliyuncs.com/img/225045z10hbz41wglw0xk4.png.icon.ico" alt="https://skillre-typora.oss-cn-beijing.aliyuncs.com/img/225045z10hbz41wglw0xk4.png.icon.ico" width="40px" />

博客地址：[skillre](https://note.skillre.online/technology/2025/05/204f54d5-99e6-805c-b076-fe918f2227fb)

</aside>

<aside>
<img src="https://skillre-typora.oss-cn-beijing.aliyuncs.com/img/github-mark.png" alt="https://skillre-typora.oss-cn-beijing.aliyuncs.com/img/github-mark.png" width="40px" />

项目仓库：[Github](https://github.com/skillre/notion2ics)

</aside>

## ☕️☕️

觉得有帮助，可以奖励作者一杯☕️，持续做出好用的工具。

![](https://skillre-typora.oss-cn-beijing.aliyuncs.com/img/paycode.jpeg)

---

希望这个工具能帮助您更好地管理日程安排！如果有任何问题或建议，请通过博客主页或GitHub Issues联系我。

# Markdown到思维导图转换API

该项目提供了一个API，用于将Markdown文本转换为交互式思维导图HTML文件。

## 功能特点

- 将Markdown文本转换为可视化的思维导图
- 支持自定义文件名和标题
- API密钥认证
- 生成的思维导图文件存储在服务器上，并返回可访问的URL
- 支持GitHub存储，实现数据持久化

## 存储实现说明

本项目支持两种存储方案：

1. **本地/临时存储**:
   - **开发环境**: 文件保存在项目的`public/mindmaps`目录，可通过`/mindmaps/{filename}`直接访问
   - **生产环境(Vercel)**: 文件保存在Vercel函数的`/tmp`目录，通过API路由`/api/mindmap-file/{filename}`提供访问

2. **GitHub存储**:
   - 文件永久存储在GitHub仓库的指定位置
   - 可通过GitHub Raw URL访问（如`https://raw.githubusercontent.com/user/repo/branch/mindmaps/filename.html`）
   - 实现数据持久化，解决Vercel无服务器环境下临时存储的限制

### 无服务器环境的限制

在Vercel等无服务器环境中使用本地文件存储有以下限制：

1. **临时存储**: Vercel的无服务器函数是无状态的，每次执行函数时文件系统可能会重置。
2. **不共享存储**: 不同的函数实例之间不共享文件系统。
3. **存储容量**: `/tmp`目录有存储空间限制。

### GitHub存储的优势

使用GitHub存储方案可以解决以下问题：

1. **数据持久化**: 文件永久存储在GitHub仓库中，不会因服务器实例重启而丢失。
2. **版本控制**: 自动获得Git提供的版本控制功能。
3. **无服务器友好**: 完全兼容Vercel等无服务器平台的限制。
4. **零成本**: 使用GitHub免费存储，无需额外付费。

## 本地开发

1. 克隆此仓库
2. 安装依赖: `npm install`
3. 设置环境变量:
   ```
   API_KEY=your-secure-api-key
   USE_GITHUB_STORAGE=true
   GITHUB_TOKEN=your-github-personal-access-token
   GITHUB_OWNER=your-github-username
   GITHUB_REPO=your-repository-name
   ```
4. 启动开发服务器: `npm run dev`

## API使用

详细的API使用说明请参阅应用内的API文档页面。