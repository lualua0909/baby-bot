import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  cartoonBorder,
  cartoonRadius,
  cartoonTypography,
  cartoonVariant,
} from '@/styles/cartoon-tokens';

const badgeVariants = cva(
  cn(cartoonRadius.badge, cartoonBorder.base, 'px-4 py-2', cartoonTypography.caption),
  {
    variants: {
      variant: {
        default: cartoonVariant('green'),
        secondary: cartoonVariant('purple'),
        destructive: cartoonVariant('pink'),
        outline: cn('bg-white text-[#4a6a7d] border-orange-500'),
        success: cartoonVariant('green'),
        warning: cartoonVariant('yellow'),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
