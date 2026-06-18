'use client';

import { STORY_THEMES, type StoryTheme } from '@/types/ai';
import { CartoonCard, CartoonDialog, CartoonGrid, CartoonStack } from '@/components/cartoon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface StoryModeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (theme: StoryTheme) => void;
}

export default function StoryModeModal({ open, onClose, onSelect }: StoryModeModalProps) {
  return (
    <CartoonDialog open={open} onClose={onClose} title="📖 Chọn câu chuyện">
      <CartoonGrid cols={2}>
        {STORY_THEMES.map((theme) => (
          <CartoonCard
            key={theme.id}
            interactive
            variant="yellow"
            onCardClick={() => {
              onSelect(theme.id);
              onClose();
            }}
          >
            <CartoonStack>
              <span className="text-5xl">{theme.emoji}</span>
              <span className={cn(cartoonTypography.body, 'text-white text-center')}>
                {theme.label}
              </span>
            </CartoonStack>
          </CartoonCard>
        ))}
      </CartoonGrid>
    </CartoonDialog>
  );
}
