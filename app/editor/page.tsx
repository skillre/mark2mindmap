"use client";

import { useEffect, useRef, useState } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import Link from "next/link";

const transformer = new Transformer();

const defaultContent = `# Markdown思维导图示例

## 基本语法
- **粗体** 和 *斜体*
- ~~删除线~~
- [超链接](https://example.com)

## 列表示例
- 无序列表项 1
- 无序列表项 2
  - 嵌套列表项 2.1
  - 嵌套列表项 2.2
    - 更深层嵌套 2.2.1

## 代码示例
\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

## 表格示例
| 名称 | 描述 |
|------|------|
| 思维导图 | 可视化结构化信息 |
| Markdown | 轻量级标记语言 |`;

export default function EditorPage() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(false);
  const markmapRef = useRef<HTMLDivElement>(null);
  const mmRef = useRef<any>(null);

  const updateMarkmap = () => {
    if (markmapRef.current) {
      // 清除之前的实例
      markmapRef.current.innerHTML = "";
      
      // 转换markdown为思维导图数据
      const { root } = transformer.transform(content);
      
      // 渲染思维导图
      mmRef.current = Markmap.create(markmapRef.current, null, root);
    }
  };

  // 首次渲染和内容变化时更新思维导图
  useEffect(() => {
    const timer = setTimeout(() => {
      updateMarkmap();
    }, 300); // 延迟更新，避免频繁渲染
    
    return () => clearTimeout(timer);
  }, [content]);

  // 处理内容变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 导出SVG
  const handleExportSVG = () => {
    if (markmapRef.current && mmRef.current) {
      const svg = markmapRef.current.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = "mindmap.svg";
        link.click();
        
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Markdown思维导图编辑器</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportSVG}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
          >
            导出SVG
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            返回首页
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-2 font-medium">Markdown编辑器</div>
          <textarea
            className="w-full h-[600px] p-3 border border-gray-300 rounded font-mono text-sm"
            value={content}
            onChange={handleContentChange}
            spellCheck={false}
          ></textarea>
        </div>
        
        <div>
          <div className="mb-2 font-medium">思维导图预览</div>
          <div className="mindmap-wrapper">
            <div ref={markmapRef} className="markmap"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 