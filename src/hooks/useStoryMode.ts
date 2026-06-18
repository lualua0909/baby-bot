'use client';

import { useAppStore } from '@/store/appStore';
import type { StoryTheme } from '@/types/ai';
import type { SttProviderType, TtsProviderType } from '@/types/admin';
import { buildStoryPrompt } from '@/lib/ai/prompts';
import { splitIntoChunks, parseStoryEmotion } from '@/lib/ai/storyEmotionParser';

export function useStoryMode(
  _speakText: (text: string, systemPrompt?: string) => Promise<void>,
  speakChunk: (text: string) => Promise<void>
) {
  const setStoryTheme = useAppStore((s) => s.setStoryTheme);
  const setAnimation = useAppStore((s) => s.setAnimation);
  const setAIState = useAppStore((s) => s.setAIState);
  const setSubtitle = useAppStore((s) => s.setSubtitle);
  const setOverrideAnimation = useAppStore((s) => s.setOverrideAnimation);
  const petName = useAppStore((s) => s.settings.petName);
  const addCoins = useAppStore((s) => s.addCoins);

  const startStory = async (theme: StoryTheme) => {
    setStoryTheme(theme);
    setAIState('SPEAKING');
    setAnimation('Wave');

    const systemPrompt = buildStoryPrompt(theme, petName);

    const { VoiceService } = await import('@/lib/voice/VoiceService');

    let sttProvider: SttProviderType = 'web-speech';
    let ttsProvider: TtsProviderType = 'openai-tts';
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const admin = (await res.json()) as {
          sttProvider: SttProviderType;
          ttsProvider: TtsProviderType;
        };
        sttProvider = admin.sttProvider;
        ttsProvider = admin.ttsProvider;
      }
    } catch {
      // fallback
    }

    const service = new VoiceService(sttProvider, ttsProvider);

    try {
      const story = await service.fetchLLMResponse(
        systemPrompt,
        'Hãy kể một câu chuyện hay cho bé nghe!'
      );

      const chunks = splitIntoChunks(story);
      setOverrideAnimation('Wave');

      for (const chunk of chunks) {
        const emotion = parseStoryEmotion(chunk);
        if (emotion) {
          setAIState(emotion.aiState);
          setAnimation(emotion.animation);
        }
        await speakChunk(chunk);
      }
    } finally {
      service.destroy();
      setOverrideAnimation(null);
      setAIState('IDLE');
      setSubtitle('');
      setStoryTheme(null);
      addCoins(10);
    }
  };

  return { startStory };
}
