'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  cartoonChatBubbleAi,
  cartoonChatBubbleUser,
  cartoonMotion,
  cartoonTypography,
} from '@/styles/cartoon-tokens';

export interface CartoonChatBubbleProps {
  children: ReactNode;
  variant?: 'user' | 'ai';
  /** Direction the speech tail points toward the speaker. `none` hides it. */
  tail?: 'down' | 'down-left' | 'none';
  className?: string;
}

/** Solid fill + border for the little tail, matched per variant. */
const tailColor: Record<'user' | 'ai', { fill: string; border: string }> = {
  user: { fill: 'bg-sky-500', border: 'border-sky-600' },
  ai: { fill: 'bg-orange-400', border: 'border-orange-500' },
};

export function CartoonChatBubble({
  children,
  variant = 'ai',
  tail = 'none',
  className,
}: CartoonChatBubbleProps) {
  return (
    <motion.div
      initial={cartoonMotion.bubbleInitial}
      animate={cartoonMotion.bubbleAnimate}
      exit={{ opacity: 0, y: -8, scale: 0.75 }}
      transition={cartoonMotion.bubbleTransition}
      whileHover={cartoonMotion.buttonHover}
      className={cn(
        'relative max-w-[min(88vw,26rem)]',
        variant === 'user' ? cartoonChatBubbleUser : cartoonChatBubbleAi,
        className
      )}
    >
      <span className={cn(cartoonTypography.body, 'leading-snug')}>{children}</span>
      {tail === 'down' && (
        <span
          aria-hidden
          className={cn(
            'absolute left-1/2 bottom-0 h-5 w-5 -translate-x-1/2 translate-y-1/2 rotate-45 rounded-[6px] border-b-4 border-r-4',
            tailColor[variant].fill,
            tailColor[variant].border
          )}
        />
      )}
      {tail === 'down-left' && (
        <span
          aria-hidden
          className={cn(
            'absolute left-6 bottom-0 h-5 w-5 translate-y-1/2 rotate-45 rounded-[6px] border-b-4 border-l-4',
            tailColor[variant].fill,
            tailColor[variant].border
          )}
        />
      )}
    </motion.div>
  );
}
