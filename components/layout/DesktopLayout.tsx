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
            "relative mx-auto transition-all duration-500",
            state === "transformed" ? "max-w-[1500px]" : "max-w-[680px]"
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
                initial={{ opacity: 0, scale: 0.95, y: 32 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 24 }}
                transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  layout
                  className="relative mb-4 flex w-full justify-center"
                >
                  <motion.div
                    layout
                    initial={{ width: 680 }}
                    animate={{ width: isExpanding ? 1420 : 1420 }}
                    transition={{
                      type: 'spring',
                      stiffness: isExpanding ? 120 : 220,
                      damping: isExpanding ? 18 : 26,
                      duration: isExpanding ? 0.6 : 0.2
                    }}
                    className="h-[8px] rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 shadow-[0_0_40px_rgba(56,189,248,0.35)]"
                  />
                </motion.div>
                <div className="flex flex-nowrap items-stretch justify-center gap-6 lg:gap-8">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, type: 'spring', stiffness: 180, damping: 20 }}
                    className="flex w-full max-w-[680px] flex-col flex-shrink-0"
                  >
                    <div className="mb-4 text-center text-sm font-medium text-gray-500">
                      {t('originalText')}
                    </div>
                    <motion.div
                      layout
                      className={cn(
                        "w-full bg-gray-50 p-5",
                        "border-2 border-gray-200 transition-all duration-300 container-rounded"
                      )}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.12, type: 'spring', stiffness: 220, damping: 22 }}
                      style={{ borderRadius: '20px', height: '360px', width: '680px', maxWidth: '100%' }}
                    >
                      <textarea
                        className="h-full w-full border-none bg-transparent input-rounded resize-none text-left text-base text-gray-600 outline-none"
                        style={{ borderRadius: '16px' }}
                        value={originalText}
                        readOnly
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 16 }}
                    className="hidden h-[360px] w-10 flex-shrink-0 items-center justify-center sm:flex md:w-12"
                  >
                    <div className="text-4xl text-green-500 animate-pulse">→</div>
                  </motion.div>

                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, type: 'spring', stiffness: 180, damping: 20 }}
                    className="flex w-full max-w-[680px] flex-col flex-shrink-0"
                  >
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                      {t('transformedResult')} ({selectedFilter?.name})
                    </div>
                    <motion.div
                      layout
                      className={cn(
                        "w-full bg-transparent p-5",
                        "border-2 border-solid border-green-500 shadow-glow container-rounded"
                      )}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.22, type: 'spring', stiffness: 240, damping: 19 }}
                      style={{ borderRadius: '20px', height: '360px', width: '680px', maxWidth: '100%' }}
                    >
                      <textarea
                        className="h-full w-full border-none bg-transparent input-rounded resize-none text-left text-base outline-none"
                        style={{ borderRadius: '16px' }}
                        value={text}
                        readOnly
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {showResultActions && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ delay: 0.26, type: 'spring', stiffness: 200, damping: 20 }}
                    className="mt-8 flex flex-wrap justify-center gap-4"
                  >
                    <button onClick={onCopyText} className="rounded-lg bg-blue-500 px-6 py-3 text-base text-white transition-colors hover:bg-blue-600">
                      {t('copyText')}
                    </button>
                    <button onClick={onTryOtherStyle} className="rounded-lg bg-green-500 px-6 py-3 text-base text-white transition-colors hover:bg-green-600">
                      {t('tryOtherStyle')}
                    </button>
                    <button onClick={onRestart} className="rounded-lg bg-gray-500 px-6 py-3 text-base text-white transition-colors hover:bg-gray-600">
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
