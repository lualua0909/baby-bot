import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  cartoonBorder,
  cartoonInputBase,
  cartoonRadius,
} from '@/styles/cartoon-tokens';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        cartoonInputBase,
        cartoonRadius.card,
        'min-h-[120px] py-4',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
