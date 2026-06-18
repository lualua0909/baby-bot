import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  cartoonButtonBase,
  cartoonCardBase,
  cartoonVariant as getCartoonVariant,
  type CartoonVariant,
} from '@/styles/cartoon-tokens';

const buttonVariants = cva(cartoonButtonBase, {
  variants: {
    variant: {
      default: getCartoonVariant('green'),
      destructive: getCartoonVariant('pink'),
      outline: cn(cartoonCardBase, 'text-[#4a6a7d] border-purple-700'),
      secondary: getCartoonVariant('yellow'),
      ghost: 'border-transparent bg-transparent shadow-none text-[#4a6a7d] hover:scale-105',
      link: 'border-transparent shadow-none text-purple-700 underline-offset-4 hover:underline',
      cartoon: getCartoonVariant('green'),
      card: cn(cartoonCardBase, 'w-full flex-col'),
    },
    size: {
      default: 'h-14 px-8 py-4 text-xl',
      sm: 'min-w-16 min-h-16 text-xl px-8 py-4',
      lg: 'min-w-28 min-h-28 text-2xl',
      icon: 'w-16 h-16 text-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  active?: boolean;
  cartoonVariant?: CartoonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, active, cartoonVariant: cv, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          cv && getCartoonVariant(cv),
          active && 'translate-y-1'
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
