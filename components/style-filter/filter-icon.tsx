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
    console.log('🚀 Native drag started:', filter.id);
    setIsDragging(true);
    
    // 设置拖拽数据
    e.dataTransfer.setData('application/json', JSON.stringify(filter));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    console.log('🏁 Native drag ended:', filter.id);
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
        'flex flex-col items-center justify-center p-4 cursor-grab transition-all duration-200',
        'hover:bg-white/5 hover:shadow-md filter-icon-container',
        isDragging && 'opacity-50 scale-110',
        className
      )}
    >
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        title={filter.description}
        className="flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        style={{
          opacity: isDragging ? 0.5 : 1,
          transform: isDragging ? 'scale(1.05)' : 'scale(1)'
        }}
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
    </FilterSnapEffect>
  );
}

/**
 * 风格滤镜图标列表组件
 * 显示多个风格滤镜图标
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
    <div className={cn('flex flex-nowrap gap-10 justify-between', className)}>
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