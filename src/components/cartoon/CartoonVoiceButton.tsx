'use client';

import { CartoonButton } from '@/components/cartoon/CartoonButton';
import { AppIcon } from '@/components/ui/AppIcon';

export interface CartoonVoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
}

export function CartoonVoiceButton({ isListening, onToggle }: CartoonVoiceButtonProps) {
  return (
    <CartoonButton
      variant={isListening ? 'pink' : 'green'}
      size="lg"
      active={isListening}
      pulsing={isListening}
      onClick={onToggle}
      aria-label={isListening ? 'Dừng nghe' : 'Bắt đầu nói'}
    >
      <AppIcon name={isListening ? 'stop' : 'mic'} className="h-7 w-7" />
    </CartoonButton>
  );
}
