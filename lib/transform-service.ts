/**
 * 文本转换服务
 * 处理文本风格转换的核心业务逻辑
 * 现已集成OpenAI API进行真实的文本风格转换
 */

import { TransformResult, SUPPORTED_STYLES, SupportedStyle } from './api-types';
import { OpenAIService } from './openai-service';

export class TransformService {
  private readonly openaiService: OpenAIService;
  
  constructor() {
    this.openaiService = new OpenAIService();
  }

  /**
   * 执行文本风格转换
   * @param text 原始文本
   * @param style 目标风格
   * @returns 转换结果
   */
  async transform(text: string, style: string): Promise<TransformResult> {
    try {
      // 直接使用OpenAI服务进行转换
      return await this.openaiService.transform(text, style);
    } catch (error) {
      console.error('Transform service error:', error);
      throw error;
    }
  }

  /**
   * 获取支持的风格列表
   */
  getSupportedStyles(): readonly SupportedStyle[] {
    return SUPPORTED_STYLES;
  }
}