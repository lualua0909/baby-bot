'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import {
  CartoonButton,
  CartoonGrid,
  CartoonStack,
} from '@/components/cartoon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface NumberQuizGameProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
  onComplete: () => void;
}

export default function NumberQuizGame({ speakText, onComplete }: NumberQuizGameProps) {
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const addCoins = useAppStore((s) => s.addCoins);

  const [a] = useState(() => Math.floor(Math.random() * 5) + 1);
  const [b] = useState(() => Math.floor(Math.random() * 5) + 1);
  const answer = a + b;
  const [answered, setAnswered] = useState(false);

  const options = [answer, answer + 1, answer - 1, answer + 2]
    .filter((n) => n > 0 && n <= 10)
    .slice(0, 4)
    .sort(() => Math.random() - 0.5);

  const uniqueOptions = [...new Set(options)];
  while (uniqueOptions.length < 4) {
    const extra = Math.floor(Math.random() * 10) + 1;
    if (!uniqueOptions.includes(extra)) uniqueOptions.push(extra);
  }

  const handleGuess = useCallback(
    async (num: number) => {
      if (answered) return;
      setAnswered(true);
      const correct = num === answer;
      setAnimation(correct ? 'Yes' : 'No');
      setAIState(correct ? 'HAPPY' : 'SAD');
      if (correct) addCoins(10);

      await speakText(
        correct ? `Giỏi quá! ${a} + ${b} = ${answer}!` : `Chưa đúng! ${a} + ${b} = ${answer}!`
      );
      setTimeout(onComplete, 2000);
    },
    [answered, answer, a, b, setAnimation, setAIState, addCoins, speakText, onComplete]
  );

  return (
    <CartoonStack>
      <span className={cn(cartoonTypography.heading, 'text-white')}>
        {a} + {b} = ?
      </span>
      <CartoonGrid cols={2}>
        {uniqueOptions.slice(0, 4).map((n) => (
          <CartoonButton
            key={n}
            variant="purple"
            size="md"
            onClick={() => handleGuess(n)}
            disabled={answered}
          >
            {n}
          </CartoonButton>
        ))}
      </CartoonGrid>
    </CartoonStack>
  );
}
