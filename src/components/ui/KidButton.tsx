'use client';

import { type ReactNode } from 'react';
import { CartoonButton } from '@/components/cartoon/CartoonButton';
import type { CartoonVariant } from '@/styles/cartoon-tokens';

interface KidButtonProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  /** @deprecated use `variant` */
  color?: string;
  variant?: CartoonVariant;
  size?: 'sm' | 'md' | 'lg';
  sizeClass?: string;
  disabled?: boolean;
  className?: string;
  pulsing?: boolean;
}

const COLOR_TO_VARIANT: Record<string, CartoonVariant> = {
  '#9bf05f': 'green',
  '#2ECC71': 'green',
  '#56C445': 'green',
  '#F39C12': 'yellow',
  '#FFB347': 'yellow',
  '#FF6B9D': 'pink',
  '#FF5EA8': 'pink',
  '#EF4444': 'pink',
  '#E74C3C': 'pink',
  '#3498DB': 'blue',
  '#4DA7FF': 'blue',
  '#9B59B6': 'purple',
  '#8B6DFF': 'purple',
};

function resolveVariant(color?: string, variant?: CartoonVariant): CartoonVariant {
  if (variant) return variant;
  if (color && COLOR_TO_VARIANT[color]) return COLOR_TO_VARIANT[color];
  return 'green';
}

export default function KidButton({
  children,
  color,
  variant,
  sizeClass,
  size = 'md',
  className,
  ...props
}: KidButtonProps) {
  return (
    <CartoonButton
      variant={resolveVariant(color, variant)}
      size={size}
      className={sizeClass ?? className}
      {...props}
    >
      {children}
    </CartoonButton>
  );
}
