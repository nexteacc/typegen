"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SiteFooter() {
  const [currentScene, setCurrentScene] = useState<1 | 2>(1);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDelayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      // 鼠标悬浮后 0.5 秒开始第一次切换
      initialDelayRef.current = setTimeout(() => {
        setCurrentScene((prev) => (prev === 1 ? 2 : 1));
        
        // 第一次切换后，启动 1.5 秒的循环轮播
        timerRef.current = setInterval(() => {
          setCurrentScene((prev) => (prev === 1 ? 2 : 1));
        }, 1500);
      }, 500);
    } else {
      // 鼠标移出时，清除所有定时器并回到第一幕
      if (initialDelayRef.current) {
        clearTimeout(initialDelayRef.current);
        initialDelayRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCurrentScene(1);
    }

    return () => {
      if (initialDelayRef.current) {
        clearTimeout(initialDelayRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovered]);

  return (
    <footer
      className="relative z-0 w-full bg-white py-8 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 lg:px-12">
        <AnimatePresence mode="wait">
          {currentScene === 1 ? (
            <motion.div
              key="scene-1"
              initial={{ y: 0 }}
              exit={{ y: -150 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="w-full"
            >
              {/* Product Hunt Badge */}
              <div className="mb-4 flex justify-center">
                <a
                  href="https://www.producthunt.com/products/typegen/reviews?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-typegen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1111292&theme=light"
                    alt="TypeGen - Drag-and-drop AI that rewrites in 28 styles | Product Hunt"
                    style={{ width: '180px', height: '39px' }}
                    width="180"
                    height="39"
                  />
                </a>
              </div>

              {/* TYPE ★ GEN 品牌标识 - BBH Sans Bartle 字体 */}
              <div className="flex w-full items-center">
                <span className="bbh-sans-bartle flex-shrink-0 text-[56px] font-semibold tracking-[0.35em] text-gray-900">
                  TYPE
                </span>
                <div className="mx-16 flex flex-1 items-center">
                  <span className="footer-arrow" aria-hidden="true" />
                  <Image
                    src="/Star 1.svg"
                    alt="Star"
                    width={60}
                    height={60}
                    className="-ml-3 translate-y-[1px] flex-shrink-0 star-spin"
                    priority
                  />
                </div>
                <span className="bbh-sans-bartle flex-shrink-0 text-[56px] font-semibold tracking-[0.35em] text-gray-900">
                  GEN
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scene-2"
              initial={{ y: 150 }}
              animate={{ y: 0 }}
              exit={{ y: -150 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="w-full flex items-center justify-center"
              style={{ minHeight: '127px' }} // 保持和第一幕相同的高度
            >
              {/* Try Now CTA */}
              <div className="flex w-full items-center justify-center">
                <span className="bbh-sans-bartle text-[72px] font-bold tracking-[0.2em] text-gray-900">
                  TRY NOW
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </footer>
  );
}
