'use client';

import { STORY_THEMES, type StoryTheme } from '@/types/ai';
import { CartoonCard, CartoonDialog, CartoonGrid, CartoonStack } from '@/components/cartoon';
import { AppIcon } from '@/components/ui/AppIcon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface StoryModeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (theme: StoryTheme) => void;
}

export default function StoryModeModal({ open, onClose, onSelect }: StoryModeModalProps) {
  return (
    <CartoonDialog
      open={open}
      onClose={onClose}
      title={
        <span className="inline-flex items-center gap-2">
          <AppIcon name="book" className="h-6 w-6" />
          Chọn câu chuyện
        </span>
      }
    >
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
              <AppIcon name={theme.icon} className="h-12 w-12 text-white" />
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
