"use client"

import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { StyleFilter, TransformerState } from './types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { NavBar } from '@/components/ui/tubelight-navbar';

interface FilterCategory {
  id: string;
  name: string;
  shortName: string;
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
 * 滤镜工具栏：使用导航切换不同类别
 */
export function CategorizedFilterToolbar({
  categories,
  onFilterSelect,
  onSnapComplete,
  selectedFilter,
  state,
  className
}: CategorizedFilterToolbarProps) {
  const [activeCategoryId, setActiveCategoryId] = React.useState(() => categories[0]?.id ?? '');

  React.useEffect(() => {
    if (!categories.length) {
      setActiveCategoryId('');
      return;
    }
    const exists = categories.some((category) => category.id === activeCategoryId);
    if (!exists) {
      setActiveCategoryId(categories[0]?.id ?? '');
    }
  }, [categories, activeCategoryId]);

  const navItems = React.useMemo(
    () =>
      categories.map((category) => ({
        name: category.shortName,
        value: category.id,
        emoji: category.emoji,
      })),
    [categories]
  );

  const activeCategory = React.useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? categories[0] ?? null,
    [categories, activeCategoryId]
  );

  return (
    <TooltipProvider delayDuration={150} skipDelayDuration={200}>
      <div
        data-transformer-state={state}
        className={cn(
          "mx-auto w-full max-w-3xl px-3 py-4 sm:px-5 md:max-w-4xl md:px-6 lg:max-w-5xl",
          className
        )}
      >
        <div className="flex justify-center">
          <NavBar
            items={navItems}
            floating={false}
            size="lg"
            className="mb-8"
            innerClassName="gap-4"
            value={activeCategoryId}
            onValueChange={(value) => setActiveCategoryId(value)}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {activeCategory && (
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="mt-10"
            >
              <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
                <span className="text-base" aria-hidden="true">{activeCategory.emoji}</span>
                <span>{activeCategory.name}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 overflow-x-auto pb-2 md:gap-5 md:overflow-visible md:pb-0">
                {activeCategory.filters.map((filter) => (
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
          )}
        </AnimatePresence>
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
