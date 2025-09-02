/**
 * OpenAI文本风格转换服务
 * 使用OpenAI API实现真实的文本风格转换
 */

import OpenAI from 'openai';
import { TransformResult, SupportedStyle, SUPPORTED_STYLES } from './api-types';

// 风格转换提示词模板
// 原则：知名标准化风格使用简洁指令，特殊要求风格提供详细指导
const STYLE_PROMPTS: Record<SupportedStyle, string> = {
  // 原有风格 - 已优化
  'ap-style': 'Transform into AP Style journalism.',
  'x-style': 'Transform into social media X (Twitter) style with hashtags and emojis.',
  'inverted-pyramid': 'Rewrite using inverted pyramid structure: most important information first, then supporting details.',
  'breaking-news': 'Transform into breaking news style with urgent, immediate language.',
  'academic': 'Transform into academic writing style.',
  
  // 新增风格 - 平衡简洁与必要指导
  '4chan-style': 'Transform into 4chan/anonymous forum style with internet slang and direct tone.',
  'buzzfeed-style': 'Transform into BuzzFeed style.',
  'call-to-action': 'Transform into compelling call-to-action style with action verbs and urgency.',
  'citation-heavy': 'Transform into citation-heavy academic style with numerous references.',
  'fomo-driven': 'Transform into FOMO (Fear of Missing Out) style with urgency and scarcity language.',
  'hashtag-heavy': 'Transform into hashtag-heavy social media style with numerous relevant hashtags.',
  'headline-driven': 'Transform into headline-driven content with attention-grabbing techniques.',
  'imrd-style': 'Transform into IMRD format: Introduction, Methods, Results, Discussion sections.',
  'investigative': 'Transform into investigative journalism style.',
  'meme-style': 'Transform into internet meme style with humor and pop culture references.',
  'passive-voice': 'Transform into passive voice academic style using passive constructions.',
  'threaded-post': 'Transform into Twitter thread style with "1/n" format and connected posts.'
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
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in .env.local file.');
    }
  }

  /**
   * 执行文本风格转换
   * @param text 原始文本
   * @param style 目标风格
   * @param targetLength 目标字数(可选)
   * @returns 转换结果
   */
  async transform(text: string, style: string, targetLength?: number): Promise<TransformResult> {
    const startTime = Date.now();

    try {
      // 输入验证
      this.validateInput(text, style);

      // 获取风格提示词
      const stylePrompt = this.getStylePrompt(style as SupportedStyle);

      // 构建完整提示词 - 包含风格和字数控制
      let lengthInstruction = '';
      if (targetLength && targetLength > 0) {
        lengthInstruction = `\n\nLENGTH REQUIREMENT: The output should be approximately ${targetLength} characters or less. Adjust the content accordingly while maintaining the core message and style.`;
      }
      
      const fullPrompt = `${stylePrompt}${lengthInstruction}

CRITICAL INSTRUCTION: You MUST respond in the EXACT SAME LANGUAGE as the input text below. Do not translate, do not change the language. Only transform the writing style while preserving the original language completely.

Examples:
- If input is in English → respond in English
- If input is in Chinese → respond in Chinese  
- If input is in Japanese → respond in Japanese
- If input is in Spanish → respond in Spanish
- If input is in any other language → respond in that same language

Original text:
${text}

Transformed text:`;


      // 使用重试机制调用OpenAI API
      const response = await this.retryApiCall(async () => {
        return await this.openai.chat.completions.create({
          model: this.DEFAULT_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a professional multilingual text style transformation assistant. Your primary rule is to ALWAYS respond in the same language as the input text. You can work with any language (English, Chinese, Japanese, Korean, Spanish, French, German, Thai, Vietnamese, etc.) and transform writing styles while preserving the original language completely. Never translate or change the language of the content.'
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
        throw new Error('API returned an empty response. Please try again.');
      }

      // 简单记录转换信息，用于监控和调试
      console.log('Style transformation completed:', {
        inputLanguage: this.detectLanguageType(text),
        outputLanguage: this.detectLanguageType(transformedText),
        style: style,
        processingTime: Date.now() - startTime
      });

      return {
        transformedText,
        originalText: text,
        style,
        processingTime: Date.now() - startTime
      };

    } catch (error: unknown) {
      // 转换OpenAI API错误为应用错误
      const err = error as { status?: number };
      if (err.status === 429) {
        throw new Error('API request rate limit exceeded. Please try again later.');
      } else if (err.status === 400) {
        throw new Error('Invalid API request parameters.');
      } else if (err.status === 401) {
        throw new Error('OpenAI API key is invalid or has expired.');
      } else if (err.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
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
      throw new Error('Text content cannot be empty');
    }

    // 检查文本长度
    if (text.length > this.MAX_TEXT_LENGTH) {
      throw new Error(`Text length cannot exceed ${this.MAX_TEXT_LENGTH} characters`);
    }

    // 检查风格是否支持
    if (!SUPPORTED_STYLES.includes(style as SupportedStyle)) {
      throw new Error(`Unsupported style type: ${style}`);
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
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        return await apiCall();
      } catch (error: unknown) {
        lastError = error;

        // 如果是不可重试的错误，直接抛出
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        // 如果不是最后一次尝试，等待一段时间后重试
        if (attempt < this.MAX_RETRIES) {
          const delay = this.getRetryDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * 检查是否为不可重试的错误
   */
  private isNonRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const err = error as { status?: number };
    // 400系列错误通常不可重试（除了429限流）
    if (err.status && err.status >= 400 && err.status < 500 && err.status !== 429) {
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

  /**
   * 检测文本的主要语言类型
   * @param text 输入文本
   * @returns 语言类型标识
   */
  private detectLanguageType(text: string): string {
    if (!text || text.trim().length === 0) return 'unknown';

    // 移除标点和空格，只分析字母字符
    const cleanText = text.replace(/[\s\p{P}]/gu, '');
    const totalChars = cleanText.length;

    if (totalChars === 0) return 'unknown';

    // 中文字符 (包括繁体)
    const chineseChars = (cleanText.match(/[\u4e00-\u9fff]/g) || []).length;

    // 日文字符 (平假名、片假名、汉字)
    const japaneseChars = (cleanText.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;

    // 韩文字符
    const koreanChars = (cleanText.match(/[\uac00-\ud7af]/g) || []).length;

    // 泰文字符
    const thaiChars = (cleanText.match(/[\u0e00-\u0e7f]/g) || []).length;

    // 阿拉伯文字符
    const arabicChars = (cleanText.match(/[\u0600-\u06ff]/g) || []).length;

    // 西里尔字符 (俄语等)
    const cyrillicChars = (cleanText.match(/[\u0400-\u04ff]/g) || []).length;

    // 拉丁字符 (英语、法语、德语、西班牙语等)
    const latinChars = (cleanText.match(/[a-zA-Z\u00c0-\u017f]/g) || []).length;

    // 计算各语言字符占比
    const chineseRatio = chineseChars / totalChars;
    const japaneseRatio = japaneseChars / totalChars;
    const koreanRatio = koreanChars / totalChars;
    const thaiRatio = thaiChars / totalChars;
    const arabicRatio = arabicChars / totalChars;
    const cyrillicRatio = cyrillicChars / totalChars;
    const latinRatio = latinChars / totalChars;

    // 判断主要语言 (阈值设为30%)
    if (chineseRatio > 0.3) return 'chinese';
    if (japaneseRatio > 0.3) return 'japanese';
    if (koreanRatio > 0.3) return 'korean';
    if (thaiRatio > 0.3) return 'thai';
    if (arabicRatio > 0.3) return 'arabic';
    if (cyrillicRatio > 0.3) return 'cyrillic';
    if (latinRatio > 0.3) return 'latin';

    // 如果没有明显的主导语言，返回混合
    return 'mixed';
  }




}
