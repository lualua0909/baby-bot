import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  cn(
    'cartoon-rect-btn relative inline-flex items-center justify-center overflow-visible',
    'border-none rounded-[10px] w-auto cursor-pointer',
    'font-yatra font-bold uppercase whitespace-nowrap text-center',
    'outline-none transition-all duration-300 select-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  ),
  {
    variants: {
      variant: {
        white: 'bg-[#EAF4FE] text-[#3e3e3e]',
        red: 'bg-[#D91424] text-white',
        brown: 'bg-[#DDA273] text-[#3e3e3e]',
        yellow: 'bg-[#F2CE16] text-[#3e3e3e]',
        blue: 'bg-[#C3EDFA] text-[#3e3e3e]',
        black: 'bg-[#5D6063] text-white',
        green: 'bg-[#9bf05f] text-[#3e3e3e]',
        purple: 'bg-[#8B6DFF] text-white',
        default: 'bg-[#9bf05f] text-[#3e3e3e]',
        destructive: 'bg-[#D91424] text-white',
        secondary: 'bg-[#F2CE16] text-[#3e3e3e]',
        outline: 'bg-[#EAF4FE] text-[#3e3e3e]',
        ghost:
          'bg-transparent text-[#3e3e3e] shadow-none normal-case font-cartoon font-bold [&::before]:hidden hover:[&::before]:hidden active:transform-none',
        link: 'bg-transparent text-[#3e3e3e] shadow-none normal-case font-cartoon font-bold underline-offset-4 hover:underline [&::before]:hidden active:transform-none',
        cartoon: 'bg-[#9bf05f] text-[#3e3e3e]',
        card: 'bg-[#EAF4FE] text-[#3e3e3e] w-full flex-col normal-case',
      },
      size: {
        default: 'px-6 py-4 text-lg',
        sm: 'px-4 py-3 text-base',
        lg: 'px-8 py-5 text-xl',
        play: 'min-w-[13rem] px-6 py-4 text-2xl md:text-3xl',
        icon: 'p-4 text-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={asChild ? undefined : type}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
