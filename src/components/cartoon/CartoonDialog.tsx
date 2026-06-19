'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AppIcon } from '@/components/ui/AppIcon';
import { CartoonIconButton } from '@/components/cartoon/CartoonIconButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  cartoonDialogPanel,
  cartoonMotion,
  cartoonSpacing,
  cartoonTypography,
} from '@/styles/cartoon-tokens';

export interface CartoonDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

export function CartoonDialog({ open, onClose, title, children, className }: CartoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className={className}>
        <motion.div
          initial={cartoonMotion.modalInitial}
          animate={cartoonMotion.modalAnimate}
          transition={cartoonMotion.modalTransition}
          className="relative"
        >
          <div className="absolute -right-1 -top-1 z-10 md:-right-2 md:-top-2">
            <CartoonIconButton variant="pink" ariaLabel="Đóng" onClick={onClose} size="md">
              <AppIcon name="close" className="h-5 w-5" />
            </CartoonIconButton>
          </div>
          <DialogHeader className={cn('mb-6 pr-16', cartoonSpacing.sectionGap)}>
            <DialogTitle className={cartoonTypography.subheading}>{title}</DialogTitle>
          </DialogHeader>
          <div className={cartoonDialogPanel}>{children}</div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
