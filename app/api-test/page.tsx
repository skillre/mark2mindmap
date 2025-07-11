"use client";

import { useState } from "react";
import Link from "next/link";

export default function ApiTestPage() {
  const [markdown, setMarkdown] = useState(`# Markdown API测试

## 基本语法
- **粗体** 和 *斜体*
- ~~删除线~~
- [超链接](https://example.com)

## 列表示例
- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项 2.1
  - 嵌套列表项 2.2`);
  
  const [title, setTitle] = useState("API测试生成的思维导图");
  const [filename, setFilename] = useState("mindmap.html");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ success: boolean; message: string; filename: string; url: string } | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!markdown.trim()) {
      setError("请输入Markdown内容");
      return;
    }
    
    if (!apiKey.trim()) {
      setError("请输入API密钥");
      return;
    }
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      // 构建API请求URL
      const apiUrl = window.location.origin + "/api/markdown-to-mindmap";
      
      // 发送请求
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          markdown,
          title,
          filename: filename.trim() || "mindmap.html" // 使用用户提供的文件名或默认值
        })
      });
      
      if (!response.ok) {
        // 处理错误响应
        const errorData = await response.json();
        throw new Error(errorData.error || "API请求失败");
      }
      
      // 获取响应内容 - 现在是JSON格式
      const data = await response.json();
      
      // 设置结果数据
      setResult(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "生成思维导图时出错");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">API测试工具</h1>
        <div className="flex gap-2">
          <Link
            href="/api-docs"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            API文档
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            返回首页
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block mb-2 font-medium text-gray-700">
              API密钥
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="输入您的API密钥"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
                思维导图标题
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="输入思维导图标题"
              />
            </div>
            
            <div>
              <label htmlFor="filename" className="block mb-2 font-medium text-gray-700">
                文件名
              </label>
              <input
                type="text"
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="输入下载文件名"
              />
              <p className="mt-1 text-xs text-gray-500">如不包含.html后缀，将自动添加</p>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="markdown" className="block mb-2 font-medium text-gray-700">
              Markdown内容
            </label>
            <textarea
              id="markdown"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-64 p-2 border border-gray-300 rounded font-mono text-sm"
              placeholder="输入Markdown内容"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded">
              {error}
            </div>
          )}
          
          {result && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded">
              <p className="font-medium">{result.message}</p>
              <p className="mt-2">文件名: {result.filename}</p>
              <div className="mt-2">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  查看思维导图
                </a>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              loading ? "bg-blue-400" : "bg-primary hover:bg-blue-700"
            }`}
          >
            {loading ? "正在生成..." : "生成思维导图HTML"}
          </button>
        </form>
      </div>
    </div>
  );
} 