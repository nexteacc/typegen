import { useEffect, useState } from 'react';

/**
 * 响应式媒体查询 Hook
 * @param query CSS 媒体查询表达式
 * @param initialValue 服务端渲染阶段的默认值
 */
export function useMediaQuery(query: string, initialValue = false) {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    const updateMatch = () => {
      setMatches(mediaQueryList.matches);
    };

    updateMatch();
    mediaQueryList.addEventListener('change', updateMatch);

    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}
