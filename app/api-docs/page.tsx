"use client";

import { useState } from "react";
import Link from "next/link";

export default function ApiDocsPage() {
  // 示例代码
  const curlExample = `curl -X POST \\
  https://your-domain.com/api/markdown-to-mindmap \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: your-api-key-here' \\
  -d '{
  "markdown": "# 这是标题\\n## 这是子标题\\n- 这是列表项\\n  - 这是嵌套列表项",
  "title": "我的思维导图",
  "filename": "my-mindmap.html"
}' \\
  -o my-mindmap.html`;

  const jsonExample = `curl -X POST \\
  https://your-domain.com/api/markdown-to-mindmap \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: your-api-key-here' \\
  -H 'accept: application/json' \\
  -H 'x-expect-json: true' \\
  -d '{
  "markdown": "# 这是标题\\n## 这是子标题\\n- 这是列表项\\n  - 这是嵌套列表项",
  "title": "我的思维导图",
  "filename": "自定义名称.html"
}'`;

  const fetchExample = `const response = await fetch('https://your-domain.com/api/markdown-to-mindmap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key-here'
  },
  body: JSON.stringify({
    markdown: '# 这是标题\\n## 这是子标题\\n- 这是列表项\\n  - 这是嵌套列表项',
    title: '我的思维导图',
    filename: '自定义名称.html'
  })
});

if (response.ok) {
  // 获取HTML内容
  const htmlContent = await response.text();
  
  // 下载文件
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // 可以使用自定义文件名或从Content-Disposition获取文件名
  a.download = '自定义名称.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
} else {
  const errorData = await response.json();
  console.error('Error:', errorData);
}`;

  const jsonResponseExample = `{
  "success": true,
  "filename": "自定义名称.html",
  "contentType": "text/html",
  "metadata": {
    "title": "我的思维导图",
    "filename": "自定义名称.html",
    "type": "html",
    "format": "mindmap"
  },
  "content": "<!DOCTYPE html><html>...</html>"
}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">API 文档</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          返回首页
        </Link>
      </div>

      <div className="prose max-w-none">
        <section className="mb-8">
          <h2>概述</h2>
          <p>
            我们的API允许您将Markdown文本转换为思维导图HTML文件。您可以使用此API将思维导图功能集成到您自己的应用程序中。
            API支持两种响应格式：直接返回HTML文件或返回JSON响应（包含HTML内容和文件元数据）。
          </p>
        </section>

        <section className="mb-8">
          <h2>认证</h2>
          <p>
            所有API请求都需要使用API密钥进行认证。您需要在请求头中包含<code>x-api-key</code>字段。
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  请保管好您的API密钥，不要在公共场所分享或暴露它。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2>端点</h2>
          <h3>转换Markdown为思维导图HTML</h3>
          <div className="my-4">
            <p><strong>URL:</strong> <code>/api/markdown-to-mindmap</code></p>
            <p><strong>方法:</strong> <code>POST</code></p>
            <p><strong>内容类型:</strong> <code>application/json</code></p>
            <p><strong>响应类型:</strong> <code>text/html</code> (默认) 或 <code>application/json</code> (通过设置请求头)</p>
          </div>

          <h4>请求参数</h4>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">参数</th>
                <th className="px-4 py-2 border">类型</th>
                <th className="px-4 py-2 border">必填</th>
                <th className="px-4 py-2 border">描述</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">markdown</td>
                <td className="px-4 py-2 border">string</td>
                <td className="px-4 py-2 border">是</td>
                <td className="px-4 py-2 border">Markdown格式的文本内容</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">title</td>
                <td className="px-4 py-2 border">string</td>
                <td className="px-4 py-2 border">否</td>
                <td className="px-4 py-2 border">HTML文件的标题（默认为'Markdown MindMap'）</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">filename</td>
                <td className="px-4 py-2 border">string</td>
                <td className="px-4 py-2 border">否</td>
                <td className="px-4 py-2 border">下载的HTML文件名（默认为'mindmap.html'）</td>
              </tr>
            </tbody>
          </table>

          <h4 className="mt-4">请求头特殊设置</h4>
          <table className="min-w-full border mt-2">
            <thead>
              <tr>
                <th className="px-4 py-2 border">请求头</th>
                <th className="px-4 py-2 border">值</th>
                <th className="px-4 py-2 border">描述</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">accept</td>
                <td className="px-4 py-2 border">application/json</td>
                <td className="px-4 py-2 border">请求JSON格式响应</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">x-expect-json</td>
                <td className="px-4 py-2 border">true</td>
                <td className="px-4 py-2 border">请求JSON格式响应（用于确保兼容性）</td>
              </tr>
            </tbody>
          </table>

          <h4 className="mt-4">响应</h4>
          <p><strong>1. HTML响应（默认）</strong></p>
          <p>成功响应将返回一个HTML文件，包含可交互的思维导图。响应会以文件形式下载，文件名可通过请求参数指定。</p>
          <p>HTML文件包含完整的思维导图渲染所需的所有代码和样式，可以离线使用。</p>

          <p className="mt-4"><strong>2. JSON响应（通过设置请求头获取）</strong></p>
          <p>如果请求头中包含 <code>accept: application/json</code> 或 <code>x-expect-json: true</code>，API将返回JSON格式的响应，包含以下字段：</p>
          <ul className="list-disc list-inside pl-4">
            <li><code>success</code>: 布尔值，表示请求是否成功</li>
            <li><code>filename</code>: 指定的文件名</li>
            <li><code>content</code>: HTML内容（Base64编码或原始字符串）</li>
            <li><code>contentType</code>: 内容类型（通常为"text/html"）</li>
            <li><code>metadata</code>: 包含其他文件元数据的对象</li>
          </ul>
          <p>这种响应格式特别适用于通过API代理或平台调用API时使用。</p>
        </section>

        <section className="mb-8">
          <h2>使用示例</h2>
          
          <h3>1. 使用cURL获取HTML文件</h3>
          <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
            <pre>{curlExample}</pre>
          </div>
          
          <h3 className="mt-6">2. 使用cURL获取JSON响应</h3>
          <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
            <pre>{jsonExample}</pre>
          </div>
          
          <h3 className="mt-6">3. 使用JavaScript</h3>
          <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
            <pre>{fetchExample}</pre>
          </div>

          <h3 className="mt-6">4. JSON响应示例</h3>
          <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
            <pre>{jsonResponseExample}</pre>
          </div>
        </section>

        <section className="mb-8">
          <h2>使用JSON响应时的提示</h2>
          <p>
            当通过API代理或第三方平台调用API时，获取JSON格式的响应通常更容易处理。特别是当平台需要
            自定义文件名时，JSON响应中的 <code>filename</code> 字段可以被平台使用，确保文件名正确传递。
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  如果您通过第三方平台或服务调用此API，建议使用JSON响应格式并检查该平台的文件命名规则。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2>错误代码</h2>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">状态码</th>
                <th className="px-4 py-2 border">描述</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border">400</td>
                <td className="px-4 py-2 border">请求格式不正确，缺少必需的参数或Markdown格式错误</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">401</td>
                <td className="px-4 py-2 border">未授权访问，无效的API密钥</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border">500</td>
                <td className="px-4 py-2 border">服务器内部错误</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
} 