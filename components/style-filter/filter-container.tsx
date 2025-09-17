"use client"

import React from 'react';
import { StyleFilter, TransformerState } from './types';
import { getFiltersByCategory } from './filters-data';
import { CategorizedFilterToolbar } from './categorized-filter-toolbar';

interface FilterIconsContainerProps {
  onFilterSelect?: (filter: StyleFilter) => void;
  onSnapComplete?: (filter: StyleFilter) => void;
  selectedFilter?: StyleFilter | null;
  state: TransformerState;
  className?: string;
}

/**
 * 滤镜图标容器组件
 * 使用分类工具栏布局
 */
export function FilterIconsContainer({
  onFilterSelect,
  onSnapComplete,
  selectedFilter,
  state,
  className
}: FilterIconsContainerProps) {
  // 按功能分类组织滤镜
  const categories = React.useMemo(() => [
    {
      id: 'news',
      name: 'News',
      emoji: '📰',
      filters: getFiltersByCategory('news')
    },
    {
      id: 'academic',
      name: 'Academic',
      emoji: '🎓',
      filters: getFiltersByCategory('academic')
    },
    {
      id: 'social',
      name: 'Social',
      emoji: '📱',
      filters: getFiltersByCategory('social')
    },
    {
      id: 'marketing',
      name: 'Marketing',
      emoji: '📈',
      filters: getFiltersByCategory('marketing')
    }
  ], []);

  return (
    <CategorizedFilterToolbar
      categories={categories}
      onFilterSelect={onFilterSelect}
      onSnapComplete={onSnapComplete}
      selectedFilter={selectedFilter}
      state={state}
      className={className}
    />
  );
}
