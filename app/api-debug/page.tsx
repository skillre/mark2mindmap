"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ApiDebugPage() {
  const [healthStatus, setHealthStatus] = useState<string>("检查中...");
  const [apiEndpoint, setApiEndpoint] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("api-test.html");

  useEffect(() => {
    // 获取当前域名作为API端点
    const origin = window.location.origin;
    setApiEndpoint(origin);
    
    // 检查API健康状态
    checkApiHealth(origin);
  }, []);

  const checkApiHealth = async (origin: string) => {
    try {
      const response = await fetch(`${origin}/api/health`, {
        method: "GET",
      });
      
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(`API服务正常运行 (${data.timestamp})`);
      } else {
        setHealthStatus(`API服务响应异常: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setHealthStatus(`无法连接到API服务: ${error}`);
    }
  };

  const testApiEndpoint = async () => {
    setLoading(true);
    setTestResult("");
    
    try {
      // 确保文件名有效
      const safeFilename = filename.trim() || "api-test.html";
      const finalFilename = safeFilename.endsWith('.html') ? safeFilename : `${safeFilename}.html`;
      
      const response = await fetch(`${apiEndpoint}/api/markdown-to-mindmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "default-api-key-for-development"
        },
        body: JSON.stringify({
          markdown: "# 测试标题\n## 子标题\n- 列表项1\n- 列表项2",
          title: "API测试",
          filename: finalFilename
        })
      });
      
      if (response.ok) {
        setTestResult(`API请求成功! 状态码: ${response.status}`);
        
        // 尝试下载结果
        const blob = await response.blob();
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = finalFilename; // 使用我们确定的文件名
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }
      } else {
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
    } catch (error) {
      setTestResult(`调用API出错: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">API调试工具</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          返回首页
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">API健康状态</h2>
        <div className={`p-4 rounded-md mb-4 ${
          healthStatus.includes("正常") 
            ? "bg-green-50 text-green-800" 
            : "bg-yellow-50 text-yellow-800"
        }`}>
          {healthStatus}
        </div>
        
        <button
          onClick={() => checkApiHealth(apiEndpoint)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重新检查
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">API连接测试</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="apiEndpoint" className="block mb-2 font-medium text-gray-700">
              API端点
            </label>
            <input
              type="text"
              id="apiEndpoint"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="输入API端点，例如https://your-domain.com"
            />
          </div>
          
          <div>
            <label htmlFor="filename" className="block mb-2 font-medium text-gray-700">
              下载文件名
            </label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="测试文件名，例如test.html"
            />
          </div>
        </div>
        
        <button
          onClick={testApiEndpoint}
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${
            loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "测试中..." : "测试API"}
        </button>
        
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
        
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">调试提示:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>确保API路径正确 (/api/markdown-to-mindmap)</li>
            <li>确保使用POST方法发送请求</li>
            <li>请求头必须包含"Content-Type: application/json"</li>
            <li>请求头必须包含"x-api-key"</li>
            <li>请求体必须包含有效的JSON，且包含"markdown"字段</li>
            <li>如果指定filename字段，浏览器端也必须使用相同的文件名</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 