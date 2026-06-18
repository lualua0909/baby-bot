import * as React from 'react';
import { cn } from '@/lib/utils';
import { cartoonInputBase } from '@/styles/cartoon-tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn(cartoonInputBase, className)} ref={ref} {...props} />
));
Input.displayName = 'Input';

export { Input };
