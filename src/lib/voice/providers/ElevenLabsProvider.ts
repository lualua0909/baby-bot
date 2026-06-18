import type { VoiceProvider, TTSResult } from '@/types/voice';

/** ElevenLabs TTS via server API route (API key stays server-side) */
export class ElevenLabsProvider implements VoiceProvider {
  readonly name = 'elevenlabs' as const;

  isSupported(): boolean {
    return true;
  }

  async synthesize(text: string): Promise<TTSResult> {
    const response = await fetch('/api/tts/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'ElevenLabs TTS failed' }));
      throw new Error(typeof err.error === 'string' ? err.error : 'ElevenLabs TTS failed');
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return { audioUrl, text };
  }
}
