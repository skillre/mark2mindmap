"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestApiPage() {
  const [markdown, setMarkdown] = useState("# 测试标题\n## 子标题\n- 列表项1\n  - 嵌套项");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const iframeRef = useState<HTMLIFrameElement | null>(null);

  // 获取当前域名
  const getCurrentDomain = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "";
  };

  // 处理API调用
  const handleGenerateHTML = async () => {
    setLoading(true);

    try {
      const domain = getCurrentDomain();
      const response = await fetch(`${domain}/api/markdown-to-html`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "default-api-key-for-development"
        },
        body: JSON.stringify({ markdown })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 获取HTML内容
      const htmlContent = await response.text();
      
      // 创建Blob并生成URL
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      
      // 设置URL用于iframe
      setResultUrl(url);
    } catch (error) {
      console.error("调用API时出错:", error);
      alert("调用API失败，请检查控制台获取详细信息。");
    } finally {
      setLoading(false);
    }
  };

  // 在新窗口打开
  const openInNewWindow = () => {
    if (resultUrl) {
      window.open(resultUrl, "_blank");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">API测试页面</h1>
        <div className="flex gap-2">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            返回首页
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="mb-2 font-medium">Markdown输入</div>
          <textarea
            className="w-full h-[300px] p-3 border border-gray-300 rounded font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            spellCheck={false}
          ></textarea>

          <button
            onClick={handleGenerateHTML}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "生成中..." : "调用API生成思维导图HTML"}
          </button>

          {resultUrl && (
            <button
              onClick={openInNewWindow}
              className="ml-4 px-4 py-2 bg-secondary text-white rounded hover:bg-green-700"
            >
              在新窗口中打开
            </button>
          )}
        </div>
        
        {resultUrl && (
          <div>
            <div className="mb-2 font-medium">思维导图预览</div>
            <div className="border border-gray-300 rounded" style={{ height: "600px" }}>
              <iframe
                ref={iframeRef}
                src={resultUrl}
                className="w-full h-full"
                title="思维导图预览"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 