/**
 * API相关类型定义
 * 用于文本风格转换API的请求和响应
 */

// 转换请求接口
export interface TransformRequest {
  /** 原始文本内容 */
  text: string;
  /** 目标风格参数 */
  style: string;
  /** 可选配置参数 */
  options?: {
    /** 最大文本长度限制 */
    maxLength?: number;
    /** AI创造性参数 (0-1) */
    temperature?: number;
  };
}

// 转换结果数据
export interface TransformResult {
  /** 转换后的文本内容 */
  transformedText: string;
  /** 原始文本内容 */
  originalText: string;
  /** 使用的风格 */
  style: string;
  /** 处理时间（毫秒） */
  processingTime: number;
}

// API响应接口
export interface TransformResponse {
  /** 请求是否成功 */
  success: boolean;
  /** 成功时的数据 */
  data?: TransformResult;
  /** 失败时的错误信息 */
  error?: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
}

// API错误码枚举
export enum ApiErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  TEXT_TOO_LONG = 'TEXT_TOO_LONG',
  UNSUPPORTED_STYLE = 'UNSUPPORTED_STYLE',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// 支持的风格类型
export const SUPPORTED_STYLES = [
  // 原有风格
  'ap-style',
  'x-style', 
  'inverted-pyramid',
  'breaking-news',
  'academic',
  
  // 新增风格
  '4chan-style',
  'buzzfeed-style',
  'call-to-action',
  'citation-heavy',
  'fomo-driven',
  'hashtag-heavy',
  'headline-driven',
  'imrd-style',
  'investigative',
  'meme-style',
  'passive-voice',
  'threaded-post'
] as const;

export type SupportedStyle = typeof SUPPORTED_STYLES[number];