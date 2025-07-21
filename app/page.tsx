
"use client"

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from "@dnd-kit/core";
import { Input } from "@/components/ui/input";
import { FilterIconsContainer, StyleFilter, TransformerState } from "@/components/style-filter";
import { cn } from "@/utils/cn";

export default function Home() {
  // 状态管理
  const [text, setText] = useState<string>("");
  const [state, setState] = useState<TransformerState>("idle");
  const [selectedFilter, setSelectedFilter] = useState<StyleFilter | null>(null);

  // 处理文本输入
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    // 如果有文本且状态为idle，立即切换到readyToTransform状态
    if (e.target.value.trim() && state === "idle") {
      setState("readyToTransform");
    }

    // 如果文本为空，重置状态为idle
    if (!e.target.value.trim() && state !== "idle") {
      setState("idle");
    }
  };

  // 处理滤镜选择
  const handleFilterSelect = (filter: StyleFilter) => {
    // 仍然设置状态为 readyToTransform，以便显示提示文本
    if (text.trim()) {
      setState("readyToTransform");
    }
  };
  
  // 使用dnd-kit的拖放事件处理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // 检查是否拖放到了文本输入区域
    if (over && over.id === 'text-drop-zone' && text.trim()) {
      const filter = active.data.current?.filter as StyleFilter;
      if (filter) {
        setSelectedFilter(filter);
        setState("transforming");
        
        // 模拟转换过程
        setTimeout(() => {
          setState("transformed");
          // 这里可以添加实际的文本转换逻辑
        }, 1500);
      }
    }
  };

  // 使用useDroppable钩子使文本输入区域可放置
  const { setNodeRef, isOver } = useDroppable({
    id: 'text-drop-zone',
    disabled: !text.trim() || state === "transforming" || state === "transformed",
  });

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center justify-center min-h-full w-full">
        <div className="relative w-[500px]" style={{ gap: '64px' }}>
          {/* 输入框容器 - 使用useDroppable */}
          <div 
            ref={setNodeRef}
            className={cn(
              "w-full h-[200px] bg-transparent flex items-center justify-center p-4 mb-16",
              "border-2 border-dashed border-gray-300 transition-all duration-300",
              "container-rounded",
              isOver && "border-solid border-blue-500 shadow-glow",
              state === "readyToTransform" && "border-solid border-blue-500 shadow-glow",
              state === "transforming" && "border-solid border-yellow-500 shadow-glow",
              state === "transformed" && "border-solid border-green-500 shadow-glow"
            )}
            style={{ borderRadius: '20px' }}
          >
            <Input
              placeholder="paste text here"
              className="w-full h-full border-none bg-transparent text-center center-placeholder-textarea input-rounded"
              style={{ borderRadius: '16px' }}
              value={text}
              onChange={handleTextChange}
              readOnly={state === "transforming" || state === "transformed"}
            />
          </div>

          {/* 滤镜图标容器 */}
          <div style={{ marginTop: '40px', width: '100%', overflow: 'visible' }}>
            <FilterIconsContainer
              state={state}
              selectedFilter={selectedFilter}
              onFilterSelect={handleFilterSelect}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
