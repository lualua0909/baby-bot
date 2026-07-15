import type { VoiceProvider, VoiceProviderType, VoiceCallbacks, TTSResult } from '@/types/voice';
import { friendlyNetworkError, sanitizeLLMText } from '@/lib/utils';
import { WebSpeechSTTProvider } from './providers/WebSpeechSTTProvider';
import { OpenAIRealtimeSTTProvider } from './providers/OpenAIRealtimeSTTProvider';
import { ElevenLabsSTTProvider } from './providers/ElevenLabsSTTProvider';
import { OpenAITTSProvider } from './providers/OpenAITTSProvider';
import { OpenAIRealtimeProvider } from './providers/OpenAIRealtimeProvider';
import { ElevenLabsProvider } from './providers/ElevenLabsProvider';
import { WebSpeechTTSProvider } from './providers/WebSpeechTTSProvider';
import { aiStateMachine } from '@/lib/ai/stateMachine';

export function createTTSProvider(type: VoiceProviderType): VoiceProvider {
  switch (type) {
    case 'web-speech':
      return new WebSpeechTTSProvider();
    case 'openai-tts':
      return new OpenAITTSProvider();
    case 'openai-realtime':
      return new OpenAIRealtimeProvider();
    case 'elevenlabs':
      return new ElevenLabsProvider();
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
  private speechRequestId = 0;
  private cancelPlayback: (() => void) | null = null;
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

    await this.ensureAudioContext();

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

  startSpeechRequest(): number {
    this.stopCurrentAudio();
    this.speechRequestId += 1;
    return this.speechRequestId;
  }

  isSpeechRequestActive(requestId: number): boolean {
    return requestId === this.speechRequestId;
  }

  async speak(text: string, requestId = this.startSpeechRequest()): Promise<void> {
    if (!this.isSpeechRequestActive(requestId)) return;

    aiStateMachine.transition('SPEAKING', 'tts_start');
    this.callbacks.onStateChange?.('SPEAKING');
    this.callbacks.onSpeakingStart?.(text);

    try {
      if (this.ttsProvider.name === 'web-speech') {
        const browserTts = this.ttsProvider as WebSpeechTTSProvider;
        await browserTts.speak(text);
        if (this.isSpeechRequestActive(requestId)) this.finishSpeaking('tts_end');
        return;
      }

      const result: TTSResult = await this.ttsProvider.synthesize(text);
      if (!this.isSpeechRequestActive(requestId)) {
        URL.revokeObjectURL(result.audioUrl);
        return;
      }
      await this.playAudio(result.audioUrl, requestId);
    } catch (apiError) {
      if (!this.isSpeechRequestActive(requestId)) return;
      console.warn('API TTS failed, falling back to browser speech:', apiError);
      try {
        await new WebSpeechTTSProvider().speak(text);
        if (this.isSpeechRequestActive(requestId)) this.finishSpeaking('tts_end');
      } catch (fallbackError) {
        if (this.isSpeechRequestActive(requestId)) this.finishSpeaking('error');
        throw fallbackError;
      }
    }
  }

  /** Unlock/resume Web Audio — required after user gesture for routed playback. */
  private async ensureAudioContext(): Promise<AudioContext> {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new AudioContext();
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    return this.audioContext;
  }

  private finishSpeaking(reason: 'tts_end' | 'error'): void {
    aiStateMachine.transition('IDLE', reason);
    this.callbacks.onStateChange?.('IDLE');
    this.callbacks.onSpeakingEnd?.();
  }

  private async playAudio(url: string, requestId: number): Promise<void> {
    const audioContext = await this.ensureAudioContext();

    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      let settled = false;
      const finish = (reason: 'tts_end' | 'error', error?: Error) => {
        if (settled) return;
        settled = true;
        URL.revokeObjectURL(url);
        if (this.audio === audio) this.audio = null;
        if (this.cancelPlayback) this.cancelPlayback = null;
        if (this.isSpeechRequestActive(requestId)) this.finishSpeaking(reason);
        if (error) reject(error);
        else resolve();
      };

      this.audio = audio;
      this.cancelPlayback = () => {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        finish('tts_end');
      };

      if (this.onAudioConnect) {
        this.onAudioConnect(audio, audioContext);
      } else {
        const source = audioContext.createMediaElementSource(audio);
        source.connect(audioContext.destination);
      }

      audio.onended = () => {
        finish('tts_end');
      };

      audio.onerror = () => {
        finish('error', new Error('Audio playback failed'));
      };

      audio.play().catch((error: unknown) => {
        finish('error', error instanceof Error ? error : new Error('Audio playback failed'));
      });
    });
  }

  stopCurrentAudio(): void {
    this.cancelPlayback?.();
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
    }
  }

  async fetchLLMResponse(systemPrompt: string, userMessage: string): Promise<string> {
    let response: Response;
    try {
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          systemPrompt,
          petState: { name: 'Pet' },
        }),
      });
    } catch {
      throw new Error(friendlyNetworkError(new Error('Failed to fetch')));
    }

    if (!response.ok) {
      const errBody = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(
        typeof errBody.error === 'string' ? errBody.error : 'Không nhận được phản hồi từ AI'
      );
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response stream');

    const decoder = new TextDecoder();
    let fullText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }
    } catch (err) {
      throw new Error(friendlyNetworkError(err));
    }

    return sanitizeLLMText(fullText);
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
