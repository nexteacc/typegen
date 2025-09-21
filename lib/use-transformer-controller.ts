"use client";

import { useCallback, useMemo, useState } from 'react';
import { TransformApiClient } from '@/lib/api-client';
import type { StyleFilter, TransformerState } from '@/components/style-filter';
import type { TranslationKey } from '@/lib/translations';

export interface TransformerController {
  // state
  text: string;
  originalText: string;
  state: TransformerState;
  selectedFilter: StyleFilter | null;
  droppedFilter: StyleFilter | null;
  isOver: boolean;
  isLightScanning: boolean;
  showResultActions: boolean;
  targetLength: number;
  isTextTooLong: boolean;
  isExpanding: boolean;

  // actions
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onTextBoxSnapComplete: () => void;
  onLightSweepComplete: () => Promise<void>;
  onCopyText: () => Promise<void>;
  onTryOtherStyle: () => void;
  onRestart: () => void;
  onStartFilter: (filter: StyleFilter) => void;
  setTargetLength: (len: number) => void;
}

/**
 * 统一的转换流程控制器 Hook
 * 把原 page.tsx 中的状态与流程集中管理，供桌面/移动两套布局复用
 */
export function useTransformerController(t: (key: TranslationKey) => string): TransformerController {
  const [text, setText] = useState<string>('');
  const [state, setState] = useState<TransformerState>('idle');
  const [selectedFilter, setSelectedFilter] = useState<StyleFilter | null>(null);
  const [droppedFilter, setDroppedFilter] = useState<StyleFilter | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [isLightScanning, setIsLightScanning] = useState(false);
  const [originalText, setOriginalText] = useState<string>('');
  const [showResultActions, setShowResultActions] = useState(false);
  const [targetLength, setTargetLength] = useState<number>(0);
  const [isTextTooLong, setIsTextTooLong] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const apiClient = useMemo(() => new TransformApiClient(), []);

  const onTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    const tooLong = newText.length > 5000;
    setIsTextTooLong(tooLong);
    if (newText.trim() && state === 'idle') setState('readyToTransform');
    if (!newText.trim() && state !== 'idle') {
      setState('idle');
      setIsTextTooLong(false);
    }
  }, [state]);

  const onStartFilter = useCallback((filter: StyleFilter) => {
    setSelectedFilter(filter);
    if (text.trim()) setState('transforming');
    setShowResultActions(false);
    setDroppedFilter(filter);
  }, [text]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isOver) setIsOver(true);
  }, [isOver]);

  const onDragLeave = useCallback(() => setIsOver(false), []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const filterData = e.dataTransfer.getData('application/json');
    if (filterData) {
      const draggedFilter = JSON.parse(filterData) as StyleFilter;
      onStartFilter(draggedFilter);
    }
  }, [onStartFilter]);

  const onTextBoxSnapComplete = useCallback(() => {
    setDroppedFilter(null);
    setIsLightScanning(true);
  }, []);

  const onLightSweepComplete = useCallback(async () => {
    setIsLightScanning(false);
    if (text.trim() && selectedFilter) {
      setState('transforming');
      setOriginalText(text);
      setIsExpanding(true);
      try {
        const result = await apiClient.transformText(
          text,
          selectedFilter.apiParameter,
          targetLength > 0 ? targetLength : undefined
        );
        if (result.success && result.data) {
          setText(result.data.transformedText);
          setState('transformed');
          setTimeout(() => setIsExpanding(false), 600);
          setShowResultActions(true);
        } else {
          alert(`${t('transformFailed')}: ${result.error?.message || t('unknownError')}`);
          setState('readyToTransform');
          setIsExpanding(false);
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        alert(`${t('networkError')}: ${err.message || t('unknownError')}`);
        setState('readyToTransform');
        setIsExpanding(false);
      }
    } else {
      setState('readyToTransform');
      setIsExpanding(false);
    }
  }, [apiClient, selectedFilter, t, targetLength, text]);

  const onCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t('copySuccess'));
    } catch {
      alert(t('copyFailed'));
    }
  }, [t, text]);

  const onTryOtherStyle = useCallback(() => {
    setText(originalText);
    setState('readyToTransform');
    setShowResultActions(false);
    setSelectedFilter(null);
    setIsExpanding(false);
  }, [originalText]);

  const onRestart = useCallback(() => {
    setText('');
    setOriginalText('');
    setState('idle');
    setShowResultActions(false);
    setSelectedFilter(null);
    setDroppedFilter(null);
    setIsExpanding(false);
  }, []);

  return {
    text,
    originalText,
    state,
    selectedFilter,
    droppedFilter,
    isOver,
    isLightScanning,
    showResultActions,
    targetLength,
    isTextTooLong,
    isExpanding,
    onTextChange,
    onDragOver,
    onDragLeave,
    onDrop,
    onTextBoxSnapComplete,
    onLightSweepComplete,
    onCopyText,
    onTryOtherStyle,
    onRestart,
    onStartFilter,
    setTargetLength,
  };
}
