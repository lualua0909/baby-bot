'use client';

import { STORY_THEMES, type StoryTheme } from '@/types/ai';
import KidModal from '@/components/ui/KidModal';
import KidCardButton from '@/components/ui/KidCardButton';

interface StoryModeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (theme: StoryTheme) => void;
}

export default function StoryModeModal({ open, onClose, onSelect }: StoryModeModalProps) {
  return (
    <KidModal open={open} onClose={onClose} title="📖 Chọn câu chuyện">
      <div className="grid grid-cols-2 gap-3">
        {STORY_THEMES.map((theme) => (
          <KidCardButton
            key={theme.id}
            backgroundColor={`${theme.color}33`}
            onClick={() => {
              onSelect(theme.id);
              onClose();
            }}
          >
            <span className="text-4xl">{theme.emoji}</span>
            <span className="font-extrabold text-gray-700">{theme.label}</span>
          </KidCardButton>
        ))}
      </div>
    </KidModal>
  );
}
