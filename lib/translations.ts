import { Language } from './language-context';

// 翻译数据类型
export type TranslationKey = keyof typeof translations.zh;

// 翻译数据
export const translations = {
  zh: {
    // 通用按钮
    copy: '复制',
    copyText: '📋 复制文本',
    restart: '🔄 重新开始',
    tryOtherStyle: '🎨 尝试其他风格',
    openFilterSheet: '🎯 选择滤镜',

    // 界面标签
    pasteTextHere: '在此粘贴文本',
    originalText: '原始文本',
    transformedResult: '转换结果',
    targetLength: '目标长度',
    chars: '字符',
    
    // 状态提示
    dragFilterHint: '从下方工具栏拖拽滤镜到此处转换文本',
    readyToTransform: '准备转换',
    transforming: '转换中...',
    transformed: '转换完成',
    tapFilterHint: '点击下方按钮选择滤镜并开始转换',

    // 字数控制
    concise: '📝 简洁',
    summary: '📋 摘要', 
    standard: '📄 标准',
    detailed: '📚 详细',
    
    // 成功消息
    copySuccess: '文本已复制到剪贴板！',

    // 错误消息
    textTooLongWarning: '⚠️ 文本长度超过5000字符限制，请缩短您的文本',
    copyFailed: '复制失败，请手动复制文本',
    networkError: '网络错误',
    transformFailed: '转换失败',
    unknownError: '未知错误',
    serverNotReady: '服务器还未就绪',
    
    // API 错误消息
    invalidInput: '输入参数无效',
    textTooLong: '文本长度超出限制',
    unsupportedStyle: '不支持的风格类型',
    internalError: '服务器内部错误',
    rateLimitExceeded: 'API请求频率超限，请稍后重试',
    invalidApiKey: 'OpenAI API密钥无效或已过期',
    serviceUnavailable: 'OpenAI服务暂时不可用，请稍后重试',
    
    // 语言切换
    switchToEnglish: '🌍 English',
    switchToChinese: '🌍 中文',
    close: '关闭',

    // 长度控制提示
    lengthControlHint: '调整目标文本长度',

    // 应用信息
    appTitle: 'TypeGenAI',
    appDescription: '智能文本风格转换工具，支持多种写作风格转换',
    
    // 滤镜类别名称
    categoryStyleNews: '风格 · 学术',
    categoryStyleSocial: '风格 · 社交',
    categoryStyleCreative: '风格 · 写作',
    categoryStructureNews: '结构 · 新闻',
    categoryStructureList: '结构 · 列表',
    categoryStructureAcademic: '结构 · 学术',
    categoryStrategy: '策略 · 传播',

    // 移动端弹层
    filterSelectionTitle: '选择滤镜',
  },
  
  en: {
    // 通用按钮
    copy: 'Copy',
    copyText: '📋 Copy Text',
    restart: '🔄 Restart',
    tryOtherStyle: '🎨 Try Other Style',
    openFilterSheet: '🎯 Choose Filter',

    // 界面标签
    pasteTextHere: 'Paste text here',
    originalText: 'Original Text',
    transformedResult: 'Transformed Result',
    targetLength: 'Target Length',
    chars: 'chars',
    
    // 状态提示
    dragFilterHint: 'Drag a filter from the toolbar below to transform your text',
    readyToTransform: 'Ready to transform',
    transforming: 'Transforming...',
    transformed: 'Transformed',
    tapFilterHint: 'Tap the button below to choose a filter',
    
    // 字数控制
    concise: '📝 Concise',
    summary: '📋 Summary',
    standard: '📄 Standard',
    detailed: '📚 Detailed',
    
    // 成功消息
    copySuccess: 'Text copied to clipboard!',

    // 错误消息
    textTooLongWarning: '⚠️ Text exceeds 5000 character limit. Please shorten your text.',
    copyFailed: 'Copy failed, please copy text manually',
    networkError: 'Network error',
    transformFailed: 'Transform failed',
    unknownError: 'Unknown error',
    serverNotReady: 'Server not ready yet',
    
    // API 错误消息
    invalidInput: 'Invalid input parameters',
    textTooLong: 'Text length exceeds limit',
    unsupportedStyle: 'Unsupported style type',
    internalError: 'Server internal error',
    rateLimitExceeded: 'API request rate limit exceeded. Please try again later',
    invalidApiKey: 'OpenAI API key is invalid or has expired',
    serviceUnavailable: 'OpenAI service is temporarily unavailable. Please try again later',
    
    // 语言切换
    switchToEnglish: '🌍 English',
    switchToChinese: '🌍 中文',
    close: 'Close',

    // 长度控制提示
    lengthControlHint: 'Adjust target text length',

    // 应用信息
    appTitle: 'TypeGenAI',
    appDescription: 'AI-powered text style transformation tool with multiple writing styles',
    
    // 滤镜类别名称
    categoryStyleNews: 'Style · News & Academic',
    categoryStyleSocial: 'Style · Social Platforms',
    categoryStyleCreative: 'Style · Creative Writing',
    categoryStructureNews: 'Structure · News Frames',
    categoryStructureList: 'Structure · Lists & Threads',
    categoryStructureAcademic: 'Structure · Academic Flow',
    categoryStrategy: 'Strategy & Controls',

    // 移动端弹层
    filterSelectionTitle: 'Choose a style filter',
  },
};

// 获取翻译文本的函数
export function getTranslation(language: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[language][key] || translations.zh[key] || key;
  
  // 参数替换（如果有）
  if (params) {
    Object.keys(params).forEach(paramKey => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(params[paramKey]));
    });
  }
  
  return text;
}
