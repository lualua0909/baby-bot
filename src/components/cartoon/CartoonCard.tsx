'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  cartoonCardVariants,
  cartoonMotion,
  cartoonSpacing,
  type CartoonVariant,
} from '@/styles/cartoon-tokens';

export interface CartoonCardProps {
  children: ReactNode;
  variant?: CartoonVariant | 'white';
  interactive?: boolean;
  onCardClick?: () => void;
  className?: string;
}

export function CartoonCard({
  children,
  variant = 'white',
  interactive = false,
  onCardClick,
  className,
}: CartoonCardProps) {
  const baseClass = cn(
    cartoonCardVariants[variant],
    interactive && 'cursor-pointer select-none',
    className
  );

  if (interactive) {
    return (
      <motion.div
        role="button"
        tabIndex={0}
        whileHover={cartoonMotion.cardHover}
        whileTap={cartoonMotion.cardTap}
        transition={cartoonMotion.modalTransition}
        className={baseClass}
        onClick={onCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCardClick?.();
          }
        }}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClass}>{children}</div>;
}

/** @deprecated use `variant` */
export type CartoonCardGradient = CartoonVariant | 'white';
