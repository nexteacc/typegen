"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 支持的语言类型
export type Language = 'zh' | 'en';

// 语言上下文接口
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

// 创建语言上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 语言提供者组件
interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('zh');

  // 从localStorage加载用户语言偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('typegen-language');
      if (saved === 'zh' || saved === 'en') {
        setLanguageState(saved);
      } else {
        // 根据浏览器语言设置默认语言
        const browserLang = navigator.language.toLowerCase();
        const defaultLang = browserLang.startsWith('zh') ? 'zh' : 'en';
        setLanguageState(defaultLang);
      }
    }
  }, []);

  // 设置语言并保存到localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('typegen-language', lang);
    }
  };

  // 切换语言
  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// useLanguage Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}