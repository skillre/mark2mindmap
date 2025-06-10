import { NextRequest, NextResponse } from "next/server";
import { Transformer } from "markmap-lib";

// 创建一个transformer实例
const transformer = new Transformer();

// API密钥验证函数
const validateApiKey = (apiKey: string | null) => {
  // 使用环境变量获取有效的API密钥
  const validApiKey = process.env.API_KEY || "default-api-key-for-development";
  return apiKey === validApiKey;
};

export async function POST(request: NextRequest) {
  try {
    // 验证API密钥
    const apiKey = request.headers.get("x-api-key");
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: "未授权访问，无效的API密钥" },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    
    // 验证请求体是否包含markdown字段
    if (!body || typeof body.markdown !== "string") {
      return NextResponse.json(
        { error: "请求格式不正确，缺少markdown字段" },
        { status: 400 }
      );
    }

    // 转换markdown为思维导图数据
    const { root, features } = transformer.transform(body.markdown);
    
    // 返回转换后的数据
    return NextResponse.json({ 
      success: true,
      data: { root, features } 
    });
  } catch (error) {
    console.error("处理请求时出错:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
} 