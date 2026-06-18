import type { VoiceProvider, TTSResult } from '@/types/voice';

/** OpenAI TTS via server API route */
export class OpenAITTSProvider implements VoiceProvider {
  readonly name = 'openai-tts' as const;

  isSupported(): boolean {
    return true;
  }

  async synthesize(text: string): Promise<TTSResult> {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'TTS failed' }));
      throw new Error(typeof err.error === 'string' ? err.error : 'TTS failed');
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return { audioUrl, text };
  }
}
