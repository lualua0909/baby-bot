'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface KidButtonProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Override the size classes entirely (e.g. responsive vw sizing) */
  sizeClass?: string;
  disabled?: boolean;
  className?: string;
  /** Pulse ring when active (e.g. mic recording) */
  pulsing?: boolean;
}

const SIZE_CLASSES = {
  sm: 'w-16 h-16 text-2xl',
  md: 'w-[4.5rem] h-[4.5rem] text-3xl md:w-24 md:h-24 md:text-4xl',
  lg: 'w-24 h-24 text-4xl md:w-28 md:h-28 md:text-5xl',
};

export default function KidButton({
  children,
  onClick,
  active = false,
  color = '#4ECDC4',
  size = 'md',
  sizeClass,
  disabled = false,
  className = '',
  pulsing = false,
}: KidButtonProps) {
  const dims = sizeClass ?? SIZE_CLASSES[size];

  return (
    <div className="relative inline-flex">
      {pulsing && (
        <>
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ backgroundColor: color }}
          />
          <span
            className="absolute -inset-1 rounded-full border-4 opacity-60 animate-pulse"
            style={{ borderColor: color }}
          />
        </>
      )}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.08, y: -2 }}
        whileTap={disabled ? {} : { scale: 0.94, y: 3 }}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`
          cartoon-surface ${active ? 'is-active' : ''}
          relative
          ${dims}
          rounded-full flex items-center justify-center
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        style={
          {
            '--face': color,
            '--edge': shade(color, -55),
          } as React.CSSProperties
        }
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <span className="cartoon-gloss" />
        <span className="relative z-10 leading-none drop-shadow-[0_2px_1px_rgba(0,0,0,0.25)]">
          {children}
        </span>
      </motion.button>
    </div>
  );
}

function shade(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
