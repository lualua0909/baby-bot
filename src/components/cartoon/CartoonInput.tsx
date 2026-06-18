'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { cartoonInputBase } from '@/styles/cartoon-tokens';

export interface CartoonInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const CartoonInput = forwardRef<HTMLInputElement, CartoonInputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(cartoonInputBase, className)} {...props} />
  )
);
CartoonInput.displayName = 'CartoonInput';
