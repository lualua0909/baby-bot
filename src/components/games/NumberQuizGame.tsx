'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { buildGameHostPrompt } from '@/lib/ai/prompts';
import KidButton from '@/components/ui/KidButton';

interface NumberQuizGameProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
  onComplete: () => void;
}

export default function NumberQuizGame({ speakText, onComplete }: NumberQuizGameProps) {
  const petName = useAppStore((s) => s.settings.petName);
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

      const prompt = buildGameHostPrompt(petName, 'Number Quiz');
      await speakText(
        correct ? `Giỏi quá! ${a} + ${b} = ${answer}!` : `Chưa đúng! ${a} + ${b} = ${answer}!`,
        prompt
      );
      setTimeout(onComplete, 2000);
    },
    [answered, answer, a, b, petName, setAnimation, setAIState, addCoins, speakText, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-extrabold text-green-700 text-2xl">
        {a} + {b} = ?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {uniqueOptions.slice(0, 4).map((n) => (
          <KidButton key={n} color="#9B59B6" size="md" onClick={() => handleGuess(n)} disabled={answered}>
            <span className="font-extrabold text-white">{n}</span>
          </KidButton>
        ))}
      </div>
    </div>
  );
}
