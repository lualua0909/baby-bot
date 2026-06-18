'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { buildEnglishTeacherPrompt } from '@/lib/ai/prompts';
import KidButton from '@/components/ui/KidButton';

interface EnglishModePanelProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
}

export default function EnglishModePanel({ speakText }: EnglishModePanelProps) {
  const petName = useAppStore((s) => s.settings.petName);
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const addCoins = useAppStore((s) => s.addCoins);

  const startLesson = useCallback(async () => {
    setAIState('SPEAKING');
    setAnimation('Wave');
    const prompt = buildEnglishTeacherPrompt(petName);
    await speakText('Start an English lesson. Ask one simple question.', prompt);
  }, [petName, setAIState, setAnimation, speakText]);

  const checkAnswer = useCallback(
    async (answer: string, isCorrect: boolean) => {
      setAnimation(isCorrect ? 'Yes' : 'No');
      setAIState(isCorrect ? 'HAPPY' : 'SAD');
      if (isCorrect) addCoins(5);

      const prompt = buildEnglishTeacherPrompt(petName);
      await speakText(
        `The child answered: "${answer}". ${isCorrect ? 'Correct!' : 'Incorrect.'} Respond appropriately.`,
        prompt
      );
    },
    [petName, setAnimation, setAIState, addCoins, speakText]
  );

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-3">
      <p className="text-center font-bold text-blue-600">🇬🇧 Học tiếng Anh cùng bạn thú!</p>
      <KidButton color="#3498DB" size="lg" onClick={startLesson}>
        📚
      </KidButton>
      <div className="flex gap-2">
        <KidButton color="#2ECC71" size="sm" onClick={() => checkAnswer('correct answer', true)}>
          ✅
        </KidButton>
        <KidButton color="#E74C3C" size="sm" onClick={() => checkAnswer('wrong answer', false)}>
          ❌
        </KidButton>
      </div>
    </div>
  );
}
