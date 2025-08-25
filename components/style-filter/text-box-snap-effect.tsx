/** 
 * Snap effect that occurs inside the text box when filter is dropped
 */

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion';
import { StyleFilter } from './types';

const DURATION_SECONDS = 0.6;
const MAX_DISPLACEMENT = 300;
const OPACITY_CHANGE_START = 0.5;
const transition = {
  duration: DURATION_SECONDS,
  ease: (time: number) => 1 - Math.pow(1 - time, 3),
};

interface TextBoxSnapEffectProps {
  filter: StyleFilter;
  onComplete: () => void;
}

export function TextBoxSnapEffect({ filter, onComplete }: TextBoxSnapEffectProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const dissolveTargetRef = useRef<HTMLDivElement>(null);
  const displacement = useMotionValue(0);
  const filterId = `text-box-dissolve-${filter.id}`;

  useMotionValueEvent(displacement, "change", (latest) => {
    displacementMapRef.current?.setAttribute('scale', latest.toString());
  });

  useEffect(() => {
    const triggerSnap = async () => {
      if (!scope.current || !dissolveTargetRef.current) return;
      
      try {
        await Promise.all([
          animate(
            dissolveTargetRef.current,
            { scale: 1.2, opacity: [1, 1, 0] },
            { ...transition, times: [0, OPACITY_CHANGE_START, 1] }
          ),
          animate(displacement, MAX_DISPLACEMENT, transition)
        ]);

        onComplete();
      } catch {
        onComplete();
      }
    };

    // 短暂延迟后开始动画，让用户能看到图标出现
    const timer = setTimeout(triggerSnap, 200);
    return () => clearTimeout(timer);
  }, [filter, animate, displacement, onComplete, scope]);

  return (
    <div 
      ref={scope}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
    >
      <motion.div
        ref={dissolveTargetRef}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ filter: `url(#${filterId})` }}
        className="flex flex-col items-center justify-center"
      >
        {/* 滤镜图标 */}
        <div className="relative w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Image
            src={filter.icon}
            alt={filter.name}
            width={48}
            height={48}
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <span className="mt-2 text-xs text-center text-white/80">{filter.name}</span>
      </motion.div>

      <svg width="0" height="0" className="absolute -z-1">
        <defs>
          <filter
            id={filterId}
            x="-300%"
            y="-300%"
            width="600%"
            height="600%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="1"
              result="bigNoise"
            />
            <feComponentTransfer
              in="bigNoise"
              result="bigNoiseAdjusted"
            >
              <feFuncR type="linear" slope="0.5" intercept="-0.2" />
              <feFuncG type="linear" slope="3" intercept="-0.6" />
            </feComponentTransfer>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1"
              numOctaves="2"
              result="fineNoise"
            />
            <feMerge result="combinedNoise">
              <feMergeNode in="bigNoiseAdjusted" />
              <feMergeNode in="fineNoise" />
            </feMerge>
            <feDisplacementMap
              ref={displacementMapRef}
              in="SourceGraphic"
              in2="combinedNoise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}