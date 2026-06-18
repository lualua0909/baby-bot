'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  cartoonBackground,
  cartoonBorder,
  cartoonInk,
  cartoonMotion,
  cartoonRadius,
  cartoonShadow,
  cartoonSpacing,
  cartoonTypography,
} from '@/styles/cartoon-tokens';

export interface CartoonAvatarFrameProps {
  level: number;
  progress: number;
  label?: string;
  className?: string;
}

export function CartoonAvatarFrame({
  level,
  progress,
  label,
  className,
}: CartoonAvatarFrameProps) {
  return (
    <motion.div className={cn(cartoonSpacing.row, className)} whileHover={cartoonMotion.buttonHover}>
      <div
        className={cn(
          'relative flex h-16 w-16 items-center justify-center',
          cartoonRadius.avatar,
          cartoonBorder.base,
          cartoonBackground.card,
          cartoonShadow.floating
        )}
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
          <motion.circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#56C445"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress} 100`}
            initial={false}
            animate={{ strokeDasharray: `${progress} 100` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </svg>
        <span className={cn('relative z-10', cartoonTypography.subheading, 'text-green-600')}>
          {level}
        </span>
      </div>
      {label && (
        <span className={cn('hidden sm:block', cartoonTypography.body, cartoonInk)}>{label}</span>
      )}
    </motion.div>
  );
}
