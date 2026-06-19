import type { AIState } from './ai';

export type VoiceProviderType =
  | 'web-speech'
  | 'openai-tts'
  | 'openai-realtime'
  | 'elevenlabs';

export interface VoiceConfig {
  sttProvider: VoiceProviderType;
  ttsProvider: VoiceProviderType;
  language: string;
  voiceId?: string;
}

export interface SpeechResult {
  text: string;
  confidence?: number;
  isFinal: boolean;
}

export interface TTSResult {
  audioUrl: string;
  text: string;
  duration?: number;
}

export interface VoiceCallbacks {
  onListeningStart?: () => void;
  onListeningEnd?: () => void;
  onTranscript?: (result: SpeechResult) => void;
  onThinking?: () => void;
  onSpeakingStart?: (text: string) => void;
  onSpeakingEnd?: () => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: AIState) => void;
}

/** Contract for pluggable voice backends (STT / TTS / realtime) */
export interface VoiceProvider {
  readonly name: VoiceProviderType;
  isSupported(): boolean;
  startListening?(callbacks: Pick<VoiceCallbacks, 'onTranscript' | 'onError'>): Promise<void>;
  stopListening?(): void;
  synthesize(text: string): Promise<TTSResult>;
  destroy?(): void;
}
