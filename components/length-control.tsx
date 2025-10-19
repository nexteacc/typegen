/**
 * 字数控制滑动条组件
 * 允许用户设置目标文本长度
 */

"use client"

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/utils/cn';

interface LengthControlProps {
  /** 原文字数 */
  originalLength: number;
  /** 当前设置的目标字数 */
  value?: number;
  /** 字数变化回调 */
  onChange?: (length: number) => void;
  /** 最小字数 */
  min?: number;
  /** 最大字数 */
  max?: number;
  /** 步长 */
  step?: number;
  /** 额外的CSS类名 */
  className?: string;
}

export function LengthControl({
  originalLength,
  value,
  onChange,
  min = 50,
  max = 5000,
  step = 50,
  className
}: LengthControlProps) {
  const { t } = useTranslation();
  
  // 内部状态，默认值为原文长度
  const [currentValue, setCurrentValue] = useState(value ?? originalLength);

  // 当原文长度变化时，重置默认值
  useEffect(() => {
    if (!value) {
      setCurrentValue(originalLength);
    }
  }, [originalLength, value]);

  // 处理滑动条变化
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  // 处理数字输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setCurrentValue(newValue);
      onChange?.(newValue);
    }
  };

  // 计算相对原文的比例
  const ratio = originalLength > 0 ? (currentValue / originalLength) : 1;
  const percentage = Math.round(ratio * 100);

  // 根据比例确定颜色
  const getSliderColor = () => {
    if (ratio < 0.5) return 'text-blue-500'; // 压缩
    if (ratio > 1.2) return 'text-green-500'; // 扩展
    return 'text-gray-600'; // 标准
  };

  return (
    <div className={cn('w-full space-y-0.5', className)}>
      {/* 标题和数字输入 - 紧凑化 */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">{t('targetLength')}:</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleInputChange}
            className="w-16 px-1 py-0.5 text-right border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-gray-500 text-xs">{t('chars')}</span>
          <span className={cn("text-xs", getSliderColor())}>
            ({percentage}%)
          </span>
        </div>
      </div>

      {/* 滑动条 - 紧凑化 */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        {/* 范围标签 */}
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>{min} {t('chars')}</span>
          <span>{max} {t('chars')}</span>
        </div>
      </div>

      {/* 状态指示 - 移除，节省空间 */}
    </div>
  );
}
