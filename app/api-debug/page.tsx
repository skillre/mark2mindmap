"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ApiDebugPage() {
  const [healthStatus, setHealthStatus] = useState<string>("检查中...");
  const [apiEndpoint, setApiEndpoint] = useState<string>("");
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [customFilename, setCustomFilename] = useState<string>("test-mindmap.html");

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
      const response = await fetch(`${apiEndpoint}/api/markdown-to-mindmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "default-api-key-for-development"
        },
        body: JSON.stringify({
          markdown: "# 测试标题\n## 子标题\n- 列表项1\n- 列表项2",
          title: "API测试",
          filename: customFilename
        })
      });
      
      if (response.ok) {
        // 尝试从响应头中获取文件名
        const contentDisposition = response.headers.get('content-disposition');
        const xFilename = response.headers.get('x-filename');
        
        setTestResult(`API请求成功! 状态码: ${response.status}\n` +
                      `Content-Disposition: ${contentDisposition || '未设置'}\n` + 
                      `X-Filename: ${xFilename || '未设置'}`);
        
        // 尝试下载结果
        const blob = await response.blob();
        if (blob.size > 0) {
          // 保存下载的文件
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = customFilename; // 使用我们提供的文件名
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          
          // 检查下载的内容中是否包含文件名信息
          try {
            const htmlText = await blob.text();
            const filenameMetaMatch = htmlText.match(/<meta name="markmap-filename" content="([^"]+)">/);
            const metadataMatch = htmlText.match(/<script type="application\/json" id="markmap-metadata">[\s\S]*?filename":"([^"]+)"[\s\S]*?<\/script>/);
            
            if (filenameMetaMatch || metadataMatch) {
              setTestResult(prev => prev + '\n\n文件内嵌入的文件名信息:\n' + 
                `Meta标签: ${filenameMetaMatch ? filenameMetaMatch[1] : '未找到'}\n` +
                `JSON元数据: ${metadataMatch ? metadataMatch[1] : '未找到'}`);
            }
          } catch (readError) {
            console.error("无法读取下载的文件内容", readError);
          }
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
        <div className="mb-4">
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

        <div className="mb-4">
          <label htmlFor="customFilename" className="block mb-2 font-medium text-gray-700">
            自定义文件名
          </label>
          <input
            type="text"
            id="customFilename"
            value={customFilename}
            onChange={(e) => setCustomFilename(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="输入自定义文件名，例如my-mindmap.html"
          />
          <p className="mt-1 text-xs text-gray-500">测试API时使用的文件名，将在请求中发送，影响最终下载的文件名</p>
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
          <div className={`mt-4 p-4 rounded-md overflow-auto ${
            testResult.includes("成功") 
              ? "bg-green-50 text-green-800" 
              : "bg-red-50 text-red-800"
          }`}>
            <h3 className="font-medium mb-2">测试结果:</h3>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">文件名处理说明:</h3>
          <p className="text-sm mb-2">
            当API返回思维导图HTML文件时，文件名信息会以多种方式传递:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>HTTP响应头的Content-Disposition字段</li>
            <li>HTTP响应头的自定义X-Filename字段</li>
            <li>HTML文件的meta标签中(name="markmap-filename")</li>
            <li>HTML文件中的JSON元数据(id="markmap-metadata")</li>
            <li>HTML文件中的JavaScript全局变量(window.markmapFilename)</li>
          </ul>
          <p className="text-sm mt-2">
            尝试使用不同的文件名并下载结果，查看文件名是否正确应用。
          </p>
        </div>
      </div>
    </div>
  );
} 