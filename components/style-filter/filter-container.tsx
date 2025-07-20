"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { StyleFilter, TransformerState } from './types';
import { styleFilters } from './filters-data';
import { FilterIconList } from './filter-icon';

interface FilterIconsContainerProps {
  onFilterSelect?: (filter: StyleFilter) => void;
  selectedFilter?: StyleFilter | null;
  state: TransformerState;
  className?: string;
}

/**
 * 风格滤镜图标容器组件
 * 显示底部的滤镜图标区域
 */
export function FilterIconsContainer({
  onFilterSelect,
  selectedFilter,
  state,
  className
}: FilterIconsContainerProps) {
  // 始终显示滤镜图标，不再基于状态条件

  // 当状态为 readyToTransform 时显示提示文本
  const shouldShowHint = state === 'readyToTransform';

  return (
    <div className={cn('w-full', className)}>
      {/* 条件渲染提示文本，使用 AnimatePresence 处理进出动画 */}
      <AnimatePresence>
        {shouldShowHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-gray-500 mb-4"
          >
            拖动滤镜到文本框应用风格转换
          </motion.div>
        )}
      </AnimatePresence>

      {/* 始终显示滤镜图标容器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-4 py-8 rounded-xl bg-white/5 backdrop-blur-sm overflow-x-auto"
      >
        <div className="min-w-[600px] w-full">
          <FilterIconList
            filters={styleFilters}
            selectedFilter={selectedFilter}
            onSelectFilter={onFilterSelect}
            className="justify-between"
          />
        </div>
      </motion.div>
    </div>
  );
}