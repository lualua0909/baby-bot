import * as React from 'react';
import { cn } from '@/lib/utils';

interface SpeechBubbleProps {
  children: React.ReactNode;
  className?: string;
}

export function SpeechBubble({ children, className }: SpeechBubbleProps) {
  return (
    <div className={cn('speech-bubble max-w-[18rem] px-5 py-2.5 text-center', className)}>
      {children}
    </div>
  );
}

interface CartoonSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  faceColor: string;
  edgeColor?: string;
  active?: boolean;
}

export function CartoonSurface({
  faceColor,
  edgeColor,
  active,
  className,
  children,
  style,
  ...props
}: CartoonSurfaceProps) {
  return (
    <div
      className={cn('cartoon-surface', active && 'is-active', className)}
      style={
        {
          '--face': faceColor,
          '--edge': edgeColor ?? faceColor,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
