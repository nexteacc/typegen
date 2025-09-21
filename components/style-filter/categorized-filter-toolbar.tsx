"use client"

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { StyleFilter, TransformerState } from './types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

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
 * 按分类展示的滤镜工具栏
 * 支持小屏滚动与大屏整行布局
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
    <TooltipProvider delayDuration={150} skipDelayDuration={200}>
      <div
        data-transformer-state={state}
        className={cn(
          "mx-auto w-full max-w-3xl px-3 py-4 sm:px-5 md:max-w-4xl md:px-6 lg:max-w-5xl",
          className
        )}
      >
        <div className="flex flex-col gap-4">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: categoryIndex * 0.08 }}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              {/* 类别标签 */}
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 md:w-32">
                <span className="text-base">{category.emoji}</span>
                <span className="whitespace-nowrap">{category.name}</span>
              </div>

              <div
                className="flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:gap-5 md:overflow-visible md:pb-0"
              >
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
    </TooltipProvider>
  );
}

/**
 * 单个滤镜图标组件 - 支持拖拽和点击
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

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
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

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "filter-icon-container relative flex h-12 w-12 min-w-[3rem] items-center justify-center cursor-grab active:cursor-grabbing",
            isDragging && "scale-105 opacity-50",
            className
          )}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          tabIndex={0}
        >
          {/* 图标容器 */}
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
            <Image
              src={filter.icon}
              alt={filter.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" sideOffset={8} className="rounded-full bg-slate-900/95 px-3 py-1 text-xs text-white shadow-lg backdrop-blur">
        {filter.name}
      </TooltipContent>
    </Tooltip>
  );
}
