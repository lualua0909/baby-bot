'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TypingDots({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-1 py-1', className)}
      role="status"
      aria-label="Đang suy nghĩ"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-white/85"
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.55,
            delay: i * 0.12,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  );
}
