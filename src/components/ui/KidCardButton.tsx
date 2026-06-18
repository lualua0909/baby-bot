'use client';

import { type ReactNode } from 'react';
import { CartoonCard } from '@/components/cartoon/CartoonCard';
import type { CartoonVariant } from '@/styles/cartoon-tokens';

interface KidCardButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** @deprecated use `variant` */
  backgroundColor?: string;
  variant?: CartoonVariant | 'white';
  className?: string;
}

export default function KidCardButton({
  children,
  onClick,
  variant = 'white',
  className,
}: KidCardButtonProps) {
  return (
    <CartoonCard interactive onCardClick={onClick} variant={variant} className={className}>
      {children}
    </CartoonCard>
  );
}
