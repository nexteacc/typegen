"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

/**
 * 客户端元数据更新器
 * 用于在语言切换时动态更新页面的 title 和 description
 */
export default function ClientMetadataUpdater() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // 更新HTML的lang属性
    document.documentElement.lang = language;

    // 更新页面标题
    document.title = t('metaTitle');

    // 更新页面描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      (metaDescription as HTMLMetaElement).content = t('metaDescription');
    } else {
      // 如果不存在 description meta 标签，则创建一个
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = t('metaDescription');
      document.head.appendChild(newMetaDescription);
    }
  }, [language, t, isHydrated]);

  return null; // 这个组件不渲染任何 UI
}