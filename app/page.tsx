"use client"

import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/use-translation";
import { DesktopLayout } from "@/components/layout/DesktopLayout";
import { ScrollRevealFooter } from "@/components/layout/ScrollRevealFooter";
import { useTransformerController } from "@/lib/use-transformer-controller";

export default function Home() {
  const { t } = useTranslation();
  const controller = useTransformerController(t);


  return (
    <>
      {/* 主内容区域 - 带背景图片 */}
      <div className={`main-content-wrapper ${!controller.text.trim() ? 'empty-state' : ''}`}>
        <div className="background-wrapper">
          <div className="relative flex h-full w-full flex-col">
            {/* 头部区域 - 语言切换 */}
            <header className="relative z-10 flex items-center justify-end px-4 py-2 sm:px-6 sm:py-3">
              {/* 语言切换按钮 */}
              <LanguageToggle className="shadow-lg" />
            </header>

            {/* 主内容区域（仅桌面端布局） */}
            <DesktopLayout controller={controller} />
          </div>
        </div>
      </div>

      {/* 固定在底部的页脚 - 滚动时从底部滑出 */}
      <ScrollRevealFooter hasText={!!controller.text.trim()} />
    </>
  );
}
