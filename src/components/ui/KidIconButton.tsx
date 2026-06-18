'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface KidIconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  color?: string;
  href?: string;
  ariaLabel: string;
  className?: string;
}

/** Round cartoon icon button — chunky outline + gloss + 3D press. */
export default function KidIconButton({
  children,
  onClick,
  color = '#60A5FA',
  ariaLabel,
  className = '',
}: KidIconButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`cartoon-surface relative w-12 h-12 md:w-14 md:h-14 rounded-full
        flex items-center justify-center text-xl cursor-pointer ${className}`}
      style={
        {
          '--face': color,
          '--edge': shade(color, -55),
        } as React.CSSProperties
      }
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9, y: 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="cartoon-gloss" />
      <span className="relative z-10 leading-none drop-shadow-[0_2px_1px_rgba(0,0,0,0.25)]">
        {children}
      </span>
    </motion.button>
  );
}

function shade(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
