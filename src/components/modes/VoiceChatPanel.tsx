'use client';

import { CartoonStack, CartoonVoiceButton } from '@/components/cartoon';

interface VoiceChatPanelProps {
  isListening: boolean;
  onToggleListening: () => void;
}

export default function VoiceChatPanel({ isListening, onToggleListening }: VoiceChatPanelProps) {
  return (
    <CartoonStack className="pointer-events-auto px-4 py-2">
      <CartoonVoiceButton isListening={isListening} onToggle={onToggleListening} />
    </CartoonStack>
  );
}
