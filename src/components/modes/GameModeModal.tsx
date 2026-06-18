'use client';

import { GAME_OPTIONS, type GameType } from '@/types/ai';
import KidModal from '@/components/ui/KidModal';
import KidCardButton from '@/components/ui/KidCardButton';

interface GameModeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (game: GameType) => void;
}

export default function GameModeModal({ open, onClose, onSelect }: GameModeModalProps) {
  return (
    <KidModal open={open} onClose={onClose} title="🎮 Chọn trò chơi">
      <div className="flex flex-col gap-3">
        {GAME_OPTIONS.map((game) => (
          <KidCardButton
            key={game.id}
            backgroundColor="#ECFDF5"
            className="!flex-row !items-center !gap-4 !p-4"
            onClick={() => {
              onSelect(game.id);
              onClose();
            }}
          >
            <span className="text-3xl">{game.emoji}</span>
            <span className="font-extrabold text-green-700 text-lg">{game.label}</span>
          </KidCardButton>
        ))}
      </div>
    </KidModal>
  );
}
