'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { VoiceService } from '@/lib/voice/VoiceService';
import { buildVoiceChatPrompt } from '@/lib/ai/prompts';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import type { SttProviderType, TtsProviderType } from '@/types/admin';

export function useVoiceChat(lipSyncRef: React.MutableRefObject<LipSyncManager | null>) {
  const settings = useAppStore((s) => s.settings);
  const setAIState = useAppStore((s) => s.setAIState);
  const setMicActive = useAppStore((s) => s.setMicActive);
  const setSubtitle = useAppStore((s) => s.setSubtitle);
  const setLastResponse = useAppStore((s) => s.setLastResponse);
  const addLevelProgress = useAppStore((s) => s.addLevelProgress);

  const { config: adminConfig } = useAdminConfig();
  const sttProvider: SttProviderType = adminConfig?.sttProvider ?? 'web-speech';
  const ttsProvider: TtsProviderType = adminConfig?.ttsProvider ?? 'openai-tts';

  const serviceRef = useRef<VoiceService | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const processTranscript = useCallback(
    async (text: string) => {
      const service = serviceRef.current;
      if (!service || !text.trim()) return;

      setAIState('THINKING');
      const systemPrompt = buildVoiceChatPrompt(settings.petName);

      try {
        const response = await service.fetchLLMResponse(systemPrompt, text);
        setLastResponse(response);
        setSubtitle(response);
        await service.speak(response);
      } catch {
        setSubtitle('Không thể kết nối. Thử lại nhé!');
        setAIState('IDLE');
      }
    },
    [settings.petName, setAIState, setLastResponse, setSubtitle]
  );

  useEffect(() => {
    if (!adminConfig) return;

    const service = new VoiceService(sttProvider, ttsProvider);

    service.setCallbacks({
      onStateChange: (state) => setAIState(state),
      onListeningStart: () => {
        setIsListening(true);
        setMicActive(true);
      },
      onListeningEnd: () => {
        setIsListening(false);
        setMicActive(false);
      },
      onTranscript: (result) => {
        setSubtitle(result.text);
        if (result.isFinal && result.text.trim()) {
          void processTranscript(result.text);
        }
      },
      onSpeakingStart: () => setIsSpeaking(true),
      onSpeakingEnd: () => {
        setIsSpeaking(false);
        addLevelProgress(5);
      },
      onError: (err) => {
        setSubtitle(`Lỗi: ${err.message}`);
        setIsListening(false);
        setMicActive(false);
      },
    });

    service.setOnAudioConnect((audio, context) => {
      const source = context.createMediaElementSource(audio);
      if (lipSyncRef.current) {
        lipSyncRef.current.connectAudio(context, source);
      }
      source.connect(context.destination);
    });

    serviceRef.current = service;

    return () => {
      service.destroy();
      serviceRef.current = null;
    };
  }, [
    adminConfig,
    sttProvider,
    ttsProvider,
    setAIState,
    setMicActive,
    setSubtitle,
    addLevelProgress,
    lipSyncRef,
    processTranscript,
  ]);

  const toggleListening = useCallback(async () => {
    const service = serviceRef.current;
    if (!service) return;

    if (isListening) {
      service.stopListening();
      return;
    }

    setSubtitle('');
    await service.startListening();
  }, [isListening, setSubtitle]);

  const speakText = useCallback(
    async (text: string, systemPrompt?: string) => {
      const service = serviceRef.current;
      if (!service) return;

      setAIState('THINKING');
      try {
        const response = systemPrompt
          ? await service.fetchLLMResponse(systemPrompt, text)
          : text;
        setLastResponse(response);
        setSubtitle(response);
        await service.speak(response);
      } catch {
        setSubtitle('Có lỗi xảy ra!');
        setAIState('IDLE');
      }
    },
    [setAIState, setLastResponse, setSubtitle]
  );

  const speakChunk = useCallback(
    async (text: string) => {
      const service = serviceRef.current;
      if (!service) return;
      setSubtitle(text);
      await service.speak(text);
    },
    [setSubtitle]
  );

  return { isSpeaking, isListening, toggleListening, speakText, speakChunk, sttProvider };
}
