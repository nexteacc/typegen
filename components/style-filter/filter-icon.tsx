"use client"

import React from 'react';
import Image from 'next/image';
import { useDraggable } from '@dnd-kit/core';
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
  // 使用dnd-kit的useDraggable钩子
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: filter.id,
    data: { filter },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleClick = () => {
    onClick?.(filter);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex flex-col items-center justify-center p-4 cursor-grab transition-all duration-200',
        'hover:bg-white/5 hover:shadow-md filter-icon-container',
        isDragging && 'opacity-50 scale-110',
        className
      )}
      onClick={handleClick}
      {...attributes}
      {...listeners}
      title={filter.description}
    >
      {/* 圆形logo容器 */}
      <div className="relative w-16 h-16 rounded-full bg-white/10 flex items-center justify-center transform-gpu overflow-hidden">
        <div className="absolute inset-0 rounded-full hover:bg-white/20 transition-colors duration-200"></div>
        <Image
          src={filter.icon}
          alt={filter.name}
          width={48}
          height={48}
          className="object-cover w-full h-full z-10 transition-all duration-200 hover:scale-110 rounded-full"
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
    <div className={cn('flex flex-nowrap gap-10 justify-between', className)}>
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