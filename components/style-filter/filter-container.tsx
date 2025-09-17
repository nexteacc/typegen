"use client"

import React from 'react';
import { StyleFilter, TransformerState } from './types';
import { useLocalizedCategories } from '@/lib/use-localized-categories';
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
  // 使用本地化的类别数据
  const categories = useLocalizedCategories();

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
