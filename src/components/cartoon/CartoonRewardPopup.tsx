'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AppIcon, type IconName } from '@/components/ui/AppIcon';
import { CartoonButton } from '@/components/cartoon/CartoonButton';
import {
  cartoonDialogBase,
  cartoonMotion,
  cartoonSpacing,
  cartoonTypography,
  cartoonVariantBorder,
} from '@/styles/cartoon-tokens';

export interface CartoonRewardPopupProps {
  open: boolean;
  onClose: () => void;
  title: string;
  reward?: IconName;
  children?: ReactNode;
}

function Sparkle({ delay }: { delay: number }) {
  return (
    <motion.span
      className="absolute pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 0.8 }}
      style={{
        top: `${20 + delay * 40}%`,
        left: `${10 + delay * 20}%`,
      }}
    >
      <AppIcon name="sparkles" className="h-6 w-6 text-yellow-300" />
    </motion.span>
  );
}

export function CartoonRewardPopup({
  open,
  onClose,
  title,
  reward = 'gift',
  children,
}: CartoonRewardPopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={cartoonMotion.modalInitial}
            animate={cartoonMotion.modalAnimate}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={cartoonMotion.modalTransition}
            className={cn(
              cartoonDialogBase,
              cartoonVariantBorder.yellow,
              'relative w-full max-w-sm text-center'
            )}
          >
            {[0, 0.3, 0.6, 0.9].map((d) => (
              <Sparkle key={d} delay={d} />
            ))}
            <motion.div
              animate={cartoonMotion.coinFloat}
              transition={cartoonMotion.coinTransition}
              className="mb-6 flex justify-center"
            >
              <AppIcon name={reward} className="h-16 w-16 text-yellow-300" />
            </motion.div>
            <h2 className={cn(cartoonTypography.subheading, 'text-white mb-6')}>{title}</h2>
            {children}
            <div className={cn(cartoonSpacing.stack, 'mt-6')}>
              <CartoonButton variant="green" size="play" onClick={onClose}>
                OK!
              </CartoonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
