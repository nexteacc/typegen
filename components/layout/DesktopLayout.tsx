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
      <div className="flex w-full flex-1 flex-col items-center px-8 pb-10 pt-8">
        <div
          className={cn(
            "relative mx-auto transition-all duration-500",
            state === "transformed" ? "max-w-4xl" : "max-w-xl"
          )}
        >
          {state !== "transformed" && (
            <>
              <div
                className={cn(
                  "relative flex items-stretch justify-center bg-transparent w-full min-w-0",
                  "border-2 border-dashed border-gray-300 transition-all duration-300",
                  "container-rounded",
                  isOver && "border-solid border-blue-500 shadow-glow",
                  state === "readyToTransform" && "border-solid border-blue-500 shadow-glow",
                  state === "transforming" && "border-solid border-yellow-500 shadow-glow"
                )}
                style={{ borderRadius: '20px', height: '280px', width: '576px' }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <textarea
                  placeholder={t('pasteTextHere')}
                  className="w-full h-full border-none bg-transparent center-placeholder-textarea input-rounded resize-none text-base outline-none p-6"
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

              <div className="mt-3 text-center">
                <span className={cn(
                  "text-sm transition-colors",
                  text.length > 5000 ? "text-red-500 font-medium" : "text-gray-400"
                )}>
                  {text.length}/5000
                </span>
              </div>

              {isTextTooLong && (
                <div className="mx-auto mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-red-500">
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
                  className="mt-6 mx-auto"
                />
              )}
            </>
          )}

          {state === "transformed" && (
            <div className="flex justify-center gap-8">
              <div className="w-full max-w-md">
                <div className="mb-4 text-center text-sm font-medium text-gray-500">
                  {t('originalText')}
                </div>
                <div
                  className={cn(
                    "w-full min-h-[320px] bg-gray-50 p-5",
                    "border-2 border-gray-200 transition-all duration-300 container-rounded"
                  )}
                >
                  <textarea
                    className="w-full flex-1 border-none bg-transparent input-rounded resize-none text-left text-base text-gray-600 outline-none"
                    style={{ borderRadius: '16px', minHeight: '300px' }}
                    value={originalText}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex h-full min-h-[320px] w-12 items-center justify-center">
                <div className="text-4xl text-green-500 animate-pulse">→</div>
              </div>

              <div className="w-full max-w-md">
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                  {t('transformedResult')} ({selectedFilter?.name})
                </div>
                <div
                  className={cn(
                    "w-full min-h-[320px] bg-transparent p-5",
                    "border-2 border-solid border-green-500 shadow-glow container-rounded"
                  )}
                >
                  <textarea
                    className="w-full flex-1 border-none bg-transparent input-rounded resize-none text-left text-base outline-none"
                    style={{ borderRadius: '16px', minHeight: '300px' }}
                    value={text}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {showResultActions && state === "transformed" && (
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={onCopyText} className="rounded-lg bg-blue-500 px-6 py-3 text-base text-white transition-colors hover:bg-blue-600">
                {t('copyText')}
              </button>
              <button onClick={onTryOtherStyle} className="rounded-lg bg-green-500 px-6 py-3 text-base text-white transition-colors hover:bg-green-600">
                {t('tryOtherStyle')}
              </button>
              <button onClick={onRestart} className="rounded-lg bg-gray-500 px-6 py-3 text-base text-white transition-colors hover:bg-gray-600">
                {t('restart')}
              </button>
            </div>
          )}
        </div>

        {state === 'readyToTransform' && (
          <div className="mt-8 text-center text-base text-gray-500">{t('dragFilterHint')}</div>
        )}
      </div>

      <div className="w-full bg-gray-50/40 px-6 pb-6 pt-4">
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
