'use client';

import { GAME_OPTIONS, type GameType } from '@/types/ai';
import { CartoonCard, CartoonDialog, CartoonRow, CartoonStack } from '@/components/cartoon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface GameModeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (game: GameType) => void;
}

export default function GameModeModal({ open, onClose, onSelect }: GameModeModalProps) {
  return (
    <CartoonDialog open={open} onClose={onClose} title="🎮 Chọn trò chơi">
      <CartoonStack align="stretch">
        {GAME_OPTIONS.map((game) => (
          <CartoonCard
            key={game.id}
            interactive
            variant="green"
            onCardClick={() => {
              onSelect(game.id);
              onClose();
            }}
          >
            <CartoonRow>
              <span className="text-4xl">{game.emoji}</span>
              <span className={cn(cartoonTypography.subheading, 'text-white')}>{game.label}</span>
            </CartoonRow>
          </CartoonCard>
        ))}
      </CartoonStack>
    </CartoonDialog>
  );
}
