import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';
import { cartoonTypography } from '@/styles/cartoon-tokens';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(cartoonTypography.label, 'text-[#4a6a7d]', className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
