/**
 * OpenAI文本风格转换服务
 * 使用OpenAI API实现真实的文本风格转换
 */

import OpenAI from 'openai';
import { TransformResult, SupportedStyle, SUPPORTED_STYLES } from './api-types';

// 风格转换提示词模板
// 原则：为每类风格提供明确的写作指令，确保模型输出符合目标语气与结构
// 风格特定温度配置
// 基于不同风格的创造性需求和准确性要求
const STYLE_TEMPERATURES: Record<SupportedStyle, number> = {
  // Style · 新闻 / 学术 / 教科书 - 严谨性优先
  'ieee-style': 0.3,        // 最严格的技术标准
  'apa-style': 0.4,         // 学术规范，允许适度变化
  'textbook-style': 0.4,    // 教育内容，结构化表达
  'ap-style': 0.5,          // 新闻标准，平衡客观与可读性
  'investigative': 0.5,     // 调查报道，证据为主

  // Style · 社群 / 平台文化 - 创意性优先
  'reddit-style': 0.7,      // 社区讨论，需要个性化
  '4chan-style': 0.8,       // 网络文化，需要更多变化
  'buzzfeed-style': 0.8,    // 病毒传播，创意吸睛
  'twitter-style': 0.8,     // 社交媒体，简洁有力
  'instagram-caption': 0.8,  // 视觉配文，情感丰富
  'meme-style': 0.9,        // 网络梗，最大创造性

  // Style · 小说 / 创意写作 - 文学性平衡
  'hemingway-style': 0.6,    // 极简风格，保持特色一致性

  // Structure · 新闻 / 资讯结构 - 结构化优先
  'inverted-pyramid': 0.5,   // 新闻结构，逻辑清晰
  'headline-driven': 0.6,    // 标题驱动，需要吸引力

  // Structure · 列表 / 线程 / 教程 - 实用性优先
  'listicle': 0.6,          // 列表文章，平衡结构与趣味
  'threaded': 0.7,          // 线程叙述，连贯性与变化并重
  'how-to': 0.5,            // 教程指南，清晰准确优先
  'bullet-pointed': 0.5,    // 要点罗列，简洁明确

  // Structure · 学术 / 叙事结构 - 学术规范
  'imrd-style': 0.4,        // 科研论文，严格结构化

  // Strategy & Controls - 策略导向，差异化需求
  'seo-optimized': 0.5,     // SEO优化，关键词准确性
  'citation-heavy': 0.4,    // 引用密集，严谨性优先
  'technical-jargon': 0.3,  // 技术术语，精确性最高
  'flesch-kincaid': 0.5,    // 可读性优化，平衡表达
  'clickbait': 0.8,         // 标题党，创意吸引力
  'call-to-action': 0.7,    // 行动号召，说服力与变化
  'fomo-driven': 0.8,       // 恐惧营销，情感冲击力
  'hashtag-heavy': 0.8,     // 标签密集，社交传播
  'emoji-laden': 0.8,       // 表情丰富，轻松活泼
};

const STYLE_PROMPTS: Record<SupportedStyle, string> = {
  // Style · 新闻 / 学术 / 教科书
  'ap-style': 'Rewrite into AP Style journalism with concise, objective sentences and an inverted-pyramid lead.',
  'apa-style': 'Rewrite into APA style academic prose with in-text citations, formal tone, and structured paragraphs.',
  'ieee-style': 'Rewrite into IEEE style technical writing with numbered references, passive voice, and precise terminology.',
  'textbook-style': 'Rewrite into textbook style exposition with neutral voice, clear definitions, and stepwise explanations.',
  'investigative': 'Rewrite into investigative journalism style that foregrounds evidence, sourcing, and analytical depth.',

  // Style · 社群 / 平台文化
  '4chan-style': 'Rewrite into 4chan style commentary with blunt tone, internet slang, and irreverent humor.',
  'reddit-style': 'Rewrite into Reddit style discussion with conversational tone, quoted replies, and community references.',
  'buzzfeed-style': 'Rewrite into BuzzFeed style storytelling with catchy hooks, pop-culture riffs, and upbeat pacing.',
  'twitter-style': 'Rewrite into Twitter style posts with punchy sentences, relevant hashtags, and emoji for emphasis.',
  'instagram-caption': 'Rewrite into Instagram caption style with evocative imagery, emoji, and engagement prompts.',
  'meme-style': 'Rewrite into meme style banter with witty punchlines, pop-culture references, and playful formatting.',

  // Style · 小说 / 创意写作
  'hemingway-style': 'Rewrite into Hemingway style narrative with short declarative sentences and vivid verbs.',

  // Structure 系列
  'inverted-pyramid': 'Rewrite into inverted-pyramid structure that leads with core facts before supporting detail.',
  'headline-driven': 'Rewrite into headline-driven structure with striking titles supported by concise blurbs.',
  'listicle': 'Rewrite into listicle structure using numbered or bulleted entries with strong subheadings.',
  'threaded': 'Rewrite into threaded structure with numbered segments (1/n) that build a connected narrative.',
  'how-to': 'Rewrite into how-to structure with a clear goal followed by step-by-step instructions.',
  'bullet-pointed': 'Rewrite into bullet-pointed structure that surfaces key insights per bullet.',
  'imrd-style': 'Rewrite into IMRaD structure with distinct Introduction, Methods, Results, and Discussion sections.',

  // Strategy & Controls
  'clickbait': 'Adjust the text with clickbait techniques that create curiosity gaps and bold promises.',
  'call-to-action': 'Adjust the text with strong calls to action that use imperative verbs and outcome-oriented phrasing.',
  'seo-optimized': 'Adjust the text for SEO with strategic keyword placement, descriptive subheadings, and meta-friendly flow.',
  'fomo-driven': 'Adjust the text to trigger FOMO with urgency cues, scarcity language, and social proof.',
  'hashtag-heavy': 'Adjust the text to include dense hashtag usage aligned with trending topics and niche communities.',
  'emoji-laden': 'Adjust the text to incorporate abundant emoji that reinforce tone and emotion while staying readable.',
  'flesch-kincaid': 'Adjust the text to an accessible Flesch-Kincaid reading level with shorter sentences and simpler vocabulary.',
  'citation-heavy': 'Adjust the text to be citation-heavy with explicit references to authoritative sources and data.',
  'technical-jargon': 'Adjust the text to use dense technical jargon appropriate for specialist audiences and expert readers.'
};

export class OpenAIService {
  private readonly openaiClient: OpenAI | null;
  private readonly MAX_TEXT_LENGTH = 5000;
  private readonly DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  private readonly DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '2000');
  private readonly DEFAULT_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
  private readonly MAX_RETRIES = parseInt(process.env.API_MAX_RETRIES || '3');
  private readonly TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000');

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    // 仅在密钥存在时初始化OpenAI客户端，避免构建阶段立即抛错
    this.openaiClient = apiKey
      ? new OpenAI({
          apiKey,
          timeout: this.TIMEOUT
        })
      : null;
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


      // 获取风格特定的温度参数
      const styleTemperature = this.getStyleTemperature(style as SupportedStyle);

      const client = this.ensureClient();

      // 使用重试机制调用OpenAI API
      const response = await this.retryApiCall(async () => {
        return await client.chat.completions.create({
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
          temperature: styleTemperature, // 使用风格特定温度
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
        temperature: styleTemperature,  // 记录使用的温度
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
   * 获取风格特定的温度参数
   * @param style 风格类型
   * @returns 该风格的最佳温度值
   */
  private getStyleTemperature(style: SupportedStyle): number {
    return STYLE_TEMPERATURES[style] || this.DEFAULT_TEMPERATURE;
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
   * 确保OpenAI客户端已正确配置
   */
  private ensureClient(): OpenAI {
    if (!this.openaiClient) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in .env.local file.');
    }

    return this.openaiClient;
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
