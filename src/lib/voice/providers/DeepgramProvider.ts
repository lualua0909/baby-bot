import type { VoiceProvider, TTSResult } from '@/types/voice';

/** Stub — connect Deepgram STT/TTS when API key is configured */
export class DeepgramProvider implements VoiceProvider {
  readonly name = 'deepgram' as const;

  isSupported(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
  }

  async synthesize(text: string): Promise<TTSResult> {
    throw new Error('Deepgram TTS not configured. Set NEXT_PUBLIC_DEEPGRAM_API_KEY.');
  }
}
