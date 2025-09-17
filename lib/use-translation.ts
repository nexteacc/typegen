import { useLanguage } from './language-context';
import { getTranslation, TranslationKey } from './translations';

// useTranslation Hook
export function useTranslation() {
  const { language } = useLanguage();

  // 翻译函数
  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };

  return { t, language };
}