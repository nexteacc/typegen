"use client"

import React, { useRef, useState } from 'react';
import Image from 'next/image';
// 使用原生 HTML5 拖拽，移除 dnd-kit
import { cn } from '@/utils/cn';
import { StyleFilter } from './types';
import { FilterSnapEffect, SnapEffectRef } from './snap-effect';

interface FilterIconProps {
  filter: StyleFilter;
  onClick?: (filter: StyleFilter) => void;
  onSnapComplete?: (filter: StyleFilter) => void;
  className?: string;
}

/**
 * 风格滤镜图标组件
 * 显示单个风格滤镜的图标和名称
 */
export function FilterIcon({
  filter,
  onClick,
  onSnapComplete,
  className
}: FilterIconProps) {
  const snapEffectRef = useRef<SnapEffectRef>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 原生拖拽事件处理
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    
    // 设置拖拽数据
    e.dataTransfer.setData('application/json', JSON.stringify(filter));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    onClick?.(filter);
  };

  const handleSnapComplete = () => {
    onSnapComplete?.(filter);
  };

  return (
    <FilterSnapEffect 
      ref={snapEffectRef}
      onSnapComplete={handleSnapComplete}
      className={cn(
        // 基础布局：垂直居中，固定尺寸
        'flex flex-col items-center justify-center',
        // 内边距和尺寸：确保在网格中统一
        'p-3 w-full min-h-[120px]',
        // 交互效果
        'cursor-grab transition-all duration-200',
        'hover:bg-white/5 hover:shadow-md rounded-lg',
        // 拖拽状态
        isDragging && 'opacity-50 scale-105',
        'filter-icon-container',
        className
      )}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className={cn(
          'flex flex-col items-center justify-center',
          'cursor-grab active:cursor-grabbing',
          'transition-transform duration-200 ease-out',
          isDragging && 'scale-105'
        )}
      >
        {/* 圆形logo容器 - 桌面端固定尺寸 */}
        <div className="relative w-16 h-16 rounded-full bg-white/10 flex items-center justify-center transform-gpu overflow-hidden group">
          <div className="absolute inset-0 rounded-full group-hover:bg-white/20 transition-colors duration-200"></div>
          <Image
            src={filter.icon}
            alt={filter.name}
            width={48}
            height={48}
            className="object-cover w-full h-full z-10 transition-all duration-200 group-hover:scale-110 rounded-full"
          />
        </div>
        {/* 滤镜名称 - 桌面端固定字号 */}
        <span className="mt-2 text-xs text-center font-medium leading-tight w-16">
          {filter.name}
        </span>
      </div>
    </FilterSnapEffect>
  );
}

/**
 * 风格滤镜图标列表组件
 * 桌面端固定布局：8列网格，统一间距
 */
export function FilterIconList({
  filters,
  onSelectFilter,
  onSnapComplete,
  className
}: {
  filters: StyleFilter[];
  selectedFilter?: StyleFilter | null;
  onSelectFilter?: (filter: StyleFilter) => void;
  onSnapComplete?: (filter: StyleFilter) => void;
  className?: string;
}) {
  return (
    <div className={cn(
      // 桌面端固定8列网格布局
      'grid grid-cols-8 gap-6 justify-items-center w-full max-w-4xl mx-auto',
      className
    )}>
      {filters.map(filter => (
        <FilterIcon
          key={filter.id}
          filter={filter}
          onClick={onSelectFilter}
          onSnapComplete={onSnapComplete}
        />
      ))}
    </div>
  );
}
