import { StyleFilter } from './types';

/**
 * 预定义风格滤镜数据
 * 基于写作风格关键词表和设计需求
 */
export const styleFilters: StyleFilter[] = [
  // Style · 新闻 / 学术 / 教科书
  {
    id: 'ap-style',
    name: 'AP Style',
    icon: '/icons/ap-style.png',
    description: '美联社新闻写作规范，客观简洁，强调事实先行',
    apiParameter: 'ap-style',
    category: 'style-news'
  },
  {
    id: 'apa-style',
    name: 'APA Style',
    icon: '/icons/APA-style.svg',
    description: '社会科学常用引用规范，强调文献出处与结构化表达',
    apiParameter: 'apa-style',
    category: 'style-news'
  },
  {
    id: 'ieee-style',
    name: 'IEEE Style',
    icon: '/icons/IEEE-style.png',
    description: '工程与计算机领域常用排版与引用标准',
    apiParameter: 'ieee-style',
    category: 'style-news'
  },
  {
    id: 'textbook-style',
    name: 'Textbook Style',
    icon: '/icons/Textbook-style.svg',
    description: '教科书语气，术语规范、结构严谨、语句中性',
    apiParameter: 'textbook-style',
    category: 'style-news'
  },
  {
    id: 'investigative',
    name: 'Investigative',
    icon: '/icons/Investigative.png',
    description: '调查报道风格，注重证据链与深度挖掘',
    apiParameter: 'investigative',
    category: 'style-news'
  },

  // Style · 社群 / 平台文化
  {
    id: '4chan-style',
    name: '4chan Style',
    icon: '/icons/4chan-style.png',
    description: '匿名论坛语气，直接、尖锐、网络亚文化色彩浓厚',
    apiParameter: '4chan-style',
    category: 'style-social'
  },
  {
    id: 'reddit-style',
    name: 'Reddit Style',
    icon: '/icons/Reddit-style.png',
    description: '社区讨论语气，引用丰富、理性辩论、互动感强',
    apiParameter: 'reddit-style',
    category: 'style-social'
  },
  {
    id: 'buzzfeed-style',
    name: 'BuzzFeed',
    icon: '/icons/Buzzfeed-style.png',
    description: '病毒式传播语气，轻松幽默、标题吸睛、易于阅读',
    apiParameter: 'buzzfeed-style',
    category: 'style-social'
  },
  {
    id: 'twitter-style',
    name: 'Twitter Style',
    icon: '/icons/Twitter-style.png',
    description: '短促有力、话题标签密集、强调互动的社交语气',
    apiParameter: 'twitter-style',
    category: 'style-social'
  },
  {
    id: 'instagram-caption',
    name: 'Instagram Caption',
    icon: '/icons/Instagram-caption.svg',
    description: '视觉叙事配文，富含情绪与场景描述，适配社交平台',
    apiParameter: 'instagram-caption',
    category: 'style-social'
  },
  {
    id: 'meme-style',
    name: 'Meme Style',
    icon: '/icons/Meme-style.png',
    description: '网络梗文化语气，幽默、引用流行语与夸张表达',
    apiParameter: 'meme-style',
    category: 'style-social'
  },

  // Style · 小说 / 创意写作
  {
    id: 'hemingway-style',
    name: 'Hemingway Style',
    icon: '/icons/Hemingway-style.svg',
    description: '短句、动词驱动、极简主义的叙事语体',
    apiParameter: 'hemingway-style',
    category: 'style-creative'
  },

  // Structure · 新闻 / 资讯结构
  {
    id: 'inverted-pyramid',
    name: 'Inverted Pyramid',
    icon: '/icons/inverted-pyramid.png',
    description: '倒金字塔结构，先给出关键信息，再补充细节',
    apiParameter: 'inverted-pyramid',
    category: 'structure-news'
  },
  {
    id: 'headline-driven',
    name: 'Headline Driven',
    icon: '/icons/Headline-driven.png',
    description: '标题牵引内容，适合资讯或内容营销场景',
    apiParameter: 'headline-driven',
    category: 'structure-news'
  },

  // Structure · 列表 / 线程 / 教程
  {
    id: 'listicle',
    name: 'Listicle',
    icon: '/icons/Listicle.png',
    description: '列表化呈现，条目分明、适合技巧或推荐集合',
    apiParameter: 'listicle',
    category: 'structure-list'
  },
  {
    id: 'threaded',
    name: 'Threaded',
    icon: '/icons/Thread-based.png',
    description: '串联发布结构，适合长帖或线程化叙述',
    apiParameter: 'threaded',
    category: 'structure-list'
  },
  {
    id: 'how-to',
    name: 'How-to',
    icon: '/icons/How-to.svg',
    description: '步骤驱动的教程结构，强调问题—步骤—结果',
    apiParameter: 'how-to',
    category: 'structure-list'
  },
  {
    id: 'bullet-pointed',
    name: 'Bullet-pointed',
    icon: '/icons/Bullet-pointed.svg',
    description: '条列式结构，突出关键信息点，便于快速浏览',
    apiParameter: 'bullet-pointed',
    category: 'structure-list'
  },

  // Structure · 学术 / 叙事结构
  {
    id: 'imrd-style',
    name: 'IMRaD',
    icon: '/icons/IMRaD.png',
    description: '科研论文常用结构：引言、方法、结果、讨论',
    apiParameter: 'imrd-style',
    category: 'structure-academic'
  },

  // Strategy & Controls
  {
    id: 'clickbait',
    name: 'Clickbait',
    icon: '/icons/Clickbait.png',
    description: '悬念与夸张标题策略，提高点击率和关注度',
    apiParameter: 'clickbait',
    category: 'strategy'
  },
  {
    id: 'call-to-action',
    name: 'Call to Action',
    icon: '/icons/Call-to-Action.png',
    description: '强调行动号召，引导读者立即采取下一步',
    apiParameter: 'call-to-action',
    category: 'strategy'
  },
  {
    id: 'seo-optimized',
    name: 'SEO Optimized',
    icon: '/icons/SEO-optimized.png',
    description: '搜索优化策略，平衡关键词密度与自然表达',
    apiParameter: 'seo-optimized',
    category: 'strategy'
  },
  {
    id: 'fomo-driven',
    name: 'FOMO Driven',
    icon: '/icons/FOMO-driven.png',
    description: '错失恐惧策略，营造紧迫感与稀缺性',
    apiParameter: 'fomo-driven',
    category: 'strategy'
  },
  {
    id: 'hashtag-heavy',
    name: 'Hashtag Heavy',
    icon: '/icons/Hashtag-heavy.png',
    description: '大量标签，提升社交平台的可见度与话题度',
    apiParameter: 'hashtag-heavy',
    category: 'strategy'
  },
  {
    id: 'emoji-laden',
    name: 'Emoji Laden',
    icon: '/icons/Emoji-laden.png',
    description: '表情符号密集，打造轻松、口语化的互动语气',
    apiParameter: 'emoji-laden',
    category: 'strategy'
  },
  {
    id: 'flesch-kincaid',
    name: 'Flesch-Kincaid',
    icon: '/icons/Flesch-Kincaid.png',
    description: '可读性指数策略，控制句长与词长，提高易读性',
    apiParameter: 'flesch-kincaid',
    category: 'strategy'
  },
  {
    id: 'citation-heavy',
    name: 'Citation Heavy',
    icon: '/icons/Citation-heavy.png',
    description: '强化引用与参考文献，强调信息来源与可信度',
    apiParameter: 'citation-heavy',
    category: 'strategy'
  },
  {
    id: 'technical-jargon',
    name: 'Technical Jargon',
    icon: '/icons/Technical-jargon.png',
    description: '术语密集表达，适合专业受众与技术文档',
    apiParameter: 'technical-jargon',
    category: 'strategy'
  }
];

/**
 * 根据ID获取风格滤镜
 * @param id 滤镜ID
 * @returns 对应的风格滤镜，如果未找到则返回undefined
 */
export function getFilterById(id: string): StyleFilter | undefined {
  return styleFilters.find(filter => filter.id === id);
}

/**
 * 根据类别获取风格滤镜
 * @param category 滤镜类别
 * @returns 该类别的所有风格滤镜
 */
export function getFiltersByCategory(category: StyleFilter['category']): StyleFilter[] {
  return styleFilters.filter(filter => filter.category === category);
}
