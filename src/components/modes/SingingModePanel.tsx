'use client';

import { useCallback, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { buildSingingPrompt } from '@/lib/ai/prompts';
import { SINGING_ANIMATIONS } from '@/lib/animation/animationMap';
import KidButton from '@/components/ui/KidButton';

interface SingingModePanelProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
}

export default function SingingModePanel({ speakText }: SingingModePanelProps) {
  const petName = useAppStore((s) => s.settings.petName);
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const animIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSinging = useCallback(async () => {
    setAIState('SPEAKING');

    animIntervalRef.current = setInterval(() => {
      const randomAnim = SINGING_ANIMATIONS[Math.floor(Math.random() * SINGING_ANIMATIONS.length)];
      setAnimation(randomAnim);
    }, 2500);

    const prompt = buildSingingPrompt(petName);
    await speakText('Hãy hát một bài hát thiếu nhi!', prompt);

    if (animIntervalRef.current) {
      clearInterval(animIntervalRef.current);
      animIntervalRef.current = null;
    }
    setAnimation('Idle');
    setAIState('IDLE');
  }, [petName, setAIState, setAnimation, speakText]);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-3">
      <p className="text-center font-bold text-orange-500">🎵 Hát cùng bạn thú!</p>
      <KidButton color="#F39C12" size="lg" onClick={startSinging}>
        🎶
      </KidButton>
    </div>
  );
}
