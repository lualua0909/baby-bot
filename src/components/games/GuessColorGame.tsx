'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import {
  CartoonButton,
  CartoonCard,
  CartoonGrid,
  CartoonStack,
} from '@/components/cartoon';
import type { CartoonVariant } from '@/styles/cartoon-tokens';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';
import { AppIcon } from '@/components/ui/AppIcon';

const COLORS: { name: string; vi: string; variant: CartoonVariant }[] = [
  { name: 'red', vi: 'đỏ', variant: 'pink' },
  { name: 'blue', vi: 'xanh dương', variant: 'blue' },
  { name: 'yellow', vi: 'vàng', variant: 'yellow' },
  { name: 'green', vi: 'xanh lá', variant: 'green' },
];

interface GuessColorGameProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
  onComplete: () => void;
}

export default function GuessColorGame({ speakText, onComplete }: GuessColorGameProps) {
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const addCoins = useAppStore((s) => s.addCoins);

  const [target] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
  const [answered, setAnswered] = useState(false);

  const handleGuess = useCallback(
    async (color: (typeof COLORS)[0]) => {
      if (answered) return;
      setAnswered(true);
      const correct = color.name === target.name;
      setAnimation(correct ? 'Yes' : 'No');
      setAIState(correct ? 'HAPPY' : 'SAD');
      if (correct) addCoins(10);

      await speakText(
        correct ? `Đúng! Màu ${target.vi}!` : `Sai rồi! Đáp án là màu ${target.vi}!`
      );
      setTimeout(onComplete, 2000);
    },
    [answered, target, setAnimation, setAIState, addCoins, speakText, onComplete]
  );

  return (
    <CartoonStack>
      <CartoonCard variant={target.variant} className="!p-6 w-32 h-32 flex items-center justify-center">
        <AppIcon name="palette" className="h-10 w-10 text-white" />
      </CartoonCard>
      <CartoonGrid cols={2}>
        {COLORS.map((c) => (
          <CartoonButton
            key={c.name}
            variant={c.variant}
            size="md"
            onClick={() => handleGuess(c)}
            disabled={answered}
          >
            <span className={cn(cartoonTypography.caption, 'text-white')}>{c.vi}</span>
          </CartoonButton>
        ))}
      </CartoonGrid>
    </CartoonStack>
  );
}
