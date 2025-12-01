"use client";

import { useTranslation } from "@/lib/use-translation";
import { cn } from "@/utils/cn";
import { LengthControl } from "@/components/length-control";
import { FilterIconsContainer, TextBoxSnapEffect, LightSweepEffect } from "@/components/style-filter";
import type { TransformerController } from "@/lib/use-transformer-controller";
import { AnimatePresence, motion } from "framer-motion";

interface DesktopLayoutProps {
  controller: TransformerController;
}

export function DesktopLayout({ controller }: DesktopLayoutProps) {
  const { t } = useTranslation();

  const {
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
    onTextChange,
    onDragOver,
    onDragLeave,
    onDrop,
    onTextBoxSnapComplete,
    onLightSweepComplete,
    onCopyText,
    onTryOtherStyle,
    onRestart,
    setTargetLength,
  } = controller;

  const handleSnapComplete = () => { };

  return (
    <div className="flex h-full w-full flex-col">
      {/* 文本内容区域 */}
      <div
        className={cn(
          "flex w-full flex-shrink-0 flex-col items-center pb-4 pt-12",
          state === "transformed" ? "px-4 md:px-6 lg:px-8" : "px-6 md:px-8"
        )}
      >
        <div
          className={cn(
            "relative mx-auto w-full transition-all duration-500",
            state === "transformed" ? "max-w-[1400px]" : "max-w-[680px]"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {state !== "transformed" ? (
              <motion.div
                key="editor"
                layout
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    "relative flex w-full min-w-0 items-stretch justify-center bg-transparent",
                    "border-2 border-dashed border-gray-300 transition-all duration-300",
                    "container-rounded",
                    isOver && "border-solid border-blue-500 shadow-glow",
                    state === "readyToTransform" && "border-solid border-blue-500 shadow-glow",
                    state === "transforming" && "border-solid border-yellow-500 shadow-glow"
                  )}
                  style={{ borderRadius: '20px', height: '360px', width: '680px' }}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  <textarea
                    placeholder={t('pasteTextHere')}
                    className="h-full w-full border-none bg-transparent center-placeholder-textarea input-rounded resize-none p-6 text-base outline-none"
                    style={{ borderRadius: '16px' }}
                    value={text}
                    onChange={onTextChange}
                    readOnly={state === "transforming"}
                  />

                  {droppedFilter && (
                    <TextBoxSnapEffect
                      filter={droppedFilter}
                      onComplete={onTextBoxSnapComplete}
                    />
                  )}

                  <LightSweepEffect isActive={isLightScanning} onComplete={onLightSweepComplete} />
                </div>

                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="mt-3 text-center"
                >
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      text.length > 5000 ? "text-red-500 font-medium" : "text-gray-400"
                    )}
                  >
                    {text.length}/5000
                  </span>
                </motion.div>

                <AnimatePresence>{isTextTooLong && (
                  <motion.div
                    key="too-long"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mx-auto mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-red-500">
                        {t('textTooLongWarning')}
                      </span>
                    </div>
                  </motion.div>
                )}</AnimatePresence>

                {text.trim() && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: 0.1, duration: 0.25 }}
                    className="mt-6 w-full"
                  >
                    <LengthControl
                      originalLength={text.length}
                      value={targetLength}
                      onChange={setTargetLength}
                      className="mx-auto"
                    />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                className="flex w-full flex-col items-center"
              >
                {/* 双栏对比布局 */}
                <div className="flex w-full items-stretch gap-6">
                  {/* 原文区 */}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex w-[calc(50%-2rem)] flex-col"
                  >
                    <div className="mb-3 text-center text-sm font-medium text-gray-400">
                      {t('originalText')}
                    </div>
                    <div className="h-[360px] rounded-2xl border border-gray-200 bg-white p-5">
                      <textarea
                        className="h-full w-full resize-none border-none bg-transparent text-base text-gray-600 outline-none"
                        value={originalText}
                        readOnly
                      />
                    </div>
                  </motion.div>

                  {/* 箭头指示 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex w-12 items-center justify-center"
                  >
                    <div className="text-3xl text-gray-300">→</div>
                  </motion.div>

                  {/* 结果区 */}
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex w-[calc(50%-2rem)] flex-col"
                  >
                    <div className="mb-3 text-center text-sm font-medium text-gray-600">
                      {t('transformedResult')} <span className="text-gray-400">({selectedFilter?.name})</span>
                    </div>
                    <div className="h-[360px] rounded-2xl border-2 border-blue-500 bg-white p-5">
                      <textarea
                        className="h-full w-full resize-none border-none bg-transparent text-base text-gray-800 outline-none"
                        value={text}
                        readOnly
                      />
                    </div>
                  </motion.div>
                </div>

                {/* 操作按钮 - 统一灰色调 */}
                {showResultActions && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-wrap justify-center gap-3"
                  >
                    <button
                      onClick={onCopyText}
                      className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {t('copyText')}
                    </button>
                    <button
                      onClick={onTryOtherStyle}
                      className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {t('tryOtherStyle')}
                    </button>
                    <button
                      onClick={onRestart}
                      className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {t('restart')}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {state === 'readyToTransform' && (
          <div className="mt-6 text-center text-sm text-gray-500">{t('dragFilterHint')}</div>
        )}
      </div>

      {/* 滤镜导航栏 - 固定在底部 */}
      <div className="mt-auto w-full flex-shrink-0 px-6 pb-6 pt-4">
        <FilterIconsContainer
          state={state}
          selectedFilter={selectedFilter}
          onFilterSelect={() => { /* 保持与原逻辑一致：点击只提示、拖拽才触发 */ }}
          onSnapComplete={handleSnapComplete}
        />
      </div>
    </div>
  );
}
