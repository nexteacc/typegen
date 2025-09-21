"use client"

import { useState } from "react";
import Image from "next/image";
import { StyleFilter, TransformerState, FilterIconsContainer, MobileFilterSheet } from "@/components/style-filter";
import { TextBoxSnapEffect } from "@/components/style-filter/text-box-snap-effect";
import { LightSweepEffect } from "@/components/style-filter/light-sweep-effect";
import { TransformApiClient } from "@/lib/api-client";
import { LengthControl } from "@/components/length-control";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/use-translation";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/utils/cn";

export default function Home() {
  const { t } = useTranslation();
  
  // 状态管理
  const [text, setText] = useState<string>("");
  const [state, setState] = useState<TransformerState>("idle");
  const [selectedFilter, setSelectedFilter] = useState<StyleFilter | null>(null);
  const [droppedFilter, setDroppedFilter] = useState<StyleFilter | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [isLightScanning, setIsLightScanning] = useState(false);
  const [originalText, setOriginalText] = useState<string>("");
  const [showResultActions, setShowResultActions] = useState(false);
  const [targetLength, setTargetLength] = useState<number>(0);
  const [isTextTooLong, setIsTextTooLong] = useState(false);
  const [apiClient] = useState(() => new TransformApiClient());
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  // 处理文本输入
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // 检查文本长度并设置警告状态
    const isTooLong = newText.length > 5000;
    setIsTextTooLong(isTooLong);

    if (newText.trim() && state === "idle") {
      setState("readyToTransform");
    }
    if (!newText.trim() && state !== "idle") {
      setState("idle");
      setIsTextTooLong(false); // 清除警告状态
    }
  };

  const handleFilterSelect = () => {
    if (text.trim()) {
      setState("readyToTransform");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isOver) {
      setIsOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const startFilterTransformation = (filter: StyleFilter) => {
    setSelectedFilter(filter);

    if (text.trim()) {
      setState("transforming");
    }

    setShowResultActions(false);
    setDroppedFilter(filter);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    const filterData = e.dataTransfer.getData('application/json');
    if (filterData) {
      const draggedFilter = JSON.parse(filterData) as StyleFilter;
      startFilterTransformation(draggedFilter);
    }
  };

  const handleTextBoxSnapComplete = () => {
    setDroppedFilter(null);
    setIsLightScanning(true);
  };

  const handleLightSweepComplete = async () => {
    setIsLightScanning(false);
    
    if (text.trim() && selectedFilter) {
      setState("transforming");
      setOriginalText(text);
      
      try {
        const result = await apiClient.transformText(
          text, 
          selectedFilter.apiParameter, 
          targetLength > 0 ? targetLength : undefined
        );
        
        if (result.success && result.data) {
          setText(result.data.transformedText);
          setState("transformed");
          setShowResultActions(true);
        } else {
          alert(`${t('transformFailed')}: ${result.error?.message || t('unknownError')}`);
          setState("readyToTransform");
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        alert(`${t('networkError')}: ${err.message || t('unknownError')}`);
        setState("readyToTransform");
      }
    } else {
      setState("readyToTransform");
    }
  };

  const handleSnapComplete = () => {};

  // 结果操作处理函数
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t('copySuccess'));
    } catch {
      alert(t('copyFailed'));
    }
  };

  const handleTryOtherStyle = () => {
    setText(originalText);
    setState("readyToTransform");
    setShowResultActions(false);
    setSelectedFilter(null);
  };

  const handleRestart = () => {
    setText("");
    setOriginalText("");
    setState("idle");
    setShowResultActions(false);
    setSelectedFilter(null);
    setDroppedFilter(null);
  };

  return (
    <div className="relative flex w-full flex-1 flex-col">
      {/* 头部区域 - Logo 和语言切换 */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo-header-white.png"
            alt="TypeGen Logo"
            width={36}
            height={36}
            className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
            priority
          />
          <h1 className="text-base font-bold text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 via-cyan-400 to-blue-500 bg-clip-text sm:text-lg">
            TypeGen
          </h1>
        </div>

        {/* 语言切换按钮 */}
        <LanguageToggle className="shadow-lg" />
      </header>

      {/* 主内容区域 */}
      <div className="flex w-full flex-1 flex-col items-center px-4 pb-6 pt-4 sm:px-6 md:px-8 md:pb-10 md:pt-8">
        <div
          className={cn(
            "relative w-full max-w-2xl transition-all duration-500 sm:max-w-3xl",
            state === "transformed" ? "lg:max-w-5xl" : "lg:max-w-3xl"
          )}
        >
          {/* 转换前：单栏布局 */}
          {state !== "transformed" && (
            <div className="relative">
              <div
                className={cn(
                  "relative flex min-h-[200px] w-full items-stretch justify-center bg-transparent p-4",
                  "border-2 border-dashed border-gray-300 transition-all duration-300",
                  "container-rounded",
                  isOver && "border-solid border-blue-500 shadow-glow",
                  state === "readyToTransform" && "border-solid border-blue-500 shadow-glow",
                  state === "transforming" && "border-solid border-yellow-500 shadow-glow"
                )}
                style={{ borderRadius: '20px' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <textarea
                  placeholder={t('pasteTextHere')}
                  className="w-full flex-1 border-none bg-transparent center-placeholder-textarea input-rounded resize-none text-sm outline-none sm:text-base"
                  style={{ borderRadius: '16px', minHeight: '180px' }}
                  value={text}
                  onChange={handleTextChange}
                  readOnly={state === "transforming"}
                />

                {droppedFilter && (
                  <TextBoxSnapEffect
                    filter={droppedFilter}
                    onComplete={handleTextBoxSnapComplete}
                  />
                )}

                <LightSweepEffect
                  isActive={isLightScanning}
                  onComplete={handleLightSweepComplete}
                />
              </div>
              
              <div className="mt-2 text-center">
                <span className={cn(
                  "text-xs transition-colors sm:text-sm",
                  text.length > 5000 ? "text-red-500 font-medium" : "text-gray-400"
                )}>
                  {text.length}/5000
                </span>
              </div>

              {/* 文本超长警告消息 */}
              {isTextTooLong && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-red-500 sm:text-sm">
                      {t('textTooLongWarning')}
                    </span>
                  </div>
                </div>
              )}
              
              {text.trim() && (
                <LengthControl
                  originalLength={text.length}
                  value={targetLength}
                  onChange={setTargetLength}
                  className="mt-5 sm:mt-6"
                />
              )}
            </div>
          )}

          {/* 转换后：双栏对比布局 */}
          {state === "transformed" && (
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
              <div className="flex-1">
                <div className="mb-3 text-center text-xs font-medium text-gray-500 sm:text-sm">
                  {t('originalText')}
                </div>
                <div className={cn(
                  "w-full min-h-[200px] bg-gray-50 p-4",
                  "border-2 border-gray-200 transition-all duration-300 container-rounded"
                )}
                >
                  <textarea
                    className="w-full flex-1 border-none bg-transparent input-rounded resize-none text-left text-sm text-gray-600 outline-none sm:text-base"
                    style={{ borderRadius: '16px', minHeight: '180px' }}
                    value={originalText}
                    readOnly
                  />
                </div>
              </div>

              <div className="hidden items-center justify-center md:flex">
                <div className="text-3xl text-green-500 animate-pulse">
                  →
                </div>
              </div>

              <div className="flex items-center justify-center md:hidden">
                <div className="text-2xl text-green-500 animate-pulse">
                  ↓
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-3 text-center text-xs font-medium text-green-600 sm:text-sm">
                  {t('transformedResult')} ({selectedFilter?.name})
                </div>
                <div className={cn(
                  "w-full min-h-[200px] bg-transparent p-4",
                  "border-2 border-solid border-green-500 shadow-glow container-rounded"
                )}
                >
                  <textarea
                    className="w-full flex-1 border-none bg-transparent input-rounded resize-none text-left text-sm outline-none sm:text-base"
                    style={{ borderRadius: '16px', minHeight: '180px' }}
                    value={text}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* 结果操作按钮 */}
          {showResultActions && state === "transformed" && (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
              <button
                onClick={handleCopyText}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 sm:w-auto sm:text-base"
              >
                {t('copyText')}
              </button>
              <button
                onClick={handleTryOtherStyle}
                className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 sm:w-auto sm:text-base"
              >
                {t('tryOtherStyle')}
              </button>
              <button
                onClick={handleRestart}
                className="w-full rounded-lg bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600 sm:w-auto sm:text-base"
              >
                {t('restart')}
              </button>
            </div>
          )}
        </div>
        
        {/* 提示信息 */}
        {state === 'readyToTransform' && (
          <div className="mt-6 px-4 text-center text-sm text-gray-500 sm:mt-8">
            {isDesktop ? t('dragFilterHint') : t('tapFilterHint')}
          </div>
        )}
      </div>

      {/* 底部滤镜工具栏 */}
      <div className="w-full bg-gray-50/40 px-3 pb-4 pt-3 sm:px-6 md:pb-6">
        {isDesktop ? (
          <FilterIconsContainer
            state={state}
            selectedFilter={selectedFilter}
            onFilterSelect={handleFilterSelect}
            onSnapComplete={handleSnapComplete}
          />
        ) : (
          <MobileFilterSheet
            state={state}
            onFilterSelect={startFilterTransformation}
          />
        )}
      </div>
    </div>
  );
}
