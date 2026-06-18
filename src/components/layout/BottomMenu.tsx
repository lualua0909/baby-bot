'use client';

import type { AppMode } from '@/types/ai';
import KidButton from '@/components/ui/KidButton';
import { useAppStore } from '@/store/appStore';

interface MenuItem {
  mode: AppMode;
  emoji: string;
  label: string;
  color: string;
}

/** Lime-green buttons, like the reference. Active mode turns red & lifts. */
const LIME = '#A7D02C';
const RED = '#E8453C';

const MENU_ITEMS: MenuItem[] = [
  { mode: 'voice', emoji: '🎤', label: 'Trò chuyện', color: LIME },
  { mode: 'story', emoji: '📖', label: 'Kể chuyện', color: LIME },
  { mode: 'english', emoji: '🇬🇧', label: 'Tiếng Anh', color: LIME },
  { mode: 'singing', emoji: '🎵', label: 'Hát', color: LIME },
  { mode: 'game', emoji: '🎮', label: 'Trò chơi', color: LIME },
];

export default function BottomMenu() {
  const appMode = useAppStore((s) => s.appMode);
  const setAppMode = useAppStore((s) => s.setAppMode);

  return (
    <nav className="flex items-end justify-center gap-1.5 sm:gap-4 md:gap-6 px-1 pb-3 pt-2 md:pb-5">
      {MENU_ITEMS.map((item) => {
        const active = appMode === item.mode;
        return (
          <div key={item.mode} className="flex flex-col items-center gap-1">
            <KidButton
              active={active}
              color={active ? RED : item.color}
              sizeClass="w-[17vw] h-[17vw] max-w-[5.5rem] max-h-[5.5rem] text-3xl sm:text-4xl"
              onClick={() => setAppMode(active ? 'home' : item.mode)}
            >
              {item.emoji}
            </KidButton>
            <span className="cartoon-text-sm text-[11px] sm:text-sm text-center leading-tight max-w-[5.5rem]">
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
