'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { VoiceService } from '@/lib/voice/VoiceService';
import { buildVoiceChatPrompt } from '@/lib/ai/prompts';
import { friendlyNetworkError } from '@/lib/utils';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import type { SttProviderType, TtsProviderType } from '@/types/admin';

export function useVoiceChat(lipSyncRef: React.MutableRefObject<LipSyncManager | null>) {
  const settings = useAppStore((s) => s.settings);
  const setAIState = useAppStore((s) => s.setAIState);
  const setMicActive = useAppStore((s) => s.setMicActive);
  const setSubtitle = useAppStore((s) => s.setSubtitle);
  const setUserTranscript = useAppStore((s) => s.setUserTranscript);
  const setLastResponse = useAppStore((s) => s.setLastResponse);
  const addLevelProgress = useAppStore((s) => s.addLevelProgress);

  const { config: adminConfig } = useAdminConfig();
  const sttProvider: SttProviderType = adminConfig?.sttProvider ?? 'web-speech';
  const ttsProvider: TtsProviderType = adminConfig?.ttsProvider ?? 'web-speech';

  const serviceRef = useRef<VoiceService | null>(null);
  const isListeningRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const processTranscript = useCallback(
    async (text: string) => {
      const service = serviceRef.current;
      if (!service || !text.trim()) return;
      const requestId = service.startSpeechRequest();

      setSubtitle('');
      setAIState('THINKING');
      const systemPrompt = buildVoiceChatPrompt(settings.petName);

      try {
        const response = await service.fetchLLMResponse(systemPrompt, text);
        if (!service.isSpeechRequestActive(requestId)) return;
        setLastResponse(response);
        setUserTranscript('');
        setSubtitle(response);
        await service.speak(response, requestId);
      } catch (err) {
        if (!service.isSpeechRequestActive(requestId)) return;
        setSubtitle(`Lỗi: ${friendlyNetworkError(err, 'Không thể phát giọng nói')}`);
        setAIState('IDLE');
        setIsSpeaking(false);
      }
    },
    [settings.petName, setAIState, setLastResponse, setSubtitle, setUserTranscript]
  );

  useEffect(() => {
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
        setUserTranscript(result.text);
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
    setUserTranscript,
    addLevelProgress,
    lipSyncRef,
    processTranscript,
  ]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      serviceRef.current?.stopListening();
      return;
    }

    const service = serviceRef.current;
    if (!service) return;

    setSubtitle('');
    setUserTranscript('');
    await service.startListening();
  }, [isListening, setSubtitle, setUserTranscript]);

  const startListening = useCallback(async () => {
    if (isListeningRef.current) return;

    const service = serviceRef.current;
    if (!service) return;

    setSubtitle('');
    setUserTranscript('');
    await service.startListening();
  }, [setSubtitle, setUserTranscript]);

  const stopListening = useCallback(() => {
    serviceRef.current?.stopListening();
  }, []);

  const speakText = useCallback(
    async (text: string, systemPrompt?: string) => {
      const service = serviceRef.current;
      if (!service) {
        setSubtitle('Đang khởi tạo giọng nói... Vui lòng thử lại sau vài giây.');
        return;
      }
      const requestId = service.startSpeechRequest();

      setSubtitle('');
      setAIState('THINKING');
      try {
        const response = systemPrompt
          ? await service.fetchLLMResponse(systemPrompt, text)
          : text;
        if (!service.isSpeechRequestActive(requestId)) return;
        setLastResponse(response);
        setSubtitle(response);
        await service.speak(response, requestId);
      } catch (err) {
        if (!service.isSpeechRequestActive(requestId)) return;
        setSubtitle(`Lỗi: ${friendlyNetworkError(err, 'Không thể phát giọng nói')}`);
        setAIState('IDLE');
        setIsSpeaking(false);
      }
    },
    [setAIState, setLastResponse, setSubtitle]
  );

  const speakChunk = useCallback(
    async (text: string) => {
      const service = serviceRef.current;
      if (!service) return;
      const requestId = service.startSpeechRequest();
      setSubtitle(text);
      await service.speak(text, requestId);
    },
    [setSubtitle]
  );

  return { isSpeaking, isListening, toggleListening, startListening, stopListening, speakText, speakChunk, sttProvider };
}
