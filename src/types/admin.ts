/** STT providers available for admin configuration */
export type SttProviderType = 'web-speech' | 'openai-realtime' | 'elevenlabs';

/** TTS providers available for admin configuration */
export type TtsProviderType = 'openai-tts' | 'elevenlabs';

/** Cheapest OpenAI Realtime model for STT */
export const REALTIME_MODEL_CHEAP = 'gpt-4o-mini-realtime-preview' as const;

/** Cheapest transcription model used inside Realtime session */
export const TRANSCRIPTION_MODEL_CHEAP = 'whisper-1' as const;

/** OpenAI TTS model (cheaper than tts-1-hd) */
export const OPENAI_TTS_MODEL = 'tts-1' as const;

/** OpenAI TTS voice — friendly for kids */
export const OPENAI_TTS_VOICE = 'nova' as const;

/** ElevenLabs low-latency multilingual model (good for Vietnamese) */
export const ELEVENLABS_TTS_MODEL = 'eleven_flash_v2_5' as const;

/** ElevenLabs realtime STT model (Scribe v2) */
export const ELEVENLABS_STT_MODEL = 'scribe_v2_realtime' as const;

/** Default ElevenLabs voice ID (Anna Thu — Vietnamese) */
export const ELEVENLABS_DEFAULT_VOICE_ID = 'P37gHF6iLTEvs2pLYhyv' as const;

/** Voice tuning for a friendly, kid-facing Vietnamese voice */
export const ELEVENLABS_VOICE_SETTINGS = {
  stability: 0.65,
  similarityBoost: 0.85,
  style: 0.15,
  useSpeakerBoost: true,
} as const;

export interface AdminConfig {
  sttProvider: SttProviderType;
  ttsProvider: TtsProviderType;
  realtimeModel: typeof REALTIME_MODEL_CHEAP;
  transcriptionModel: typeof TRANSCRIPTION_MODEL_CHEAP;
  updatedAt: string;
}

export interface ProviderOption<T extends string> {
  id: T;
  name: string;
  description: string;
  cost: string;
  pros: string[];
  cons: string[];
}

export type SttProviderOption = ProviderOption<SttProviderType>;
export type TtsProviderOption = ProviderOption<TtsProviderType>;

export const STT_PROVIDER_OPTIONS: SttProviderOption[] = [
  {
    id: 'web-speech',
    name: 'Web Speech API',
    description: 'Nhận diện giọng nói ngay trên trình duyệt (Chrome/Edge). Miễn phí, không cần API key.',
    cost: 'Miễn phí',
    pros: ['Không tốn phí API', 'Latency thấp', 'Dễ triển khai'],
    cons: ['Tiếng Việt không ổn định', 'Phụ thuộc trình duyệt', 'Khó kiểm soát chất lượng'],
  },
  {
    id: 'openai-realtime',
    name: 'OpenAI Realtime STT',
    description:
      'Nhận diện giọng qua OpenAI Realtime API. Dùng model rẻ nhất: gpt-4o-mini-realtime-preview + whisper-1 transcription.',
    cost: 'Trả phí theo phút audio (model mini — chi phí thấp nhất)',
    pros: ['Tiếng Việt tốt hơn', 'Ổn định trên mọi trình duyệt', 'Production-ready'],
    cons: ['Cần OPENAI_API_KEY', 'Tốn phí API', 'Cần kết nối internet'],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs STT',
    description: `Nhận diện giọng realtime qua ElevenLabs Scribe. Model: ${ELEVENLABS_STT_MODEL} — hỗ trợ 90+ ngôn ngữ kể cả tiếng Việt, latency ~150ms.`,
    cost: 'Trả phí theo phút audio',
    pros: ['Giọng/nói tự nhiên', 'Realtime streaming', 'Tiếng Việt tốt', 'Dùng chung API key với TTS'],
    cons: ['Cần ELEVENLABS_API_KEY', 'Tốn phí API'],
  },
];

export const TTS_PROVIDER_OPTIONS: TtsProviderOption[] = [
  {
    id: 'openai-tts',
    name: 'OpenAI TTS',
    description: `Giọng nói qua OpenAI TTS API. Model: ${OPENAI_TTS_MODEL}, voice: ${OPENAI_TTS_VOICE}. Chi phí thấp, tiếng Việt ổn.`,
    cost: 'Rẻ — trả phí theo ký tự',
    pros: ['Giá thấp', 'Dễ tích hợp', 'Tiếng Việt tốt', 'Đã có sẵn trong app'],
    cons: ['Không streaming realtime', 'Giọng ít cảm xúc hơn ElevenLabs'],
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: `Giọng nói tự nhiên qua ElevenLabs. Model: ${ELEVENLABS_TTS_MODEL} — hỗ trợ đa ngôn ngữ kể cả tiếng Việt.`,
    cost: 'Trung bình — trả phí theo ký tự',
    pros: ['Giọng tự nhiên', 'Phù hợp kể chuyện/hát', 'Đa ngôn ngữ', 'Cảm xúc tốt'],
    cons: ['Cần ELEVENLABS_API_KEY', 'Đắt hơn OpenAI TTS'],
  },
];
