'use client';

/** Playful floating clouds & stars — Talking Tom style ambience */
import { AppIcon } from '@/components/ui/AppIcon';

export default function FloatingDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <span className="absolute top-[12%] left-[8%] opacity-40 animate-float-slow">
        <AppIcon name="cloud" className="h-10 w-10 text-white/60" />
      </span>
      <span
        className="absolute top-[8%] right-[12%] opacity-30 animate-float"
        style={{ animationDelay: '1s' }}
      >
        <AppIcon name="cloud" className="h-8 w-8 text-white/60" />
      </span>
      <span
        className="absolute top-[25%] right-[5%] opacity-50 animate-float-slow"
        style={{ animationDelay: '2s' }}
      >
        <AppIcon name="sparkles" className="h-6 w-6 text-yellow-200/70" />
      </span>
      <span
        className="absolute top-[40%] left-[4%] opacity-40 animate-float"
        style={{ animationDelay: '0.5s' }}
      >
        <AppIcon name="star" className="h-5 w-5 text-yellow-200/70" />
      </span>
      <span
        className="absolute bottom-[28%] right-[8%] opacity-35 animate-float-slow"
        style={{ animationDelay: '1.5s' }}
      >
        <AppIcon name="rainbow" className="h-8 w-8 text-pink-200/60" />
      </span>
      <span
        className="absolute bottom-[35%] left-[10%] opacity-30 animate-float"
        style={{ animationDelay: '3s' }}
      >
        <AppIcon name="cloud" className="h-6 w-6 text-white/60" />
      </span>
    </div>
  );
}
