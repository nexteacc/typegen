import { useMemo } from 'react';
import { useTranslation } from './use-translation';
import { getFiltersByCategory } from '@/components/style-filter/filters-data';
import { StyleFilter } from '@/components/style-filter/types';

// 类别配置接口
interface FilterCategory {
  id: string;
  name: string;
  shortName: string;
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
      shortName: t('categoryShortStyleNews'),
      emoji: '📰',
      filters: getFiltersByCategory('style-news')
    },
    {
      id: 'style-social',
      name: t('categoryStyleSocial'),
      shortName: t('categoryShortStyleSocial'),
      emoji: '📱',
      filters: getFiltersByCategory('style-social')
    },
    {
      id: 'style-creative',
      name: t('categoryStyleCreative'),
      shortName: t('categoryShortStyleCreative'),
      emoji: '✍️',
      filters: getFiltersByCategory('style-creative')
    },
    {
      id: 'structure-news',
      name: t('categoryStructureNews'),
      shortName: t('categoryShortStructureNews'),
      emoji: '🧱',
      filters: getFiltersByCategory('structure-news')
    },
    {
      id: 'structure-list',
      name: t('categoryStructureList'),
      shortName: t('categoryShortStructureList'),
      emoji: '🧩',
      filters: getFiltersByCategory('structure-list')
    },
    {
      id: 'structure-academic',
      name: t('categoryStructureAcademic'),
      shortName: t('categoryShortStructureAcademic'),
      emoji: '📑',
      filters: getFiltersByCategory('structure-academic')
    },
    {
      id: 'strategy',
      name: t('categoryStrategy'),
      shortName: t('categoryShortStrategy'),
      emoji: '🎯',
      filters: getFiltersByCategory('strategy')
    }
  ], [t]);

  return categories;
}
