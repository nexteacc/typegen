"use client"

import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/utils/cn';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-all duration-200",
        "bg-white/80 hover:bg-white/90 border border-gray-200 hover:border-gray-300",
        "text-gray-700 hover:text-gray-900 shadow-sm hover:shadow",
        "backdrop-blur-sm",
        className
      )}
      title={language === 'zh' ? t('switchToEnglish') : t('switchToChinese')}
    >
      <span className="text-xs">🌍</span>
      <span className="font-medium">
        {language === 'zh' ? 'EN' : '中'}
      </span>
    </button>
  );
}