"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "./SiteFooter";

interface ScrollRevealFooterProps {
  /** 是否有文本输入 */
  hasText?: boolean;
}

/**
 * 粘性页脚包装器
 * - 状态一（无文本）：滚动到页面底部时从下方滑出
 * - 状态二（有文本）：静态固定在底部，无滑动效果
 */
export function ScrollRevealFooter({ hasText = false }: ScrollRevealFooterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 如果有文本，直接显示为静态 Footer
    if (hasText) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      // 计算滚动位置
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 当滚动到页面底部 20% 时开始显示 footer
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      setIsVisible(scrollPercentage > 0.7);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始检查

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasText]);

  return (
    <div 
      className={`sticky-footer-wrapper ${isVisible ? "visible" : ""} ${hasText ? "static-mode" : ""}`}
    >
      <SiteFooter />
    </div>
  );
}
