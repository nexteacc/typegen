import { StyleFilter } from './types';

/**
 * 预定义风格滤镜数据
 * 基于写作风格关键词表和设计需求
 */
export const styleFilters: StyleFilter[] = [
  // 第一行：现有的5个风格
  {
    id: 'ap-style',
    name: 'AP Style',
    icon: '/icons/ap-style.png', // 使用 Walter Cronkite 图片作为 AP Style 图标
    description: '美联社风格，适用于新闻报道，客观、简洁、直接',
    apiParameter: 'ap-style',
    category: 'news'
  },
  {
    id: 'x-style',
    name: 'X Style',
    icon: '/icons/x-style.png',
    description: '社交媒体风格，简洁有力，适合在线传播',
    apiParameter: 'x-style',
    category: 'social'
  },
  {
    id: 'inverted-pyramid',
    name: 'Inverted Pyramid',
    icon: '/icons/inverted-pyramid.png',
    description: '倒金字塔结构，核心信息优先，适用于新闻和报告',
    apiParameter: 'inverted-pyramid',
    category: 'news'
  },
  {
    id: 'breaking-news',
    name: 'Breaking News',
    icon: '/icons/breaking-news.png',
    description: '突发新闻风格，紧急且直接，强调时效性',
    apiParameter: 'breaking-news',
    category: 'news'
  },
  {
    id: 'academic',
    name: 'Academic',
    icon: '/icons/academic.svg',
    description: '学术风格，正式且有结构，适用于研究和论文',
    apiParameter: 'academic',
    category: 'academic'
  },
  
  // 第二行：新增的风格
  {
    id: '4chan-style',
    name: '4chan Style',
    icon: '/icons/4chan.png',
    description: '匿名论坛风格，直接、不拘一格，带有网络亚文化色彩',
    apiParameter: '4chan-style',
    category: 'social'
  },
  {
    id: 'buzzfeed-style',
    name: 'BuzzFeed',
    icon: '/icons/Buzzfeed-style.png',
    description: 'BuzzFeed媒体风格，引人注目的标题和易消化的内容',
    apiParameter: 'buzzfeed-style',
    category: 'marketing'
  },
  {
    id: 'call-to-action',
    name: 'Call to Action',
    icon: '/icons/Call-to-Action.png',
    description: '行动号召风格，激励读者采取行动，注重转化效果',
    apiParameter: 'call-to-action',
    category: 'marketing'
  },
  {
    id: 'citation-heavy',
    name: 'Citation Heavy',
    icon: '/icons/Citation-heavy.png',
    description: '重引用风格，大量引用权威资料，注重证据支持',
    apiParameter: 'citation-heavy',
    category: 'academic'
  },
  {
    id: 'fomo-driven',
    name: 'FOMO Driven',
    icon: '/icons/FOMO-driven.png',
    description: '错失恐惧风格，营造紧迫感，激发读者行动欲望',
    apiParameter: 'fomo-driven',
    category: 'marketing'
  },
  {
    id: 'hashtag-heavy',
    name: 'Hashtag Heavy',
    icon: '/icons/Hashtag-heavy.png',
    description: '标签密集风格，适合社交媒体传播，增强话题性',
    apiParameter: 'hashtag-heavy',
    category: 'social'
  },
  
  // 第三行：更多新增风格
  {
    id: 'headline-driven',
    name: 'Headline Driven',
    icon: '/icons/Headline-driven.png',
    description: '标题驱动风格，强调吸睛标题，适合内容营销',
    apiParameter: 'headline-driven',
    category: 'marketing'
  },
  {
    id: 'imrd-style',
    name: 'IMRD Style',
    icon: '/icons/Introduction - Methods - Results - Discussion.png',
    description: '科研论文IMRD结构：引言-方法-结果-讨论',
    apiParameter: 'imrd-style',
    category: 'academic'
  },
  {
    id: 'investigative',
    name: 'Investigative',
    icon: '/icons/Investigative.png',
    description: '调查报道风格，深度挖掘，注重事实和证据链',
    apiParameter: 'investigative',
    category: 'news'
  },
  {
    id: 'meme-style',
    name: 'Meme Style',
    icon: '/icons/Meme-style.png',
    description: '梗文化风格，幽默轻松，贴近网络流行文化',
    apiParameter: 'meme-style',
    category: 'social'
  },
  {
    id: 'passive-voice',
    name: 'Passive Voice',
    icon: '/icons/Passive Voice.png',
    description: '被动语态风格，客观中立，适合正式场合',
    apiParameter: 'passive-voice',
    category: 'academic'
  },
  {
    id: 'threaded-post',
    name: 'Threaded Post',
    icon: '/icons/Threaded-post.png',
    description: '串联发布风格，适合Twitter等平台的长篇叙述',
    apiParameter: 'threaded-post',
    category: 'social'
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