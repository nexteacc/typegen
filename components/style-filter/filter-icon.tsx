"use client"

import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { StyleFilter } from './types';

interface FilterIconProps {
  filter: StyleFilter;
  isSelected?: boolean;
  onClick?: (filter: StyleFilter) => void;
  className?: string;
}

/**
 * 风格滤镜图标组件
 * 显示单个风格滤镜的图标和名称
 */
export function FilterIcon({
  filter,
  isSelected = false,
  onClick,
  className
}: FilterIconProps) {
  const handleClick = () => {
    onClick?.(filter);
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-200',
        'hover:scale-110 hover:shadow-md',
        // 移除选中效果
        className
      )}
      onClick={handleClick}
      title={filter.description}
    >
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
        <Image
          src={filter.icon}
          alt={filter.name}
          width={42}
          height={42}
          className="object-contain"
        />
      </div>
      <span className="mt-2 text-xs text-center w-16">{filter.name}</span>
    </div>
  );
}

/**
 * 风格滤镜图标列表组件
 * 显示多个风格滤镜图标
 */
export function FilterIconList({
  filters,
  selectedFilter,
  onSelectFilter,
  className
}: {
  filters: StyleFilter[];
  selectedFilter?: StyleFilter | null;
  onSelectFilter?: (filter: StyleFilter) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-nowrap gap-8 justify-between', className)}>
      {filters.map(filter => (
        <FilterIcon
          key={filter.id}
          filter={filter}
          isSelected={selectedFilter?.id === filter.id}
          onClick={onSelectFilter}
        />
      ))}
    </div>
  );
}