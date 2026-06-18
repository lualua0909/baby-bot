'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { buildSingingPrompt } from '@/lib/ai/prompts';
import { SINGING_ANIMATIONS } from '@/lib/animation/animationMap';

interface SingingModePanelProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
}

export default function SingingModePanel({ speakText }: SingingModePanelProps) {
  const petName = useAppStore((s) => s.settings.petName);
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const animIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

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

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void startSinging();

    return () => {
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
      }
    };
  }, [startSinging]);

  return null;
}
