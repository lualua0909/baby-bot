import type { VoiceProvider, TTSResult } from '@/types/voice';
import { KID_TTS_SPEED } from '@/types/admin';

function waitForSpeechVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    const finish = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', finish);
      resolve(window.speechSynthesis.getVoices());
    };

    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
    window.setTimeout(finish, 1_000);
  });
}

/** Browser Web Speech API for text-to-speech (free, no API key) */
export class WebSpeechTTSProvider implements VoiceProvider {
  readonly name = 'web-speech' as const;

  isSupported(): boolean {
    return typeof window !== 'undefined' && !!window.speechSynthesis;
  }

  async speak(text: string): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Trình duyệt không hỗ trợ đọc văn bản');
    }

    window.speechSynthesis.cancel();
    const voices = await waitForSpeechVoices();
    window.speechSynthesis.resume();
    const voice =
      voices.find((v) => v.lang.toLowerCase().startsWith('vi')) ??
      voices.find((v) => v.lang.toLowerCase().includes('vi')) ??
      null;

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = KID_TTS_SPEED;
      utterance.pitch = 1.05;
      if (voice) utterance.voice = voice;

      utterance.onend = () => resolve();
      utterance.onerror = () => {
        reject(new Error('Không thể phát giọng nói trên trình duyệt'));
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  async synthesize(_text: string): Promise<TTSResult> {
    throw new Error('WebSpeechTTSProvider uses speak() instead of synthesize()');
  }
}
