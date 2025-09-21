"use client";

import { useTranslation } from "@/lib/use-translation";
import { cn } from "@/utils/cn";
import { LengthControl } from "@/components/length-control";
import { FilterIconsContainer, TextBoxSnapEffect, LightSweepEffect } from "@/components/style-filter";
import type { TransformerController } from "@/lib/use-transformer-controller";

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

  const handleSnapComplete = () => {};

  return (
    <>
      <div className="flex w-full flex-1 flex-col items-center px-4 pb-6 pt-4 sm:px-6 md:px-8 md:pb-10 md:pt-8">
        <div
          className={cn(
            "relative mx-auto w-full max-w-2xl transition-all duration-500",
            state === "transformed" ? "lg:max-w-3xl" : "lg:max-w-2xl"
          )}
        >
          {state !== "transformed" && (
            <div className="relative">
              <div
                className={cn(
                  "relative mx-auto flex min-h-[200px] w-full max-w-xl items-stretch justify-center bg-transparent p-4",
                  "border-2 border-dashed border-gray-300 transition-all duration-300",
                  "container-rounded",
                  isOver && "border-solid border-blue-500 shadow-glow",
                  state === "readyToTransform" && "border-solid border-blue-500 shadow-glow",
                  state === "transforming" && "border-solid border-yellow-500 shadow-glow"
                )}
                style={{ borderRadius: '20px' }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <textarea
                  placeholder={t('pasteTextHere')}
                  className="w-full flex-1 border-none bg-transparent center-placeholder-textarea input-rounded resize-none text-sm outline-none sm:text-base"
                  style={{ borderRadius: '16px', minHeight: '180px' }}
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

              <div className="mt-2 text-center">
                <span className={cn(
                  "text-xs transition-colors sm:text-sm",
                  text.length > 5000 ? "text-red-500 font-medium" : "text-gray-400"
                )}>
                  {text.length}/5000
                </span>
              </div>

              {isTextTooLong && (
                <div className="mx-auto mt-3 max-w-xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 sm:px-4 sm:py-3">
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
                  className="mt-5 sm:mt-6 max-w-lg mx-auto"
                />
              )}
            </div>
          )}

          {state === "transformed" && (
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-10">
              <div className="w-full max-w-lg">
                <div className="mb-3 text-center text-xs font-medium text-gray-500 sm:text-sm">
                  {t('originalText')}
                </div>
                <div
                  className={cn(
                    "w-full min-h-[240px] bg-gray-50 p-4",
                    "border-2 border-gray-200 transition-all duration-300 container-rounded"
                  )}
                >
                  <textarea
                    className="w-full flex-1 border-none bg-transparent input-rounded resize-none text-left text-sm text-gray-600 outline-none sm:text-base"
                    style={{ borderRadius: '16px', minHeight: '220px' }}
                    value={originalText}
                    readOnly
                  />
                </div>
              </div>

              <div className="hidden lg:flex lg:h-full lg:min-h-[240px] lg:w-8 lg:items-center lg:justify-center">
                <div className="text-3xl text-green-500 animate-pulse">→</div>
              </div>

              <div className="w-full max-w-lg">
                <div className="mb-3 text-center text-xs font-medium text-green-600 sm:text-sm">
                  {t('transformedResult')} ({selectedFilter?.name})
                </div>
                <div
                  className={cn(
                    "w-full min-h-[240px] bg-transparent p-4",
                    "border-2 border-solid border-green-500 shadow-glow container-rounded"
                  )}
                >
                  <textarea
                    className="w-full flex-1 border-none bg-transparent input-rounded resize-none text-left text-sm outline-none sm:text-base"
                    style={{ borderRadius: '16px', minHeight: '220px' }}
                    value={text}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {showResultActions && state === "transformed" && (
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
              <button onClick={onCopyText} className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 sm:w-auto sm:text-base">
                {t('copyText')}
              </button>
              <button onClick={onTryOtherStyle} className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 sm:w-auto sm:text-base">
                {t('tryOtherStyle')}
              </button>
              <button onClick={onRestart} className="w-full rounded-lg bg-gray-500 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600 sm:w-auto sm:text-base">
                {t('restart')}
              </button>
            </div>
          )}
        </div>

        {state === 'readyToTransform' && (
          <div className="mt-6 px-4 text-center text-sm text-gray-500 sm:mt-8">{t('dragFilterHint')}</div>
        )}
      </div>

      <div className="w-full bg-gray-50/40 px-3 pb-4 pt-3 sm:px-6 md:pb-6">
        <FilterIconsContainer
          state={state}
          selectedFilter={selectedFilter}
          onFilterSelect={() => { /* 保持与原逻辑一致：点击只提示、拖拽才触发 */ }}
          onSnapComplete={handleSnapComplete}
        />
      </div>
    </>
  );
}
