'use client';

import { motion } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  cartoonButtonBase,
  cartoonButtonSizes,
  cartoonMotion,
  cartoonRadius,
  cartoonVariant,
  cartoonVariantFill,
  cartoonNavGlassButton,
  cartoonNavGlassVariant,
  type CartoonVariant,
} from '@/styles/cartoon-tokens';

export interface CartoonButtonProps {
  variant?: CartoonVariant;
  size?: keyof typeof cartoonButtonSizes;
  active?: boolean;
  pulsing?: boolean;
  glass?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

export const CartoonButton = forwardRef<HTMLButtonElement, CartoonButtonProps>(
  (
    {
      variant = 'green',
      size = 'md',
      active = false,
      pulsing = false,
      glass = false,
      className,
      children,
      disabled,
      onClick,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    return (
      <div className="relative inline-flex">
        {pulsing && !disabled && (
          <span
            className={cn(
              'absolute inset-0 animate-ping',
              glass ? 'opacity-15' : 'opacity-40',
              cartoonRadius.button,
              glass ? cartoonNavGlassButton[variant] : cartoonVariantFill[variant]
            )}
          />
        )}
        <motion.button
          ref={ref}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          onClick={onClick}
          whileHover={disabled ? undefined : cartoonMotion.buttonHover}
          whileTap={disabled ? undefined : cartoonMotion.buttonTap}
          transition={cartoonMotion.modalTransition}
          className={cn(
            cartoonButtonBase,
            glass ? cartoonNavGlassVariant(variant) : cartoonVariant(variant),
            glass && '!border-0 !shadow-none',
            cartoonButtonSizes[size],
            active && 'translate-y-1',
            className
          )}
        >
          <span className="relative z-10 leading-none">{children}</span>
        </motion.button>
      </div>
    );
  }
);
CartoonButton.displayName = 'CartoonButton';
