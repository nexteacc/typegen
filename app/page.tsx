"use client"

import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/use-translation";
import { DesktopLayout } from "@/components/layout/DesktopLayout";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useTransformerController } from "@/lib/use-transformer-controller";

export default function Home() {
  const { t } = useTranslation();
  const controller = useTransformerController(t);


  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-stretch justify-center">
        <div className="background-wrapper">
          <div className="relative flex h-full w-full flex-col">
            {/* 头部区域 - 语言切换 */}
            <header className="relative z-10 flex items-center justify-end px-4 py-3 sm:px-6 sm:py-4">
              {/* 语言切换按钮 */}
              <LanguageToggle className="shadow-lg" />
            </header>

            {/* 主内容区域（仅桌面端布局） */}
            <DesktopLayout controller={controller} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
