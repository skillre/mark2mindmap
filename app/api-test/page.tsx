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
  const [responseType, setResponseType] = useState<"html" | "json">("html");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jsonResponse, setJsonResponse] = useState<any>(null);
  
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
    setJsonResponse(null);
    
    try {
      // 构建API请求URL
      const apiUrl = window.location.origin + "/api/markdown-to-mindmap";
      
      // 发送请求
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          ...(responseType === "json" ? { "x-expect-json": "true", "accept": "application/json" } : {})
        },
        body: JSON.stringify({
          markdown,
          title,
          filename: filename.trim() || "mindmap.html" // 使用用户提供的文件名或默认值
        })
      });
      
      if (response.ok) {
        if (responseType === "json") {
          // 获取JSON响应
          const jsonData = await response.json();
          setJsonResponse(jsonData);
          setTestResult(`API请求成功! 状态码: ${response.status}`);
        } else {
          // 获取HTML响应并下载
          const htmlContent = await response.text();
          setTestResult(`API请求成功! 状态码: ${response.status}`);
          
          // 创建Blob并下载
          const blob = new Blob([htmlContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          
          // 创建下载链接并点击
          const a = document.createElement("a");
          a.href = url;
          a.download = filename.trim() || "mindmap.html";
          document.body.appendChild(a);
          a.click();
          a.remove();
          
          // 释放URL
          URL.revokeObjectURL(url);
        }
      } else {
        // 处理错误响应
        let errorText;
        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
        } catch (e) {
          errorText = await response.text();
          if (!errorText) errorText = `${response.status} ${response.statusText}`;
        }
        setTestResult(`API请求失败: ${errorText}`);
      }
    } catch (err: any) {
      setTestResult(`调用API出错: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const [testResult, setTestResult] = useState<string>("");
  
  // 处理JSON响应中的HTML下载
  const handleDownloadHtml = () => {
    if (!jsonResponse || !jsonResponse.content) return;
    
    const blob = new Blob([jsonResponse.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = jsonResponse.filename || filename || "mindmap.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    
    URL.revokeObjectURL(url);
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
          
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">响应格式</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="responseType"
                  value="html"
                  checked={responseType === "html"}
                  onChange={() => setResponseType("html")}
                  className="mr-2"
                />
                HTML文件（直接下载）
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="responseType"
                  value="json"
                  checked={responseType === "json"}
                  onChange={() => setResponseType("json")}
                  className="mr-2"
                />
                JSON格式（适用于API代理）
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500">JSON格式适用于通过API代理/平台调用时获取文件名</p>
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
          
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              loading ? "bg-blue-400" : "bg-primary hover:bg-blue-700"
            }`}
          >
            {loading ? "正在生成..." : "生成思维导图"}
          </button>
        </form>
        
        {testResult && (
          <div className={`mt-4 p-4 rounded-md ${
            testResult.includes("成功") 
              ? "bg-green-50 text-green-800" 
              : "bg-red-50 text-red-800"
          }`}>
            <h3 className="font-medium mb-2">测试结果:</h3>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}
        
        {jsonResponse && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">JSON响应:</h3>
              {jsonResponse.content && (
                <button
                  onClick={handleDownloadHtml}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  下载HTML文件
                </button>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(jsonResponse, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 