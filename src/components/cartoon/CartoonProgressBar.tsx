'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  cartoonBorder,
  cartoonMotion,
  cartoonProgressFill,
  cartoonRadius,
  cartoonShadow,
  cartoonSpacing,
  cartoonTypography,
  cartoonVariantBorder,
  type CartoonVariant,
} from '@/styles/cartoon-tokens';

export interface CartoonProgressBarProps {
  value: number;
  max?: number;
  icon?: string;
  className?: string;
  variant?: CartoonVariant;
}

export function CartoonProgressBar({
  value,
  max = 100,
  icon = '❤️',
  className,
  variant = 'pink',
}: CartoonProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn(cartoonSpacing.row, className)}>
      <div
        className={cn(
          'flex h-14 w-16 shrink-0 items-center justify-center text-2xl',
          cartoonRadius.badge,
          cartoonBorder.base,
          cartoonVariantBorder[variant],
          'bg-white',
          cartoonShadow.floating
        )}
      >
        {icon}
      </div>
      <div
        className={cn(
          'relative h-14 flex-1 overflow-hidden',
          cartoonRadius.button,
          cartoonBorder.base,
          cartoonVariantBorder[variant],
          'bg-white'
        )}
      >
        <motion.div
          className={cn('h-full', cartoonRadius.button, cartoonProgressFill[variant])}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={cartoonMotion.modalTransition}
        />
      </div>
    </div>
  );
}
