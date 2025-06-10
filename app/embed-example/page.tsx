"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function EmbedExample() {
  const [markdown, setMarkdown] = useState("# 思维导图示例\n## 第一章\n- 内容1\n- 内容2\n## 第二章\n- 内容3\n  - 子内容1\n  - 子内容2");
  const [iframeUrl, setIframeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateMindmap = async () => {
    if (!markdown) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/markdown-to-html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "default-api-key-for-development"
        },
        body: JSON.stringify({ markdown })
      });
      
      if (response.ok) {
        const html = await response.text();
        
        // 创建Blob URL动态更新iframe内容
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        
        // 设置iframe的src属性为生成的URL
        setIframeUrl(url);
      } else {
        const error = await response.json();
        alert(`生成失败: ${error.error}`);
      }
    } catch (error) {
      console.error("请求失败:", error);
      alert("请求失败，请检查控制台获取详细信息");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">思维导图嵌入示例</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          返回首页
        </Link>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Markdown 内容</label>
        <textarea 
          className="w-full h-40 p-3 border border-gray-300 rounded font-mono text-sm"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-8">
        <button 
          onClick={generateMindmap}
          disabled={loading}
          className={`px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? '生成中...' : '生成思维导图'}
        </button>
      </div>

      {iframeUrl && (
        <div>
          <h2 className="text-xl font-semibold mb-3">预览</h2>
          <div className="border border-gray-300 rounded">
            <iframe
              ref={iframeRef}
              src={iframeUrl}
              className="w-full h-[600px]"
              sandbox="allow-scripts"
              title="思维导图预览"
            ></iframe>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">嵌入代码</h2>
            <p className="mb-2 text-gray-600">将以下代码复制到您的网页中，即可嵌入这个思维导图：</p>
            <div className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
              <pre>{`<iframe
  src="${window.location.origin}/api/markdown-to-html"
  width="100%"
  height="600"
  style="border: 1px solid #ddd; border-radius: 4px;"
  sandbox="allow-scripts"
></iframe>

<!-- 使用JS发送POST请求生成思维导图 -->
<script>
  const iframe = document.querySelector('iframe');
  
  fetch('${window.location.origin}/api/markdown-to-html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your-api-key-here'
    },
    body: JSON.stringify({
      markdown: ${JSON.stringify(markdown)}
    })
  })
  .then(response => response.text())
  .then(html => {
    // 写入iframe内容
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
  });
</script>`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 