import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  cartoonBorder,
  cartoonRadius,
  cartoonShadow,
  cartoonTypography,
  cartoonVariantFill,
  cartoonVariantBorder,
} from '@/styles/cartoon-tokens';

const alertVariants = cva(
  cn(cartoonRadius.card, cartoonBorder.base, 'p-6', cartoonTypography.body),
  {
    variants: {
      variant: {
        default: cn(cartoonVariantFill.blue, cartoonVariantBorder.blue, 'text-white'),
        destructive: cn(cartoonVariantFill.pink, cartoonVariantBorder.pink, 'text-white'),
        success: cn(cartoonVariantFill.green, cartoonVariantBorder.green, 'text-white'),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn(cartoonTypography.subheading, 'mb-2', className)} {...props} />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(cartoonTypography.body, className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
