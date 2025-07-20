"use client"
import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * 自适应高度的输入框组件，类似 ChatGPT 输入体验。
 * 增加 max-h-full，确保不会超出父容器尺寸。
 */
const Input = React.forwardRef<HTMLTextAreaElement, InputProps>(({ className, onInput, ...props }, ref) => {
  // 处理 textarea 高度自适应
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
    onInput?.(e);
  };

  React.useEffect(() => {
    if (ref && typeof ref !== "function" && ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [ref]);

  // 检查是否有text-center类，如果有，添加特殊的placeholder样式
  const hasTextCenter = className?.includes("text-center");
  const placeholderStyle = hasTextCenter ? 
    "placeholder:text-center placeholder:w-full placeholder:absolute placeholder:inset-0 placeholder:flex placeholder:items-center placeholder:justify-center" : 
    "placeholder:text-muted-foreground";

  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[40px] max-h-full w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-0 focus:border-input disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
        placeholderStyle,
        className
      )}
      rows={1}
      onInput={handleInput}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };