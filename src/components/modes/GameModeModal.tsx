'use client';

import { GAME_OPTIONS, type GameType } from '@/types/ai';
import { CartoonCard, CartoonDialog, CartoonRow, CartoonStack } from '@/components/cartoon';
import { AppIcon } from '@/components/ui/AppIcon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface GameModeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (game: GameType) => void;
}

export default function GameModeModal({ open, onClose, onSelect }: GameModeModalProps) {
  return (
    <CartoonDialog
      open={open}
      onClose={onClose}
      title={
        <span className="inline-flex items-center gap-2">
          <AppIcon name="game" className="h-6 w-6" />
          Chọn trò chơi
        </span>
      }
    >
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
              <AppIcon name={game.icon} className="h-9 w-9 text-white" />
              <span className={cn(cartoonTypography.subheading, 'text-white')}>{game.label}</span>
            </CartoonRow>
          </CartoonCard>
        ))}
      </CartoonStack>
    </CartoonDialog>
  );
}
