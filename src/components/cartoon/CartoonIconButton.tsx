'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import type { CartoonVariant } from '@/styles/cartoon-tokens';

const VARIANT_MAP: Record<CartoonVariant, ButtonVariant> = {
  green: 'green',
  yellow: 'yellow',
  pink: 'red',
  blue: 'blue',
  purple: 'purple',
};

export interface CartoonIconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: CartoonVariant;
  ariaLabel: string;
  className?: string;
  size?: 'md' | 'lg';
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
    <Button
      type="button"
      variant={VARIANT_MAP[variant]}
      size="icon"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'p-0 shrink-0',
        size === 'md' && 'h-16 w-16 text-2xl',
        size === 'lg' && 'h-20 w-20 text-3xl',
        className
      )}
    >
      <span className="relative z-10 leading-none">{children}</span>
    </Button>
  );
}
