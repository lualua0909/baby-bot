'use client';

import { type ReactNode } from 'react';
import { CartoonIconButton } from '@/components/cartoon/CartoonIconButton';
import type { CartoonVariant } from '@/styles/cartoon-tokens';

interface KidIconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** @deprecated use `variant` */
  color?: string;
  variant?: CartoonVariant;
  ariaLabel: string;
  className?: string;
}

const COLOR_TO_VARIANT: Record<string, CartoonVariant> = {
  '#3FA9F5': 'blue',
  '#60A5FA': 'blue',
  '#F0552B': 'pink',
  '#FF5EA8': 'pink',
};

function resolveVariant(color?: string, variant?: CartoonVariant): CartoonVariant {
  if (variant) return variant;
  if (color && COLOR_TO_VARIANT[color]) return COLOR_TO_VARIANT[color];
  return 'blue';
}

export default function KidIconButton({ children, color, variant, ...props }: KidIconButtonProps) {
  return (
    <CartoonIconButton variant={resolveVariant(color, variant)} {...props}>
      {children}
    </CartoonIconButton>
  );
}
