'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cartoonBackground, cartoonSpacing } from '@/styles/cartoon-tokens';

interface CartoonPageProps {
  children: ReactNode;
  className?: string;
}

export function CartoonPage({ children, className }: CartoonPageProps) {
  return (
    <div className={cn('min-h-screen', cartoonBackground.page, cartoonSpacing.page, className)}>
      {children}
    </div>
  );
}

interface CartoonSectionProps {
  children: ReactNode;
  className?: string;
}

export function CartoonSection({ children, className }: CartoonSectionProps) {
  return <section className={cn(cartoonSpacing.stack, className)}>{children}</section>;
}

interface CartoonStackProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function CartoonStack({ children, className, align = 'center' }: CartoonStackProps) {
  return (
    <div
      className={cn(
        cartoonSpacing.stack,
        align === 'center' && 'items-center',
        align === 'start' && 'items-start',
        align === 'end' && 'items-end',
        align === 'stretch' && 'items-stretch w-full',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CartoonGridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2;
}

export function CartoonGrid({ children, className, cols = 2 }: CartoonGridProps) {
  return (
    <div className={cn(cols === 2 ? cartoonSpacing.grid2 : cartoonSpacing.grid, className)}>
      {children}
    </div>
  );
}

interface CartoonRowProps {
  children: ReactNode;
  className?: string;
}

export function CartoonRow({ children, className }: CartoonRowProps) {
  return <div className={cn(cartoonSpacing.row, className)}>{children}</div>;
}
