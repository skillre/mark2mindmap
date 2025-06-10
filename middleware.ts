import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 这个中间件用来处理跨域请求和设置响应头
export function middleware(request: NextRequest) {
  // 获取响应对象
  const response = NextResponse.next()

  // 设置CORS头部，允许跨域请求
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key')
  
  return response
}

// 配置中间件只应用于API路由
export const config = {
  matcher: '/api/:path*',
} 