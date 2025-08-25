/**
 * 水平光幕扫描动画组件
 * 在文本框内从右到左扫描的光幕效果
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LightSweepEffectProps {
  isActive: boolean;
  onComplete: () => void;
}

export function LightSweepEffect({ isActive, onComplete }: LightSweepEffectProps) {
  useEffect(() => {
    if (isActive) {
      console.log('🌟 Light sweep animation started');
      
      // 0.8秒后动画完成
      const timer = setTimeout(() => {
        console.log('✅ Light sweep animation completed');
        onComplete();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* 光幕扫描效果 - 使用更明显的颜色和尺寸 */}
      <motion.div
        className="absolute top-0 h-full"
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ 
          duration: 0.8, 
          ease: 'easeInOut' 
        }}
        style={{
          width: '4px', // 增加宽度使其更明显
          background: 'linear-gradient(90deg, transparent, #00ffff 50%, transparent)', // 使用青色更明显
          boxShadow: '0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(0,255,255,0.4)',
          opacity: 1
        }}
      />
      
      {/* 扫描时的背景微光效果 */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ 
          duration: 0.8,
          ease: 'easeInOut'
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.1), transparent)',
        }}
      />
    </div>
  );
}