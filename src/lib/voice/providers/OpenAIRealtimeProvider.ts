import type { VoiceProvider, TTSResult } from '@/types/voice';

/**
 * Stub for OpenAI Realtime API — swap in when API key + websocket endpoint ready.
 * Implements VoiceProvider contract for future realtime voice chat.
 */
export class OpenAIRealtimeProvider implements VoiceProvider {
  readonly name = 'openai-realtime' as const;

  isSupported(): boolean {
    return false;
  }

  async synthesize(text: string): Promise<TTSResult> {
    throw new Error(`OpenAI Realtime not configured. Text: ${text.slice(0, 40)}...`);
  }
}
