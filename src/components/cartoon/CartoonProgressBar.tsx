'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AppIcon, type IconName } from '@/components/ui/AppIcon';
import {
  cartoonBorder,
  cartoonMotion,
  cartoonProgressFill,
  cartoonRadius,
  cartoonShadow,
  cartoonSpacing,
  cartoonVariantBorder,
  type CartoonVariant,
} from '@/styles/cartoon-tokens';

export interface CartoonProgressBarProps {
  value: number;
  max?: number;
  icon?: IconName;
  className?: string;
  variant?: CartoonVariant;
}

export function CartoonProgressBar({
  value,
  max = 100,
  icon = 'heart',
  className,
  variant = 'pink',
}: CartoonProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn(cartoonSpacing.row, className)}>
      <div
        className={cn(
          'flex h-14 w-16 shrink-0 items-center justify-center',
          cartoonRadius.badge,
          cartoonBorder.base,
          cartoonVariantBorder[variant],
          'bg-white',
          cartoonShadow.floating
        )}
      >
        <AppIcon name={icon} className="h-7 w-7 text-pink-500" />
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
