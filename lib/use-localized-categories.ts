import { useMemo } from 'react';
import { useTranslation } from './use-translation';
import { getFiltersByCategory } from '@/components/style-filter/filters-data';
import { StyleFilter } from '@/components/style-filter/types';

// 类别配置接口
interface FilterCategory {
  id: string;
  name: string;
  emoji: string;
  filters: StyleFilter[];
}

/**
 * 本地化类别数据Hook
 * 根据当前语言返回翻译后的类别名称
 */
export function useLocalizedCategories(): FilterCategory[] {
  const { t } = useTranslation();

  const categories = useMemo(() => [
    {
      id: 'style-news',
      name: t('categoryStyleNews'),
      emoji: '📰',
      filters: getFiltersByCategory('style-news')
    },
    {
      id: 'style-social',
      name: t('categoryStyleSocial'),
      emoji: '📱',
      filters: getFiltersByCategory('style-social')
    },
    {
      id: 'style-creative',
      name: t('categoryStyleCreative'),
      emoji: '✍️',
      filters: getFiltersByCategory('style-creative')
    },
    {
      id: 'structure-news',
      name: t('categoryStructureNews'),
      emoji: '🧱',
      filters: getFiltersByCategory('structure-news')
    },
    {
      id: 'structure-list',
      name: t('categoryStructureList'),
      emoji: '🧩',
      filters: getFiltersByCategory('structure-list')
    },
    {
      id: 'structure-academic',
      name: t('categoryStructureAcademic'),
      emoji: '📑',
      filters: getFiltersByCategory('structure-academic')
    },
    {
      id: 'strategy',
      name: t('categoryStrategy'),
      emoji: '🎯',
      filters: getFiltersByCategory('strategy')
    }
  ], [t]);

  return categories;
}