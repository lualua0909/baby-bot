'use client';

import type { AppMode } from '@/types/ai';
import { CartoonButton } from '@/components/cartoon';
import { AppIcon, type IconName } from '@/components/ui/AppIcon';
import { useAppStore } from '@/store/appStore';
import { cartoonTypography, cartoonInk, cartoonNavGlassBar } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface MenuItem {
  mode: AppMode;
  icon: IconName;
  label: string;
}

const MENU_ITEMS: MenuItem[] = [
  { mode: 'voice', icon: 'mic', label: 'Trò chuyện' },
  { mode: 'story', icon: 'book', label: 'Kể chuyện' },
  { mode: 'english', icon: 'english', label: 'Tiếng Anh' },
  { mode: 'singing', icon: 'music', label: 'Hát' },
  { mode: 'game', icon: 'game', label: 'Trò chơi' },
];

export default function BottomMenu({ isListening = false }: { isListening?: boolean }) {
  const appMode = useAppStore((s) => s.appMode);
  const setAppMode = useAppStore((s) => s.setAppMode);

  return (
    <nav className="group pointer-events-auto flex justify-center px-4 pb-5 pt-3">
      <div
        className={cn(
          'flex items-end justify-center gap-2 rounded-[36px] px-3 py-3 sm:gap-4 sm:px-5',
          cartoonNavGlassBar
        )}
      >
        {MENU_ITEMS.map((item) => {
          const active = appMode === item.mode;
          const micActive = item.mode === 'voice' && isListening;
          return (
            <div key={item.mode} className="flex flex-col items-center gap-1.5">
              <CartoonButton
                glass
                variant={active ? 'pink' : 'green'}
                active={active}
                pulsing={micActive}
                className="w-[15vw] h-[15vw] max-w-[4.75rem] max-h-[4.75rem] !min-w-0 !min-h-0 text-3xl sm:text-4xl"
                onClick={() => setAppMode(active ? 'home' : item.mode)}
              >
                <AppIcon name={item.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
              </CartoonButton>
              <span
                className={cn(
                  cartoonTypography.caption,
                  'text-center text-sm leading-tight max-w-[4.75rem] transition-colors duration-300',
                  active ? 'text-pink-600/75 group-hover:text-pink-600' : cn(cartoonInk, 'opacity-70 group-hover:opacity-100')
                )}
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
