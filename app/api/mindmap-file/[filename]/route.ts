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
    
    // 安全检查：确保文件名不包含危险字符
    if (filename.includes("../") || filename.includes("..\\")) {
      return new NextResponse(
        JSON.stringify({ error: "无效的文件名" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 如果启用了GitHub存储，尝试从GitHub获取文件
    if (USE_GITHUB_STORAGE) {
      try {
        // 从GitHub获取文件内容
        const fileContent = await getFromGitHub(filename);
        
        // 返回HTML内容
        return new NextResponse(fileContent, {
          status: 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      } catch (githubError) {
        console.error(`从GitHub获取文件失败: ${filename}`, githubError);
        // 如果从GitHub获取失败，回退到本地文件查找
        // 继续执行后面的本地文件查找逻辑
      }
    }
    
    // 本地文件查找逻辑
    // 构建文件路径
    const filePath = path.join(MINDMAPS_DIR, filename);
    
    // 检查文件是否存在
    try {
      await fsPromises.access(filePath, fs.constants.R_OK);
    } catch (error) {
      console.error(`文件不存在或无法访问: ${filePath}`, error);
      return new NextResponse(
        JSON.stringify({ error: "文件不存在或无法访问" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // 读取文件内容
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');
    
    // 返回HTML内容
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("获取文件时出错:", error);
    return new NextResponse(
      JSON.stringify({ error: "服务器内部错误" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 