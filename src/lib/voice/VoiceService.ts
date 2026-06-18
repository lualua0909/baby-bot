import type { VoiceProvider, VoiceProviderType, VoiceCallbacks, TTSResult } from '@/types/voice';
import { WebSpeechSTTProvider } from './providers/WebSpeechSTTProvider';
import { OpenAIRealtimeSTTProvider } from './providers/OpenAIRealtimeSTTProvider';
import { ElevenLabsSTTProvider } from './providers/ElevenLabsSTTProvider';
import { OpenAITTSProvider } from './providers/OpenAITTSProvider';
import { OpenAIRealtimeProvider } from './providers/OpenAIRealtimeProvider';
import { DeepgramProvider } from './providers/DeepgramProvider';
import { ElevenLabsProvider } from './providers/ElevenLabsProvider';
import { CartesiaProvider } from './providers/CartesiaProvider';
import { aiStateMachine } from '@/lib/ai/stateMachine';

export function createTTSProvider(type: VoiceProviderType): VoiceProvider {
  switch (type) {
    case 'openai-tts':
      return new OpenAITTSProvider();
    case 'openai-realtime':
      return new OpenAIRealtimeProvider();
    case 'deepgram':
      return new DeepgramProvider();
    case 'elevenlabs':
      return new ElevenLabsProvider();
    case 'cartesia':
      return new CartesiaProvider();
    default:
      return new OpenAITTSProvider();
  }
}

export function createSTTProvider(type: VoiceProviderType): VoiceProvider {
  switch (type) {
    case 'web-speech':
      return new WebSpeechSTTProvider();
    case 'openai-realtime':
      return new OpenAIRealtimeSTTProvider();
    case 'elevenlabs':
      return new ElevenLabsSTTProvider();
    case 'deepgram':
      return new DeepgramProvider();
    default:
      return new WebSpeechSTTProvider();
  }
}

/**
 * Orchestrates the voice pipeline: Mic → STT → LLM → TTS → playback.
 * Uses pluggable VoiceProvider implementations.
 */
export class VoiceService {
  private sttProvider: VoiceProvider;
  private ttsProvider: VoiceProvider;
  private callbacks: VoiceCallbacks = {};
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private onAudioConnect?: (audio: HTMLAudioElement, context: AudioContext) => void;

  constructor(sttType: VoiceProviderType, ttsType: VoiceProviderType) {
    this.sttProvider = createSTTProvider(sttType);
    this.ttsProvider = createTTSProvider(ttsType);
  }

  setCallbacks(callbacks: VoiceCallbacks): void {
    this.callbacks = callbacks;
  }

  /** Hook for lip sync — receives audio element before play */
  setOnAudioConnect(handler: (audio: HTMLAudioElement, context: AudioContext) => void): void {
    this.onAudioConnect = handler;
  }

  async startListening(): Promise<void> {
    if (!this.sttProvider.startListening) {
      throw new Error('STT provider does not support listening');
    }

    aiStateMachine.transition('LISTENING', 'mic_start');
    this.callbacks.onStateChange?.('LISTENING');
    this.callbacks.onListeningStart?.();

    await this.sttProvider.startListening({
      onTranscript: (result) => {
        this.callbacks.onTranscript?.(result);
        if (result.isFinal) {
          aiStateMachine.transition('THINKING', 'transcript_final');
          this.callbacks.onStateChange?.('THINKING');
          this.callbacks.onListeningEnd?.();
        }
      },
      onError: (error) => {
        aiStateMachine.transition('IDLE', 'error');
        this.callbacks.onStateChange?.('IDLE');
        this.callbacks.onError?.(error);
      },
    });
  }

  stopListening(): void {
    this.sttProvider.stopListening?.();
    aiStateMachine.transition('IDLE', 'cancel');
    this.callbacks.onStateChange?.('IDLE');
    this.callbacks.onListeningEnd?.();
  }

  async speak(text: string): Promise<void> {
    this.stopCurrentAudio();

    aiStateMachine.transition('SPEAKING', 'tts_start');
    this.callbacks.onStateChange?.('SPEAKING');
    this.callbacks.onSpeakingStart?.(text);

    const result: TTSResult = await this.ttsProvider.synthesize(text);
    await this.playAudio(result.audioUrl);
  }

  private async playAudio(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      this.audio = audio;

      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      if (this.onAudioConnect) {
        this.onAudioConnect(audio, this.audioContext);
      } else {
        const source = this.audioContext.createMediaElementSource(audio);
        source.connect(this.audioContext.destination);
      }

      audio.onended = () => {
        URL.revokeObjectURL(url);
        aiStateMachine.transition('IDLE', 'tts_end');
        this.callbacks.onStateChange?.('IDLE');
        this.callbacks.onSpeakingEnd?.();
        resolve();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Audio playback failed'));
      };

      audio.play().catch(reject);
    });
  }

  stopCurrentAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  async fetchLLMResponse(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        systemPrompt,
        petState: { name: 'Pet' },
      }),
    });

    if (!response.ok) {
      throw new Error('LLM request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response stream');

    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }

    return fullText.trim();
  }

  destroy(): void {
    this.stopListening();
    this.stopCurrentAudio();
    this.sttProvider.destroy?.();
    this.ttsProvider.destroy?.();
    this.audioContext?.close();
    this.audioContext = null;
  }
}
