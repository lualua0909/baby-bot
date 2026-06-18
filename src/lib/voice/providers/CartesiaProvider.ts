import type { VoiceProvider, TTSResult } from '@/types/voice';

/** Stub — connect Cartesia when API key is configured */
export class CartesiaProvider implements VoiceProvider {
  readonly name = 'cartesia' as const;

  isSupported(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_CARTESIA_API_KEY);
  }

  async synthesize(text: string): Promise<TTSResult> {
    throw new Error('Cartesia TTS not configured. Set NEXT_PUBLIC_CARTESIA_API_KEY.');
  }
}
