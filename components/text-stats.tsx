/**
 * 文本统计显示组件
 * 显示字符数、单词数等统计信息
 */

import React from 'react';
import { calculateTextStats, formatTextStats } from '@/lib/text-stats';
import { cn } from '@/utils/cn';

interface TextStatsProps {
  text: string;
  maxLength?: number;
  className?: string;
  compact?: boolean;
  showProgress?: boolean;
}

export function TextStats({ 
  text, 
  maxLength = 5000, 
  className,
  compact = true,
  showProgress = false
}: TextStatsProps) {
  const stats = calculateTextStats(text);
  const isOverLimit = stats.characters > maxLength;
  const progressPercentage = Math.min((stats.characters / maxLength) * 100, 100);

  return (
    <div className={cn("text-xs text-gray-500", className)}>
      <div className="flex items-center justify-between">
        <span className={cn(
          "transition-colors",
          isOverLimit && "text-red-500 font-medium"
        )}>
          {formatTextStats(stats, compact)}
        </span>
        
        {maxLength && (
          <span className={cn(
            "transition-colors",
            isOverLimit ? "text-red-500 font-medium" : "text-gray-400"
          )}>
            {stats.characters}/{maxLength}
          </span>
        )}
      </div>
      
      {/* 进度条（可选） */}
      {showProgress && maxLength && (
        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
          <div 
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              isOverLimit ? "bg-red-500" : "bg-blue-500"
            )}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}