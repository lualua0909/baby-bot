'use client';

import Link from 'next/link';
import { useAppStore } from '@/store/appStore';
import {
  CartoonAvatarFrame,
  CartoonIconButton,
  CartoonSection,
} from '@/components/cartoon';
import { cartoonSpacing } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

export default function TopBar() {
  const level = useAppStore((s) => s.level);
  const levelProgress = useAppStore((s) => s.levelProgress);
  const petName = useAppStore((s) => s.settings.petName);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);

  return (
    <header className={cn('relative z-20', cartoonSpacing.page)}>
      <CartoonSection>
        <div className="flex items-center justify-between gap-3">
          {/* Identity — pet level + name */}
          <CartoonAvatarFrame level={level} progress={levelProgress} label={petName} />

          <div className="flex items-center gap-3 sm:gap-4">
            <CartoonIconButton
              variant="blue"
              ariaLabel="Cài đặt trẻ em"
              onClick={() => setSettingsOpen(true)}
            >
              🎨
            </CartoonIconButton>
            <Link href="/settings" className="inline-flex">
              <CartoonIconButton variant="pink" ariaLabel="Admin settings">
                ⚙️
              </CartoonIconButton>
            </Link>
          </div>
        </div>
      </CartoonSection>
    </header>
  );
}
