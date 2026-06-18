'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { buildGameHostPrompt } from '@/lib/ai/prompts';
import KidButton from '@/components/ui/KidButton';

const COLORS = [
  { name: 'red', vi: 'đỏ', hex: '#EF4444' },
  { name: 'blue', vi: 'xanh dương', hex: '#3B82F6' },
  { name: 'yellow', vi: 'vàng', hex: '#FBBF24' },
  { name: 'green', vi: 'xanh lá', hex: '#22C55E' },
];

interface GuessColorGameProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
  onComplete: () => void;
}

export default function GuessColorGame({ speakText, onComplete }: GuessColorGameProps) {
  const petName = useAppStore((s) => s.settings.petName);
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

      const prompt = buildGameHostPrompt(petName, 'Guess Color');
      await speakText(
        correct ? `Đúng! Màu ${target.vi}!` : `Sai rồi! Đáp án là màu ${target.vi}!`,
        prompt
      );
      setTimeout(onComplete, 2000);
    },
    [answered, target, petName, setAnimation, setAIState, addCoins, speakText, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-extrabold text-green-700 text-lg">Màu này là gì?</p>
      <div
        className="w-24 h-24 rounded-2xl border-4 border-white shadow-kid"
        style={{ backgroundColor: target.hex }}
      />
      <div className="grid grid-cols-2 gap-3">
        {COLORS.map((c) => (
          <KidButton key={c.name} color={c.hex} size="md" onClick={() => handleGuess(c)} disabled={answered}>
            <span className="text-xs font-bold text-white drop-shadow">{c.vi}</span>
          </KidButton>
        ))}
      </div>
    </div>
  );
}
