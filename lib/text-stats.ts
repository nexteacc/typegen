/**
 * 文本统计工具函数
 * 提供字符数、单词数、段落数等统计功能
 */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  paragraphs: number;
  lines: number;
}

/**
 * 计算文本统计信息
 * @param text 输入文本
 * @returns 文本统计结果
 */
export function calculateTextStats(text: string): TextStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      paragraphs: 0,
      lines: 0
    };
  }

  // 字符数（包含空格）
  const characters = text.length;
  
  // 字符数（不含空格）
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // 单词数（支持中英文）
  const words = countWords(text);
  
  // 段落数（以双换行分隔）
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  
  // 行数
  const lines = text.split('\n').length;

  return {
    characters,
    charactersNoSpaces,
    words,
    paragraphs,
    lines
  };
}

/**
 * 计算单词数（支持中英文混合）
 * @param text 输入文本
 * @returns 单词数
 */
function countWords(text: string): number {
  if (!text.trim()) return 0;
  
  // 移除多余空格
  const cleanText = text.trim().replace(/\s+/g, ' ');
  
  // 中文字符数
  const chineseChars = (cleanText.match(/[\u4e00-\u9fff]/g) || []).length;
  
  // 英文单词数（移除中文字符后计算）
  const englishText = cleanText.replace(/[\u4e00-\u9fff]/g, '').trim();
  const englishWords = englishText ? englishText.split(/\s+/).filter(word => word.length > 0).length : 0;
  
  return chineseChars + englishWords;
}

/**
 * 格式化文本统计信息为显示字符串
 * @param stats 文本统计结果
 * @param compact 是否使用紧凑格式
 * @returns 格式化的统计信息
 */
export function formatTextStats(stats: TextStats, compact: boolean = true): string {
  if (compact) {
    return `${stats.characters} 字符 · ${stats.words} 词`;
  }
  
  return `${stats.characters} 字符（${stats.charactersNoSpaces} 不含空格）· ${stats.words} 词 · ${stats.paragraphs} 段`;
}