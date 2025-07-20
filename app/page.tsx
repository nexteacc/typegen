
"use client"

import { useState } from "react";
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

    // 如果有文本且状态为idle，设置一个定时器来切换到readyToTransform状态
    if (e.target.value.trim() && state === "idle") {
      setTimeout(() => {
        setState("readyToTransform");
      }, 3000); // 3秒后切换状态
    }

    // 如果文本为空，重置状态为idle
    if (!e.target.value.trim() && state !== "idle") {
      setState("idle");
    }
  };

  // 处理滤镜选择
  const handleFilterSelect = (filter: StyleFilter) => {
    // 不再设置selectedFilter，移除选中效果
    // setSelectedFilter(filter);

    // 仍然设置状态为 readyToTransform，以便显示提示文本
    if (text.trim()) {
      setState("readyToTransform");
    }
    // 这里可以添加更多逻辑，比如拖拽开始等
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full">
      <div className="relative w-[500px]" style={{ gap: '64px' }}>
        {/* 输入框容器 - 添加下边距 */}
        <div className={cn(
          "w-full h-[200px] bg-transparent flex items-center justify-center p-4 mb-16",
          "border-2 border-dashed border-gray-300 rounded-lg transition-all duration-300",
          state === "readyToTransform" && "border-solid border-blue-500 shadow-glow"
        )}>
          <Input
            placeholder="paste text here"
            className="w-full h-full border-none bg-transparent text-center center-placeholder-textarea"
            value={text}
            onChange={handleTextChange}
          />
        </div>


        {/* 滤镜图标容器 - 确保始终显示，使用内联样式设置上边距 */}
        <div style={{ marginTop: '40px', width: '100%', overflow: 'hidden' }}>
          <FilterIconsContainer
            state={state}
            // 不再传递selectedFilter
            onFilterSelect={handleFilterSelect}
          />
        </div>
      </div>
    </div>
  );
}
