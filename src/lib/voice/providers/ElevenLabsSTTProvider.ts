import type { VoiceProvider, SpeechResult, TTSResult } from '@/types/voice';
import { Scribe, RealtimeEvents, CommitStrategy, type RealtimeConnection } from '@elevenlabs/client';
import { ELEVENLABS_STT_MODEL } from '@/types/admin';

/**
 * ElevenLabs Scribe v2 Realtime STT for browser.
 * Uses single-use token from server — API key never exposed to client.
 */
export class ElevenLabsSTTProvider implements VoiceProvider {
  readonly name = 'elevenlabs' as const;

  private connection: RealtimeConnection | null = null;
  private callbacks: {
    onTranscript?: (result: SpeechResult) => void;
    onError?: (error: Error) => void;
  } = {};

  isSupported(): boolean {
    return typeof window !== 'undefined' && !!navigator.mediaDevices;
  }

  async startListening(
    callbacks: {
      onTranscript?: (result: SpeechResult) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    this.callbacks = callbacks;

    const tokenRes = await fetch('/api/stt/elevenlabs/token', { method: 'POST' });
    if (!tokenRes.ok) {
      const err = await tokenRes.json().catch(() => ({ error: 'Token failed' }));
      throw new Error(typeof err.error === 'string' ? err.error : 'Không lấy được ElevenLabs token');
    }

    const { token } = (await tokenRes.json()) as { token: string };

    const connection = Scribe.connect({
      token,
      modelId: ELEVENLABS_STT_MODEL,
      languageCode: 'vi',
      commitStrategy: CommitStrategy.VAD,
      vadSilenceThresholdSecs: 0.9,
      microphone: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.connection = connection;

    connection.on(RealtimeEvents.PARTIAL_TRANSCRIPT, (data) => {
      if (!data.text) return;
      this.callbacks.onTranscript?.({ text: data.text, isFinal: false });
    });

    connection.on(RealtimeEvents.COMMITTED_TRANSCRIPT, (data) => {
      if (!data.text) return;
      this.callbacks.onTranscript?.({ text: data.text, isFinal: true });
    });

    connection.on(RealtimeEvents.ERROR, (error) => {
      const message =
        'error' in error && typeof error.error === 'string'
          ? error.error
          : 'ElevenLabs STT error';
      this.callbacks.onError?.(new Error(message));
    });

    connection.on(RealtimeEvents.AUTH_ERROR, (error) => {
      this.callbacks.onError?.(new Error(error.error ?? 'ElevenLabs auth error'));
    });
  }

  stopListening(): void {
    this.connection?.close();
    this.connection = null;
  }

  async synthesize(_text: string): Promise<TTSResult> {
    throw new Error('ElevenLabsSTTProvider does not support TTS');
  }

  destroy(): void {
    this.stopListening();
    this.callbacks = {};
  }
}
