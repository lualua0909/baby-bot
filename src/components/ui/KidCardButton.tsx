'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface KidCardButtonProps {
  children: ReactNode;
  onClick?: () => void;
  backgroundColor?: string;
  className?: string;
}

/** Large tappable card for story/game picks — bounce on hover & press */
export default function KidCardButton({
  children,
  onClick,
  backgroundColor = '#F3F4F6',
  className = '',
}: KidCardButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`
        w-full flex flex-col items-center gap-2 p-4 rounded-2xl
        border-4 border-white shadow-kid-btn cursor-pointer
        ${className}
      `}
      style={{ backgroundColor }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95, y: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}
