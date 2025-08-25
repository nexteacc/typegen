/**
 * 文本转换API路由
 * Next.js 15 App Router API端点
 */

import { NextRequest, NextResponse } from 'next/server';
import { TransformService } from '@/lib/transform-service';
import { TransformRequest, TransformResponse, ApiErrorCode } from '@/lib/api-types';

// 创建转换服务实例
const transformService = new TransformService();

/**
 * 处理POST请求 - 文本风格转换
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const requestData: TransformRequest = await request.json();
    

    // 基本参数验证
    if (!requestData.text || !requestData.style) {
      return NextResponse.json({
        success: false,
        error: {
          code: ApiErrorCode.INVALID_INPUT,
          message: '缺少必要参数: text 和 style 不能为空'
        }
      } as TransformResponse, { status: 400 });
    }

    // 调用转换服务
    const result = await transformService.transform(
      requestData.text, 
      requestData.style
    );


    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: result
    } as TransformResponse);

  } catch (error: unknown) {
    // 根据错误类型返回相应的错误码
    const err = error as { message?: string };
    let errorCode = ApiErrorCode.INTERNAL_ERROR;
    let statusCode = 500;
    
    if (err.message?.includes('文本长度')) {
      errorCode = ApiErrorCode.TEXT_TOO_LONG;
      statusCode = 400;
    } else if (err.message?.includes('不支持的风格')) {
      errorCode = ApiErrorCode.UNSUPPORTED_STYLE;
      statusCode = 400;
    } else if (err.message?.includes('不能为空')) {
      errorCode = ApiErrorCode.INVALID_INPUT;
      statusCode = 400;
    }

    return NextResponse.json({
      success: false,
      error: {
        code: errorCode,
        message: err.message || '服务暂时不可用，请稍后重试'
      }
    } as TransformResponse, { status: statusCode });
  }
}

/**
 * 处理GET请求 - API健康检查
 */
export async function GET() {
  return NextResponse.json({
    message: 'Transform API is running',
    supportedStyles: transformService.getSupportedStyles(),
    timestamp: new Date().toISOString()
  });
}