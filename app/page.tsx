"use client"

import { useState } from "react";
import { StyleFilter, TransformerState, FilterIconsContainer } from "@/components/style-filter";
import { TextBoxSnapEffect } from "@/components/style-filter/text-box-snap-effect";
import { LightSweepEffect } from "@/components/style-filter/light-sweep-effect";
import { TransformApiClient } from "@/lib/api-client";
import { LengthControl } from "@/components/length-control";
import { cn } from "@/utils/cn";

export default function Home() {
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
  const [apiClient] = useState(() => new TransformApiClient());

  // 处理文本输入
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    if (newText.trim() && state === "idle") {
      setState("readyToTransform");
    }
    if (!newText.trim() && state !== "idle") {
      setState("idle");
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    const filterData = e.dataTransfer.getData('application/json');
    if (filterData) {
      const draggedFilter = JSON.parse(filterData) as StyleFilter;

      setSelectedFilter(draggedFilter);

      if (text.trim()) {
        setState("transforming");
      }
      setDroppedFilter(draggedFilter);
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
          alert(`Transform failed: ${result.error?.message || 'Unknown error'}`);
          setState("readyToTransform");
        }
      } catch (error: unknown) {
        const err = error as { message?: string };
        alert(`Network error: ${err.message || 'Unknown error'}`);
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
      alert('Text copied to clipboard!');
    } catch {
      alert('Copy failed, please copy text manually');
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
    <div className="flex flex-col min-h-screen w-full">
      {/* 主内容区域 - 减少flex-1的影响，添加固定间距 */}
      <div className="flex flex-col items-center justify-center px-8 py-16 flex-grow"> {/* 使用py-16代替pb-12，flex-grow代替flex-1 */}
        <div className={cn(
          "relative transition-all duration-500",
          state === "transformed" ? "w-[1000px]" : "w-[500px]"
        )}>
          {/* 转换前：单栏布局 */}
          {state !== "transformed" && (
            <div className="relative">
              <div
                className={cn(
                  "w-full h-[200px] bg-transparent flex items-center justify-center p-4 relative",
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
                  placeholder="paste text here"
                  className="w-full h-full border-none bg-transparent text-center center-placeholder-textarea input-rounded resize-none outline-none"
                  style={{ borderRadius: '16px' }}
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
                  "text-xs transition-colors",
                  text.length > 5000 ? "text-red-500 font-medium" : "text-gray-400"
                )}>
                  {text.length}/5000
                </span>
              </div>
              
              {text.trim() && (
                <LengthControl
                  originalLength={text.length}
                  value={targetLength}
                  onChange={setTargetLength}
                  className="mt-4"
                />
              )}
            </div>
          )}

          {/* 转换后：双栏对比布局 */}
          {state === "transformed" && (
            <div className="flex gap-8">
              <div className="flex-1">
                <div className="mb-3 text-sm text-gray-500 font-medium text-center">
                  Original Text
                </div>
                <div className={cn(
                  "w-full h-[200px] bg-gray-50 flex items-center justify-center p-4 relative",
                  "border-2 border-gray-200 transition-all duration-300 container-rounded"
                )}>
                  <textarea
                    className="w-full h-full border-none bg-transparent text-left input-rounded resize-none outline-none text-gray-600"
                    style={{ borderRadius: '16px' }}
                    value={originalText}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-3xl text-green-500 animate-pulse">
                  →
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-3 text-sm text-green-600 font-medium text-center">
                  Transformed Result ({selectedFilter?.name})
                </div>
                <div className={cn(
                  "w-full h-[200px] bg-transparent flex items-center justify-center p-4 relative",
                  "border-2 border-solid border-green-500 shadow-glow container-rounded"
                )}>
                  <textarea
                    className="w-full h-full border-none bg-transparent text-left input-rounded resize-none outline-none"
                    style={{ borderRadius: '16px' }}
                    value={text}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* 结果操作按钮 */}
          {showResultActions && state === "transformed" && (
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={handleCopyText}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                📋 Copy Text
              </button>
              <button
                onClick={handleTryOtherStyle}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                🎨 Try Other Style
              </button>
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                🔄 Restart
              </button>
            </div>
          )}
        </div>
        
        {/* 提示信息 */}
        {state === 'readyToTransform' && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Drag a filter from the toolbar below to transform your text
          </div>
        )}
      </div>

      {/* 底部滤镜工具栏 - 固定底部，移除边框线 */}
      <div className="bg-gray-50/30 pt-2"> {/* 移除border-t，添加pt-2上边距 */}
        <FilterIconsContainer
          state={state}
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
          onSnapComplete={handleSnapComplete}
        />
      </div>
    </div>
  );
}