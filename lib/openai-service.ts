/**
 * OpenAI文本风格转换服务
 * 使用OpenAI API实现真实的文本风格转换
 */

import OpenAI from 'openai';
import { TransformResult, SupportedStyle, SUPPORTED_STYLES, ApiErrorCode } from './api-types';

// 风格转换提示词模板
const STYLE_PROMPTS: Record<SupportedStyle, string> = {
  'ap-style': '将以下文本转换为美联社风格的新闻报道。保持客观、简洁、直接，注重事实准确性，使用清晰的标题和结构。',
  'x-style': '将以下文本转换为社交媒体X(Twitter)风格。简洁有力，加入相关话题标签，使用简短段落和表情符号增强表现力。',
  'inverted-pyramid': '将以下文本重写为倒金字塔结构的新闻。最重要的信息放在开头，然后是次要细节和背景信息。适合快速阅读和理解。',
  'breaking-news': '将以下文本转换为突发新闻风格。使用紧急感和时效性语言，短小精悍的段落，强调事件的即时性和重要性。',
  'academic': '将以下文本转换为学术风格。使用正式语言、专业术语、清晰的结构和论证，注重引用和证据支持，以及学术界常用的表达方式。'
};

export class OpenAIService {
  private readonly openai: OpenAI;
  private readonly MAX_TEXT_LENGTH = 5000;
  private readonly DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  private readonly DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '2000');
  private readonly DEFAULT_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
  private readonly MAX_RETRIES = parseInt(process.env.API_MAX_RETRIES || '3');
  private readonly TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000');
  
  constructor() {
    // 初始化OpenAI客户端
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: this.TIMEOUT
    });
    
    // 验证API密钥配置
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OpenAI API密钥未配置，请在.env.local文件中设置OPENAI_API_KEY');
    }
  }
  
  /**
   * 执行文本风格转换
   * @param text 原始文本
   * @param style 目标风格
   * @returns 转换结果
   */
  async transform(text: string, style: string): Promise<TransformResult> {
    const startTime = Date.now();
    
    try {
      // 输入验证
      this.validateInput(text, style);
      
      // 获取风格提示词
      const stylePrompt = this.getStylePrompt(style as SupportedStyle);
      
      // 构建完整提示词
      const fullPrompt = `${stylePrompt}\n\n原文:\n${text}\n\n转换后的文本:`;
      
      console.log('🔄 Calling OpenAI API with style:', style);
      
      // 使用重试机制调用OpenAI API
      const response = await this.retryApiCall(async () => {
        return await this.openai.chat.completions.create({
          model: this.DEFAULT_MODEL,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的文本风格转换助手，能够将输入文本转换为指定的写作风格，同时保持原始内容的完整性。'
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          max_tokens: this.DEFAULT_MAX_TOKENS,
          temperature: this.DEFAULT_TEMPERATURE,
        });
      });
      
      // 提取生成的文本
      const transformedText = response.choices[0]?.message?.content?.trim() || '';
      
      // 处理空响应
      if (!transformedText) {
        throw new Error('API返回了空响应，请重试');
      }
      
      console.log('✅ OpenAI API 响应成功:', {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      });
      
      return {
        transformedText,
        originalText: text,
        style,
        processingTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      
      // 转换OpenAI API错误为应用错误
      if (error.status === 429) {
        throw new Error('API请求频率超限，请稍后再试');
      } else if (error.status === 400) {
        throw new Error('无效的API请求参数');
      } else if (error.status === 401) {
        throw new Error('OpenAI API密钥无效或已过期');
      } else if (error.status === 500) {
        throw new Error('OpenAI服务暂时不可用，请稍后再试');
      }
      
      // 重新抛出原始错误
      throw error;
    }
  }
  
  /**
   * 验证输入参数
   */
  private validateInput(text: string, style: string): void {
    // 检查文本是否为空
    if (!text || text.trim().length === 0) {
      throw new Error('文本内容不能为空');
    }
    
    // 检查文本长度
    if (text.length > this.MAX_TEXT_LENGTH) {
      throw new Error(`文本长度不能超过 ${this.MAX_TEXT_LENGTH} 个字符`);
    }
    
    // 检查风格是否支持
    if (!SUPPORTED_STYLES.includes(style as SupportedStyle)) {
      throw new Error(`不支持的风格类型: ${style}`);
    }
  }
  
  /**
   * 获取风格对应的提示词
   */
  private getStylePrompt(style: SupportedStyle): string {
    return STYLE_PROMPTS[style] || '将以下文本转换为指定风格';
  }
  
  /**
   * 获取支持的风格列表
   */
  getSupportedStyles(): readonly SupportedStyle[] {
    return SUPPORTED_STYLES;
  }
  
  /**
   * API调用重试机制
   * @param apiCall API调用函数
   * @returns API响应
   */
  private async retryApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`🔄 API调用尝试 ${attempt}/${this.MAX_RETRIES}`);
        return await apiCall();
      } catch (error: any) {
        lastError = error;
        console.warn(`⚠️ API调用失败 (${attempt}/${this.MAX_RETRIES}):`, error.message);
        
        // 如果是不可重试的错误，直接抛出
        if (this.isNonRetryableError(error)) {
          console.log('🚫 不可重试错误，停止重试');
          throw error;
        }
        
        // 如果不是最后一次尝试，等待一段时间后重试
        if (attempt < this.MAX_RETRIES) {
          const delay = this.getRetryDelay(attempt);
          console.log(`⏳ 等待 ${delay}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    console.error(`❌ 所有重试失败，抛出最后一次错误`);
    throw lastError;
  }
  
  /**
   * 检查是否为不可重试的错误
   */
  private isNonRetryableError(error: any): boolean {
    // 400系列错误通常不可重试（除了429限流）
    if (error.status >= 400 && error.status < 500 && error.status !== 429) {
      return true;
    }
    
    return false;
  }
  
  /**
   * 获取重试延迟时间（指数退避）
   */
  private getRetryDelay(attempt: number): number {
    // 指数退避：2^attempt * 1000ms + 随机抖动
    const baseDelay = Math.pow(2, attempt - 1) * 1000;
    const jitter = Math.random() * 500; // 最大500ms随机抖动
    return baseDelay + jitter;
  }
}
