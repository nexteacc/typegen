"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "./SiteFooter";

/**
 * 粘性页脚包装器
 * Footer 固定在视口底部，滚动到页面底部时从下方滑出
 */
export function ScrollRevealFooter() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
  }, []);

  return (
    <div className={`sticky-footer-wrapper ${isVisible ? "visible" : ""}`}>
      <SiteFooter />
    </div>
  );
}
