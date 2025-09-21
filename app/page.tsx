"use client"

import Image from "next/image";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/lib/use-translation";
import { DesktopLayout } from "@/components/layout/DesktopLayout";
import { useTransformerController } from "@/lib/use-transformer-controller";

export default function Home() {
  const { t } = useTranslation();
  const controller = useTransformerController(t);


  return (
    <div className="relative flex w-full flex-1 flex-col">
      {/* 头部区域 - Logo 和语言切换 */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo-header-white.png"
            alt="TypeGen Logo"
            width={36}
            height={36}
            className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9"
            priority
          />
          <h1 className="text-base font-bold text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 via-cyan-400 to-blue-500 bg-clip-text sm:text-lg">
            TypeGen
          </h1>
        </div>

        {/* 语言切换按钮 */}
        <LanguageToggle className="shadow-lg" />
      </header>

      {/* 主内容区域（仅桌面端布局） */}
      <DesktopLayout controller={controller} />
    </div>
  );
}
