import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  cartoonBorder,
  cartoonRadius,
} from '@/styles/cartoon-tokens';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-8 w-8 shrink-0 bg-white',
      cartoonRadius.button,
      cartoonBorder.base,
      'border-purple-700',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-green-600 data-[state=checked]:text-white',
      'data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-lime-300 data-[state=checked]:to-green-500',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
