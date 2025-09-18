"use client"

import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Globe2 } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const tooltip = language === 'zh' ? t('switchToEnglish') : t('switchToChinese');
  const nextLanguageLabel = language === 'zh' ? 'EN' : '中';

  return (
    <TooltipProvider delayDuration={120} skipDelayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            aria-label={tooltip}
            className={cn(
              'gap-2 rounded-full border-slate-200/70 bg-white/80 px-4 py-2 text-slate-600 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur-md',
              className
            )}
          >
            <Globe2 className="h-4 w-4 text-slate-500" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              {nextLanguageLabel}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8} className="rounded-full bg-slate-900/95 px-3 py-1 text-xs text-slate-50 shadow-lg">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
