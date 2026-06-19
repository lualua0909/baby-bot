'use client';

import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonSize, type ButtonVariant } from '@/components/ui/Button';
import { cartoonVariantFill, type CartoonVariant } from '@/styles/cartoon-tokens';

const VARIANT_MAP: Record<CartoonVariant, ButtonVariant> = {
  green: 'green',
  yellow: 'yellow',
  pink: 'red',
  blue: 'blue',
  purple: 'purple',
};

const SIZE_MAP: Record<'sm' | 'md' | 'lg' | 'play', ButtonSize> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
  play: 'play',
};

export interface CartoonButtonProps {
  variant?: CartoonVariant;
  size?: keyof typeof SIZE_MAP;
  active?: boolean;
  pulsing?: boolean;
  /** @deprecated Glass nav styling removed — uses standard cartoon button */
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
      pulsing = false,
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
              'absolute inset-0 animate-ping rounded-[10px] opacity-40',
              cartoonVariantFill[variant]
            )}
          />
        )}
        <Button
          ref={ref}
          variant={VARIANT_MAP[variant]}
          size={SIZE_MAP[size]}
          disabled={disabled}
          aria-label={ariaLabel}
          onClick={onClick}
          className={className}
        >
          <span className="relative z-10 leading-none">{children}</span>
        </Button>
      </div>
    );
  }
);
CartoonButton.displayName = 'CartoonButton';
