'use client';

import { useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { buildGameHostPrompt } from '@/lib/ai/prompts';
import KidButton from '@/components/ui/KidButton';

const ANIMALS = [
  { emoji: '🐱', name: 'cat', vi: 'mèo' },
  { emoji: '🐶', name: 'dog', vi: 'chó' },
  { emoji: '🦁', name: 'lion', vi: 'sư tử' },
  { emoji: '🐸', name: 'frog', vi: 'ếch' },
];

interface GuessAnimalGameProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
  onComplete: () => void;
}

export default function GuessAnimalGame({ speakText, onComplete }: GuessAnimalGameProps) {
  const petName = useAppStore((s) => s.settings.petName);
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const addCoins = useAppStore((s) => s.addCoins);

  const [target] = useState(() => ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
  const [answered, setAnswered] = useState(false);

  const handleGuess = useCallback(
    async (animal: (typeof ANIMALS)[0]) => {
      if (answered) return;
      setAnswered(true);
      const correct = animal.name === target.name;
      setAnimation(correct ? 'Yes' : 'No');
      setAIState(correct ? 'HAPPY' : 'SAD');
      if (correct) addCoins(10);

      const prompt = buildGameHostPrompt(petName, 'Guess Animal');
      await speakText(
        correct
          ? `Đúng rồi! Đó là con ${target.vi}!`
          : `Chưa đúng! Đó là con ${target.vi}!`,
        prompt
      );
      setTimeout(onComplete, 2000);
    },
    [answered, target, petName, setAnimation, setAIState, addCoins, speakText, onComplete]
  );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-extrabold text-green-700 text-lg">Con vật này là gì?</p>
      <span className="text-7xl animate-bounce">{target.emoji}</span>
      <div className="grid grid-cols-2 gap-3">
        {ANIMALS.map((a) => (
          <KidButton key={a.name} color="#2ECC71" size="md" onClick={() => handleGuess(a)} disabled={answered}>
            {a.emoji}
          </KidButton>
        ))}
      </div>
    </div>
  );
}
