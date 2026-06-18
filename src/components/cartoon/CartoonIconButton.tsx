'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  cartoonIconButtonBase,
  cartoonIconButtonSizes,
  cartoonMotion,
  cartoonTypography,
  cartoonVariant,
  type CartoonVariant,
} from '@/styles/cartoon-tokens';

export interface CartoonIconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: CartoonVariant;
  ariaLabel: string;
  className?: string;
  size?: keyof typeof cartoonIconButtonSizes;
}

export function CartoonIconButton({
  children,
  onClick,
  variant = 'blue',
  ariaLabel,
  className,
  size = 'md',
}: CartoonIconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      whileHover={cartoonMotion.buttonHover}
      whileTap={cartoonMotion.buttonTap}
      transition={cartoonMotion.modalTransition}
      className={cn(
        cartoonIconButtonBase,
        cartoonIconButtonSizes[size],
        cartoonTypography.button,
        cartoonVariant(variant),
        className
      )}
    >
      <span className="relative z-10 leading-none">{children}</span>
    </motion.button>
  );
}
