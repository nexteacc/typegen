"use client"

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { StyleFilter, TransformerState } from './types';
// import { FilterIcon } from './filter-icon'; // 使用内部定义的FilterIcon

interface FilterCategory {
  id: string;
  name: string;
  emoji: string;
  filters: StyleFilter[];
}

interface CategorizedFilterToolbarProps {
  categories: FilterCategory[];
  onFilterSelect?: (filter: StyleFilter) => void;
  onSnapComplete?: (filter: StyleFilter) => void;
  selectedFilter?: StyleFilter | null;
  state: TransformerState;
  className?: string;
}

/**
 * 按功能分类的滤镜工具栏组件
 * 垂直分行布局，每行一个功能类别
 */
export function CategorizedFilterToolbar({
  categories,
  onFilterSelect,
  onSnapComplete,
  selectedFilter,
  state,
  className
}: CategorizedFilterToolbarProps) {
  return (
    <div
      data-transformer-state={state}
      className={cn(
      "w-full max-w-[900px] mx-auto px-6 py-4", // 根据容器尺寸设计规范调整为max-w-[900px]
      className
    )}
    >
      <div className="space-y-3"> {/* 恢复合理的行间间距 */}
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
            className="flex items-center"
          >
            {/* 类别标签 - 缩小宽度 */}
            <div className="flex items-center w-20 mr-6 flex-shrink-0">
              <span className="text-sm mr-1">{category.emoji}</span>
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                {category.name}
              </span>
            </div>
            
            <div className="flex-1 flex items-center justify-start min-h-[56px]" style={{ gap: '24px' }}>
              {category.filters.map((filter) => (
                <FilterIcon
                  key={filter.id}
                  filter={filter}
                  onClick={onFilterSelect}
                  onSnapComplete={onSnapComplete}
                  className={cn(
                    selectedFilter?.id === filter.id && "ring-2 ring-blue-500 ring-opacity-50"
                  )}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * 单个滤镜图标组件 - 专为工具栏设计
 */
function FilterIcon({
  filter,
  onClick,
  onSnapComplete,
  className
}: {
  filter: StyleFilter;
  onClick?: (filter: StyleFilter) => void;
  onSnapComplete?: (filter: StyleFilter) => void;
  className?: string;
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setShowTooltip(false); // 拖拽时隐藏tooltip
    e.dataTransfer.setData('application/json', JSON.stringify(filter));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onSnapComplete?.(filter);
  };

  const handleClick = () => {
    onClick?.(filter);
  };

  const handleMouseEnter = () => {
    if (!isDragging) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center cursor-grab active:cursor-grabbing",
        "w-12 h-12", // 缩小为只包含图标的尺寸
        isDragging && "opacity-50 scale-105",
        className
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 图标容器 */}
      <div className="w-12 h-12 rounded-full bg-white/60 border border-gray-200 flex items-center justify-center">
        <Image
          src={filter.icon}
          alt={filter.name}
          width={32}
          height={32}
          className="w-8 h-8 object-cover rounded-full"
          loading="lazy"
        />
      </div>
      
      {/* Tooltip 悬浮提示 */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
          {filter.name}
          {/* 小三角箭头 */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
