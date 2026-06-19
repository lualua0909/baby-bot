'use client';

import type { AppMode } from '@/types/ai';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { AppIcon, type IconName } from '@/components/ui/AppIcon';
import { useAppStore } from '@/store/appStore';

interface MenuItem {
  mode: AppMode;
  icon: IconName;
  label: string;
  variant: ButtonVariant;
}

const MENU_ITEMS: MenuItem[] = [
  { mode: 'voice', icon: 'mic', label: 'Trò chuyện', variant: 'red' },
  { mode: 'story', icon: 'book', label: 'Kể chuyện', variant: 'yellow' },
  { mode: 'english', icon: 'english', label: 'Tiếng Anh', variant: 'blue' },
  { mode: 'singing', icon: 'music', label: 'Hát', variant: 'brown' },
  { mode: 'game', icon: 'game', label: 'Trò chơi', variant: 'black' },
];

export default function BottomMenu({ isListening = false }: { isListening?: boolean }) {
  const appMode = useAppStore((s) => s.appMode);
  const setAppMode = useAppStore((s) => s.setAppMode);

  return (
    <nav className="pointer-events-auto flex justify-center px-4 pb-5 pt-3">
      <div className="flex items-center justify-center gap-1 px-3 py-3 sm:gap-3 sm:px-5">
        {MENU_ITEMS.map((item) => {
          const active = appMode === item.mode;
          const micActive = item.mode === 'voice' && isListening;
          return (
            <div key={item.mode} className="group relative shrink-0 pb-2 pr-2">
              {micActive && (
                <span className="absolute inset-0 bottom-2 right-2 animate-ping rounded-[10px] bg-[#D91424] opacity-40" />
              )}
              <Button
                variant={active ? 'red' : item.variant}
                size="icon"
                aria-label={item.label}
                className="size-[4.25rem] shrink-0 p-0 sm:size-[4.75rem]"
                onClick={() => setAppMode(active ? 'home' : item.mode)}
              >
                <span className="relative z-10 leading-none">
                  <AppIcon name={item.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
                </span>
              </Button>
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-[#3e3e3e] px-3 py-1.5 text-sm font-bold text-white opacity-0 shadow-[2px_2px_0_#1a1a1a,4px_4px_0_#1a1a1a] transition-opacity duration-200 group-hover:opacity-100"
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
