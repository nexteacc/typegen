"use client"

import { useState } from "react";
import React from "react";
import { StyleFilter, TransformerState, FilterIconsContainer } from "@/components/style-filter";
import { TextBoxSnapEffect } from "@/components/style-filter/text-box-snap-effect";
import { cn } from "@/utils/cn";



export default function Home() {
  // 状态管理
  const [text, setText] = useState<string>("");
  const [state, setState] = useState<TransformerState>("idle");
  const [selectedFilter, setSelectedFilter] = useState<StyleFilter | null>(null);
  const [droppedFilter, setDroppedFilter] = useState<StyleFilter | null>(null);
  const [isOver, setIsOver] = useState(false);

  // 监听 droppedFilter 状态变化
  React.useEffect(() => {
    console.log('🔄 droppedFilter state changed:', droppedFilter);
  }, [droppedFilter]);

  // 处理文本输入
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // 根据需求文档：用户完成文本输入并等待约3秒后进入"可转换态"
    if (e.target.value.trim() && state === "idle") {
      // 3秒后自动进入可转换态
      setTimeout(() => {
        if (text.trim()) {
          setState("readyToTransform");
        }
      }, 3000);
    }

    // 如果文本为空，重置状态为idle
    if (!e.target.value.trim() && state !== "idle") {
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
      console.log('🟠 Text container isOver = TRUE!');
    }
  };

  const handleDragLeave = () => {
    setIsOver(false);
    console.log('⚪ Text container isOver = false');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    const filterData = e.dataTransfer.getData('application/json');
    if (filterData) {
      const draggedFilter = JSON.parse(filterData) as StyleFilter;

      console.log('✅ Dropped on text zone, filter:', draggedFilter);
      setSelectedFilter(draggedFilter);

      if (text.trim()) {
        console.log('📝 Has text, setting state to transforming');
        setState("transforming");
      } else {
        console.log('⚠️ No text, but still triggering snap effect');
      }

      console.log('🎬 About to set droppedFilter:', draggedFilter);
      setDroppedFilter(draggedFilter);
    }
  };

  // 处理文本框内 snap 动画完成
  const handleTextBoxSnapComplete = () => {
    console.log('Text box snap animation completed');
    setDroppedFilter(null); // 清除显示的滤镜图标

    // 这里将来会触发下一阶段的动画（光幕扫描）
    // 暂时模拟转换过程
    setTimeout(() => {
      setState("transformed");
      // 这里可以添加实际的文本转换逻辑
    }, 1500);
  };

  // 处理底部滤镜图标的 snap 动画完成（保留用于测试按钮）
  const handleSnapComplete = (completedFilter: StyleFilter) => {
    console.log('Bottom filter snap animation completed for filter:', completedFilter.name);
  };

  const dropDisabled = state === "transforming" || state === "transformed";



  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <div className="relative w-[500px]" style={{ gap: '64px' }}>
        {/* 文本输入容器 - 符合需求文档规范 */}
        <div
          className={cn(
            "w-full h-[200px] bg-transparent flex items-center justify-center p-4 mb-16 relative",
            "border-2 border-dashed border-gray-300 transition-all duration-300",
            "container-rounded",
            isOver && "border-solid border-blue-500 shadow-glow",
            state === "readyToTransform" && "border-solid border-blue-500 shadow-glow",
            state === "transforming" && "border-solid border-yellow-500 shadow-glow",
            state === "transformed" && "border-solid border-green-500 shadow-glow"
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
            readOnly={state === "transforming" || state === "transformed"}
          />

          {/* 在文本框内显示 snap 效果 */}
          {droppedFilter && (
            <TextBoxSnapEffect
              filter={droppedFilter}
              onComplete={handleTextBoxSnapComplete}
            />
          )}
        </div>



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