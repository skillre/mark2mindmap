import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { getFromGitHub } from "../../../services/githubService";

// 定义文件存储路径
const STORAGE_DIR = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(process.cwd(), "public");
const MINDMAPS_DIR = path.join(STORAGE_DIR, "mindmaps");

// 是否启用GitHub存储
const USE_GITHUB_STORAGE = process.env.USE_GITHUB_STORAGE === 'true';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    console.log(`[mindmap-file] 请求文件: ${filename}`);
    
    // 安全检查：确保文件名不包含危险字符
    if (filename.includes("../") || filename.includes("..\\")) {
      console.error(`[mindmap-file] 无效的文件名: ${filename}`);
      return new NextResponse(
        JSON.stringify({ error: "无效的文件名" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    let fileContent: string | null = null;
    
    // 如果启用了GitHub存储，首先尝试从GitHub获取文件
    if (USE_GITHUB_STORAGE) {
      try {
        console.log(`[mindmap-file] 正在从GitHub获取: ${filename}`);
        // 从GitHub获取文件内容
        fileContent = await getFromGitHub(filename);
        console.log(`[mindmap-file] GitHub获取成功: ${filename}`);
        
        // 在生产环境中，同时保存到本地缓存，便于下次快速访问
        if (process.env.NODE_ENV === 'production') {
          try {
            const filePath = path.join(MINDMAPS_DIR, filename);
            await fsPromises.writeFile(filePath, fileContent);
            console.log(`[mindmap-file] 已缓存到本地: ${filename}`);
          } catch (cacheError) {
            console.error(`[mindmap-file] 缓存到本地失败: ${filename}`, cacheError);
            // 缓存失败不影响继续
          }
        }
      } catch (githubError) {
        console.error(`[mindmap-file] 从GitHub获取失败: ${filename}`, githubError);
        // 如果从GitHub获取失败，回退到本地文件查找
      }
    }
    
    // 如果从GitHub获取失败或未启用GitHub存储，尝试从本地获取
    if (!fileContent) {
      console.log(`[mindmap-file] 尝试从本地获取: ${filename}`);
      // 构建文件路径
      const filePath = path.join(MINDMAPS_DIR, filename);
      
      // 检查文件是否存在
      try {
        await fsPromises.access(filePath, fs.constants.R_OK);
        // 读取文件内容
        fileContent = await fsPromises.readFile(filePath, 'utf-8');
        console.log(`[mindmap-file] 成功从本地获取: ${filename}`);
      } catch (error) {
        console.error(`[mindmap-file] 文件不存在或无法访问: ${filePath}`, error);
        return new NextResponse(
          JSON.stringify({ error: "文件不存在或无法访问" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    
    // 返回HTML内容
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=86400", // 缓存1天
      },
    });
  } catch (error) {
    console.error("[mindmap-file] 获取文件时出错:", error);
    return new NextResponse(
      JSON.stringify({ error: "服务器内部错误" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 