/** 
 * Modified ThanosSnapEffect for programmatic triggering
 * Based on the original snap-effect.tsx
 */

import { useRef, type PropsWithChildren, useImperativeHandle, forwardRef, useId } from 'react';
import {
  motion as m,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion';

const DURATION_SECONDS = 0.6;
const MAX_DISPLACEMENT = 300;
const OPACITY_CHANGE_START = 0.5;
const transition = {
  duration: DURATION_SECONDS,
  ease: (time: number) => 1 - Math.pow(1 - time, 3),
};

export interface SnapEffectRef {
  triggerSnap: () => Promise<void>;
  isAnimating: boolean;
}

interface SnapEffectProps extends PropsWithChildren {
  onSnapComplete?: () => void;
  className?: string;
}

export const FilterSnapEffect = forwardRef<SnapEffectRef, SnapEffectProps>(
  ({ children, onSnapComplete, className }, ref) => {
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
    const dissolveTargetRef = useRef<HTMLDivElement>(null);
    const displacement = useMotionValue(0);
    const isAnimatingRef = useRef(false);
    
    // 使用 React 18 的 useId 生成稳定的唯一 ID，避免 hydration 问题
    const uniqueId = useId();
    const filterId = `dissolve-filter-${uniqueId.replace(/:/g, '-')}`;

    useMotionValueEvent(displacement, "change", (latest) => {
      displacementMapRef.current?.setAttribute('scale', latest.toString());
    });

    const triggerSnap = async (): Promise<void> => {
      console.log('🎬 Snap effect triggerSnap called');
      
      if (isAnimatingRef.current || !scope.current || !dissolveTargetRef.current) {
        console.log('❌ Snap effect blocked:', {
          isAnimating: isAnimatingRef.current,
          hasScope: !!scope.current,
          hasTarget: !!dissolveTargetRef.current
        });
        return;
      }
      
      console.log('✅ Starting snap animation');
      isAnimatingRef.current = true;
      scope.current.dataset.isAnimating = 'true';

      try {
        await Promise.all([
          animate(
            dissolveTargetRef.current,
            { scale: 1.2, opacity: [1, 1, 0] },
            { ...transition, times: [0, OPACITY_CHANGE_START, 1] }
          ),
          animate(displacement, MAX_DISPLACEMENT, transition)
        ]);

        // Call completion callback
        onSnapComplete?.();

        // Reset after a short delay
        setTimeout(() => {
          if (dissolveTargetRef.current && scope.current) {
            animate(dissolveTargetRef.current, { scale: 1, opacity: 1 }, { duration: 0 });
            displacement.set(0);
            scope.current.dataset.isAnimating = 'false';
            isAnimatingRef.current = false;
          }
        }, 500);
      } catch (error) {
        console.error('Snap animation error:', error);
        isAnimatingRef.current = false;
        if (scope.current) {
          scope.current.dataset.isAnimating = 'false';
        }
      }
    };

    useImperativeHandle(ref, () => ({
      triggerSnap,
      isAnimating: isAnimatingRef.current
    }));

    return (
      <div ref={scope} className={className}>
        <m.div
          ref={dissolveTargetRef}
          style={{ filter: `url(#${filterId})` }}
        >
          {children}
        </m.div>

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
);

FilterSnapEffect.displayName = 'FilterSnapEffect';