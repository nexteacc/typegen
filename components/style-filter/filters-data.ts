import { StyleFilter } from './types';

/**
 * 预定义风格滤镜数据
 * 基于写作风格关键词表和设计需求
 */
export const styleFilters: StyleFilter[] = [
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
    apiParameter: 'twitter-style',
    category: 'social'
  },
  {
    id: 'inverted-pyramid',
    name: 'Inverted Pyramid',
    icon: '/icons/inverted-pyramid.svg',
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