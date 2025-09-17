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
      id: 'style-news',
      name: 'Style · News & Academic',
      emoji: '📰',
      filters: getFiltersByCategory('style-news')
    },
    {
      id: 'style-social',
      name: 'Style · Social Platforms',
      emoji: '📱',
      filters: getFiltersByCategory('style-social')
    },
    {
      id: 'style-creative',
      name: 'Style · Creative Writing',
      emoji: '✍️',
      filters: getFiltersByCategory('style-creative')
    },
    {
      id: 'structure-news',
      name: 'Structure · News Frames',
      emoji: '🧱',
      filters: getFiltersByCategory('structure-news')
    },
    {
      id: 'structure-list',
      name: 'Structure · Lists & Threads',
      emoji: '🧩',
      filters: getFiltersByCategory('structure-list')
    },
    {
      id: 'structure-academic',
      name: 'Structure · Academic Flow',
      emoji: '📑',
      filters: getFiltersByCategory('structure-academic')
    },
    {
      id: 'strategy',
      name: 'Strategy & Controls',
      emoji: '🎯',
      filters: getFiltersByCategory('strategy')
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
