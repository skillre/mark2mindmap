"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Markdown思维导图生成器
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            轻松将Markdown文本转换为交互式思维导图
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">在线编辑器</h2>
            <p className="text-gray-600 mb-4">
              使用我们的在线编辑器，直接输入Markdown文本并实时预览生成的思维导图
            </p>
            <Link href="/editor" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700">
              开始使用
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">API服务</h2>
            <p className="text-gray-600 mb-4">
              通过简单的HTTP请求，将我们的思维导图生成功能集成到您自己的应用程序中
            </p>
            <Link href="/api-docs" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-green-700">
              查看文档
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">支持的功能</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Markdown标题结构 (H1-H6)</li>
            <li>无序列表和有序列表</li>
            <li>超链接和图片</li>
            <li>代码块和行内代码</li>
            <li>实时预览和交互</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 