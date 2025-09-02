/**
 * OpenAI文本风格转换服务
 * 使用OpenAI API实现真实的文本风格转换
 */

import OpenAI from 'openai';
import { TransformResult, SupportedStyle, SUPPORTED_STYLES } from './api-types';

// 风格转换提示词模板
const STYLE_PROMPTS: Record<SupportedStyle, string> = {
  // 原有风格
  'ap-style': 'Transform the following text into AP Style journalism. Maintain objectivity, conciseness, and directness, focusing on factual accuracy with clear headlines and structure.',
  'x-style': 'Transform the following text into social media X (Twitter) style. Make it concise and powerful, add relevant hashtags, use short paragraphs and emojis to enhance expression.',
  'inverted-pyramid': 'Rewrite the following text using the inverted pyramid structure for news. Put the most important information at the beginning, followed by secondary details and background information. Make it suitable for quick reading and understanding.',
  'breaking-news': 'Transform the following text into breaking news style. Use urgent and timely language, short and concise paragraphs, emphasizing the immediacy and importance of the event.',
  'academic': 'Transform the following text into academic style. Use formal language, professional terminology, clear structure and argumentation, focusing on citations and evidence support, as well as expressions commonly used in academia.',
  
  // 新增风格
  '4chan-style': 'Transform the following text into 4chan/anonymous forum style. Use direct, unfiltered language with internet slang, be brutally honest, and adopt the irreverent tone typical of anonymous imageboards.',
  'buzzfeed-style': 'Transform the following text into BuzzFeed style. Create catchy, clickbait headlines with numbers or superlatives, use conversational tone, add personality and humor, make it shareable and engaging.',
  'call-to-action': 'Transform the following text into a compelling call-to-action style. Use persuasive language, create urgency, include action verbs, and motivate readers to take specific steps.',
  'citation-heavy': 'Transform the following text into citation-heavy academic style. Include numerous references to authoritative sources, use formal citations format, emphasize evidence-based arguments and scholarly credibility.',
  'fomo-driven': 'Transform the following text into FOMO (Fear of Missing Out) driven style. Create urgency and scarcity, emphasize exclusive opportunities, use time-sensitive language to motivate immediate action.',
  'hashtag-heavy': 'Transform the following text into hashtag-heavy social media style. Add numerous relevant hashtags, make it trend-worthy, use popular social media conventions and maximize discoverability.',
  'headline-driven': 'Transform the following text into headline-driven content. Focus on creating multiple compelling headlines, use attention-grabbing techniques, optimize for click-through rates and engagement.',
  'imrd-style': 'Transform the following text into IMRD (Introduction, Methods, Results, Discussion) academic paper format. Structure content with clear sections, use scientific writing conventions and systematic presentation.',
  'investigative': 'Transform the following text into investigative journalism style. Focus on in-depth research, present evidence systematically, use investigative techniques, maintain objectivity while revealing important findings.',
  'meme-style': 'Transform the following text into internet meme style. Use humor, references to popular culture, informal language, and make it relatable and shareable in online communities.',
  'passive-voice': 'Transform the following text into passive voice academic style. Use passive constructions, maintain objectivity, focus on actions rather than actors, suitable for formal scientific writing.',
  'threaded-post': 'Transform the following text into Twitter thread style. Break content into connected tweets, use thread conventions like "1/n", maintain flow between posts while respecting character limits.'
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
      throw new Error('OpenAI API密钥未配置，请在.env.local文件中设置OPENAI_API_KEY');
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

      // 构建完整提示词 - 让模型自动检测并保持原语言
      const fullPrompt = `${stylePrompt}

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
        throw new Error('API返回了空响应，请重试');
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
        throw new Error('API请求频率超限，请稍后再试');
      } else if (err.status === 400) {
        throw new Error('无效的API请求参数');
      } else if (err.status === 401) {
        throw new Error('OpenAI API密钥无效或已过期');
      } else if (err.status === 500) {
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
