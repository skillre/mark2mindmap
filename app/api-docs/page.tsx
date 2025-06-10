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
  "markdown": "# 这是标题\\n## 这是子标题\\n- 这是列表项\\n  - 这是嵌套列表项"
}'`;

  const fetchExample = `const response = await fetch('https://your-domain.com/api/markdown-to-mindmap', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key-here'
  },
  body: JSON.stringify({
    markdown: '# 这是标题\\n## 这是子标题\\n- 这是列表项\\n  - 这是嵌套列表项'
  })
});

const data = await response.json();
// 使用返回的思维导图数据
console.log(data);`;

  const responseExample = `{
  "success": true,
  "data": {
    "root": {
      "type": "heading",
      "depth": 1,
      "payload": { "lines": [0, 1] },
      "content": "这是标题",
      "children": [
        {
          "type": "heading",
          "depth": 2,
          "payload": { "lines": [1, 2] },
          "content": "这是子标题",
          "children": [
            {
              "type": "list_item",
              "depth": 1,
              "payload": { "lines": [2, 3] },
              "content": "这是列表项",
              "children": [
                {
                  "type": "list_item",
                  "depth": 2,
                  "payload": { "lines": [3, 4] },
                  "content": "这是嵌套列表项"
                }
              ]
            }
          ]
        }
      ]
    },
    "features": {
      "linkify": false,
      "katex": false
    }
  }
}`;

  // HTML API示例
  const htmlCurlExample = `curl -X POST \\
  https://your-domain.com/api/markdown-to-html \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: your-api-key-here' \\
  -d '{
  "markdown": "# 这是标题\\n## 这是子标题\\n- 这是列表项\\n  - 这是嵌套列表项"
}' \\
  -o mindmap.html`;

  const htmlFetchExample = `// 获取HTML格式的思维导图
const response = await fetch('https://your-domain.com/api/markdown-to-html', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key-here'
  },
  body: JSON.stringify({
    markdown: '# 这是标题\\n## 这是子标题\\n- 这是列表项\\n  - 这是嵌套列表项'
  })
});

// 获取HTML文本
const htmlContent = await response.text();

// 在新窗口中显示思维导图
const newWindow = window.open();
newWindow.document.write(htmlContent);
newWindow.document.close();`;

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
            我们的API允许您将Markdown文本转换为思维导图数据。您可以使用此API将思维导图功能集成到您自己的应用程序中。
            我们提供两种API端点：一个返回JSON数据，另一个返回完整的HTML页面。
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
          
          <div className="mb-12">
            <h3>1. 转换Markdown为思维导图JSON数据</h3>
            <div className="my-4">
              <p><strong>URL:</strong> <code>/api/markdown-to-mindmap</code></p>
              <p><strong>方法:</strong> <code>POST</code></p>
              <p><strong>内容类型:</strong> <code>application/json</code></p>
              <p><strong>响应类型:</strong> <code>application/json</code></p>
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
              </tbody>
            </table>

            <h4 className="mt-4">响应</h4>
            <p>成功响应将返回包含转换后思维导图数据的JSON对象。</p>
            
            <h4 className="mt-6">使用示例</h4>
            <h5>使用cURL</h5>
            <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <pre>{curlExample}</pre>
            </div>
            
            <h5 className="mt-4">使用JavaScript</h5>
            <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <pre>{fetchExample}</pre>
            </div>
            
            <h5 className="mt-4">响应示例</h5>
            <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <pre>{responseExample}</pre>
            </div>
          </div>
          
          <div className="mb-12">
            <h3>2. 转换Markdown为思维导图HTML</h3>
            <div className="my-4">
              <p><strong>URL:</strong> <code>/api/markdown-to-html</code></p>
              <p><strong>方法:</strong> <code>POST</code></p>
              <p><strong>内容类型:</strong> <code>application/json</code></p>
              <p><strong>响应类型:</strong> <code>text/html</code></p>
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
              </tbody>
            </table>

            <h4 className="mt-4">响应</h4>
            <p>成功响应将返回一个包含思维导图的完整HTML页面，可以直接在浏览器中查看。</p>
            
            <h4 className="mt-6">使用示例</h4>
            <h5>使用cURL</h5>
            <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <pre>{htmlCurlExample}</pre>
            </div>
            
            <h5 className="mt-4">使用JavaScript</h5>
            <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <pre>{htmlFetchExample}</pre>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    HTML响应包含完整的思维导图页面，可以直接嵌入iframe或在新窗口中打开。这对于想要快速集成思维导图而无需处理JSON数据的场景特别有用。
                  </p>
                </div>
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
                <td className="px-4 py-2 border">请求格式不正确，缺少必需的参数</td>
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