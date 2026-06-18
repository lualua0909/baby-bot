import type { VoiceProvider, SpeechResult, TTSResult } from '@/types/voice';

interface SpeechRecognitionEventResult {
  readonly isFinal: boolean;
  readonly 0: { transcript: string; confidence?: number };
  length: number;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionEventResult>;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Browser Web Speech API for speech-to-text */
export class WebSpeechSTTProvider implements VoiceProvider {
  readonly name = 'web-speech' as const;
  private recognition: SpeechRecognitionLike | null = null;

  isSupported(): boolean {
    return getSpeechRecognition() !== null;
  }

  async startListening(
    callbacks: {
      onTranscript?: (result: SpeechResult) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      callbacks.onError?.(new Error('Web Speech API không được hỗ trợ'));
      return;
    }

    this.recognition = new Ctor();
    this.recognition.lang = 'vi-VN';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (!last) return;
      callbacks.onTranscript?.({
        text: last[0].transcript,
        confidence: last[0].confidence,
        isFinal: last.isFinal,
      });
    };

    this.recognition.onerror = (event) => {
      callbacks.onError?.(new Error(event.error));
    };

    this.recognition.start();
  }

  stopListening(): void {
    this.recognition?.stop();
    this.recognition = null;
  }

  async synthesize(_text: string): Promise<TTSResult> {
    throw new Error('WebSpeechSTTProvider does not support TTS');
  }

  destroy(): void {
    this.stopListening();
  }
}
