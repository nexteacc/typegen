"use client"

import { useState } from "react";
import React from "react";
import { StyleFilter, TransformerState, FilterIconsContainer } from "@/components/style-filter";
import { TextBoxSnapEffect } from "@/components/style-filter/text-box-snap-effect";
import { LightSweepEffect } from "@/components/style-filter/light-sweep-effect";
import { TransformApiClient } from "@/lib/api-client";
import { cn } from "@/utils/cn";



export default function Home() {
  // 状态管理
  const [text, setText] = useState<string>("");
  const [state, setState] = useState<TransformerState>("idle");
  const [selectedFilter, setSelectedFilter] = useState<StyleFilter | null>(null);
  const [droppedFilter, setDroppedFilter] = useState<StyleFilter | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [isLightScanning, setIsLightScanning] = useState(false);
  const [originalText, setOriginalText] = useState<string>(""); // 保存原始文本
  const [showResultActions, setShowResultActions] = useState(false); // 显示结果操作按钮
  
  // API客户端实例
  const [apiClient] = useState(() => new TransformApiClient());


  // 处理文本输入
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // 用户输入文本后立即进入"可转换态"
    if (newText.trim() && state === "idle") {
      setState("readyToTransform");
    }

    // 如果文本为空，重置状态为idle
    if (!newText.trim() && state !== "idle") {
      setState("idle");
    }
  };

  // 处理滤镜选择
  const handleFilterSelect = () => {
    // 仍然设置状态为 readyToTransform，以便显示提示文本
    if (text.trim()) {
      setState("readyToTransform");
    }
  };

  // 原生拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // 允许拖放
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

  // 处理文本框内 snap 动画完成
  const handleTextBoxSnapComplete = () => {
    setDroppedFilter(null); // 清除显示的滤镜图标
    
    // 立即启动光幕扫描动画
    setIsLightScanning(true);
  };

  // 处理光幕扫描动画完成 - 集成API调用
  const handleLightSweepComplete = async () => {
    setIsLightScanning(false);
    
    // 调用API进行文本转换
    if (text.trim() && selectedFilter) {
      setState("transforming"); // 进入转换处理态
      setOriginalText(text); // 保存原始文本
      
      try {
        // 调用API转换文本
        const result = await apiClient.transformText(text, selectedFilter.apiParameter);
        
        if (result.success && result.data) {
          // 转换成功，显示结果
          setText(result.data.transformedText);
          setState("transformed");
          setShowResultActions(true);
        } else {
          // 转换失败，显示错误并回到可转换态
          alert(`转换失败: ${result.error?.message || '未知错误'}`);
          setState("readyToTransform");
        }
      } catch (error: unknown) {
        // 网络错误等，显示错误并回到可转换态
        const err = error as { message?: string };
        alert(`网络错误: ${err.message || '未知错误'}`);
        setState("readyToTransform");
      }
    } else {
      setState("readyToTransform");
    }
  };

  // 处理底部滤镜图标的 snap 动画完成
  const handleSnapComplete = () => {
    // 动画完成逻辑
  };

  // 🔥 新增：结果操作处理函数
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert('文本已复制到剪贴板！');
    } catch {
      alert('复制失败，请手动复制文本');
    }
  };

  const handleTryOtherStyle = () => {
    setText(originalText); // 恢复原始文本
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
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <div className={cn(
        "relative transition-all duration-500",
        state === "transformed" ? "w-[1000px]" : "w-[500px]"
      )}>
        {/* 转换前：单栏布局 */}
        {state !== "transformed" && (
          <div className="relative" style={{ gap: '64px' }}>
            <div
              className={cn(
                "w-full h-[200px] bg-transparent flex items-center justify-center p-4 mb-16 relative",
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

              {/* 在文本框内显示 snap 效果 */}
              {droppedFilter && (
                <TextBoxSnapEffect
                  filter={droppedFilter}
                  onComplete={handleTextBoxSnapComplete}
                />
              )}

              {/* 光幕扫描效果 */}
              <LightSweepEffect
                isActive={isLightScanning}
                onComplete={handleLightSweepComplete}
              />
            </div>
          </div>
        )}

        {/* 转换后：双栏对比布局 */}
        {state === "transformed" && (
          <div className="flex gap-8 mb-16">
            {/* 原始文本区域 */}
            <div className="flex-1">
              <div className="mb-3 text-sm text-gray-500 font-medium text-center">
                原始文本
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

            {/* 转换箭头 */}
            <div className="flex items-center justify-center">
              <div className="text-3xl text-green-500 animate-pulse">
                →
              </div>
            </div>

            {/* 转换结果区域 */}
            <div className="flex-1">
              <div className="mb-3 text-sm text-green-600 font-medium text-center">
                转换结果 ({selectedFilter?.name})
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



        {/* 🔥 新增：结果操作按钮 */}
        {showResultActions && state === "transformed" && (
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={handleCopyText}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📋 复制文本
            </button>
            <button
              onClick={handleTryOtherStyle}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              🎨 尝试其他风格
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🔄 重新开始
            </button>
          </div>
        )}

        {/* 滤镜图标容器 */}
        <div style={{ marginTop: '40px', width: '100%', overflow: 'visible' }}>
          <FilterIconsContainer
            state={state}
            selectedFilter={selectedFilter}
            onFilterSelect={handleFilterSelect}
            onSnapComplete={handleSnapComplete}
          />
        </div>
      </div>
    </div>
  );
}