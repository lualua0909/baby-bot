'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { buildEnglishTeacherPrompt } from '@/lib/ai/prompts';

interface EnglishModePanelProps {
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
}

export default function EnglishModePanel({ speakText }: EnglishModePanelProps) {
  const petName = useAppStore((s) => s.settings.petName);
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const addCoins = useAppStore((s) => s.addCoins);
  const startedRef = useRef(false);

  const startLesson = useCallback(async () => {
    setAIState('SPEAKING');
    setAnimation('Wave');
    const prompt = buildEnglishTeacherPrompt(petName);
    await speakText('Start an English lesson. Ask one simple question.', prompt);
    addCoins(5);
    setAnimation('Idle');
    setAIState('IDLE');
  }, [petName, setAIState, setAnimation, addCoins, speakText]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void startLesson();
  }, [startLesson]);

  return null;
}
