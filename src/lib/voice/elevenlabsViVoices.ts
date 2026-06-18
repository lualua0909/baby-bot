/** Curated ElevenLabs Vietnamese voices for kid-facing TTS */
export interface ElevenLabsViVoice {
  id: string;
  name: string;
  gender: 'female' | 'male';
  description: string;
  /** Kid-friendly pick for default suggestion */
  kidFriendly?: boolean;
}

export const ELEVENLABS_VI_FEMALE_VOICES: ElevenLabsViVoice[] = [
  {
    id: 'P37gHF6iLTEvs2pLYhyv',
    name: 'Anna Thu',
    gender: 'female',
    description: 'Giọng nữ ấm, rõ ràng — phù hợp kể chuyện và trò chuyện nhẹ nhàng.',
    kidFriendly: true,
  },
  {
    id: 'yS7aiYdIV6YnJ3ZFcQZA',
    name: 'Bé Nari',
    gender: 'female',
    description: 'Giọng nữ miền Nam tươi sáng, vui tươi — rất hợp với app cho trẻ em.',
    kidFriendly: true,
  },
  {
    id: 'Sd0vUjtPZLtmojfIMHMx',
    name: 'Lily',
    gender: 'female',
    description: 'Giọng nữ trẻ, mềm mại, phát âm chuẩn — dễ nghe cho bé.',
    kidFriendly: true,
  },
  {
    id: '558B1EcdabtcSdleer40',
    name: 'Mai Thảo',
    gender: 'female',
    description: 'Giọng nữ Bắc nhẹ nhàng — hợp quảng cáo và kể chuyện.',
  },
  {
    id: 'd5HVupAWCwe4e6GvMCAL',
    name: 'Mai',
    gender: 'female',
    description: 'Giọng nữ Hà Nội tự nhiên, sáng và rõ — đọc sách và hội thoại.',
  },
];

export const ELEVENLABS_VI_MALE_VOICES: ElevenLabsViVoice[] = [
  {
    id: 'IovBBFnLZ6QzJhFLLroy',
    name: 'Tam Nguyễn',
    gender: 'male',
    description: 'Giọng kể cổ tích, sách thiếu nhi — lựa chọn tốt cho bạn thú.',
    kidFriendly: true,
  },
  {
    id: 'mJLZ5p8I7Pk81BHpKwbx',
    name: 'Nam Sadoma',
    gender: 'male',
    description: 'Giọng nam trẻ ấm, chuyên nghiệp — dạy học và trò chuyện.',
    kidFriendly: true,
  },
  {
    id: 'In8K4JDLu1r9fGysc64F',
    name: 'Tuấn',
    gender: 'male',
    description: 'Giọng nam êm, chậm rãi — thư giãn và giải thích.',
  },
  {
    id: '4a9d2yNlrzn6YEoy5ZWT',
    name: 'Kyle (Kỳ)',
    gender: 'male',
    description: 'Giọng nam ấm, đọc truyện và podcast nhẹ nhàng.',
  },
  {
    id: '7clfgAuss1M0JUYGlh1t',
    name: 'Phước',
    gender: 'male',
    description: 'Giọng nam đáng tin, rõ ràng — thuyết minh và kể chuyện.',
  },
];

export const ELEVENLABS_VI_VOICES: ElevenLabsViVoice[] = [
  ...ELEVENLABS_VI_FEMALE_VOICES,
  ...ELEVENLABS_VI_MALE_VOICES,
];

export const ELEVENLABS_DEFAULT_VI_VOICE_ID = ELEVENLABS_VI_FEMALE_VOICES[0].id;

const voiceIdSet = new Set(ELEVENLABS_VI_VOICES.map((v) => v.id));

export function isValidElevenLabsViVoiceId(id: string): boolean {
  return voiceIdSet.has(id);
}

export function getElevenLabsViVoice(id: string): ElevenLabsViVoice | undefined {
  return ELEVENLABS_VI_VOICES.find((v) => v.id === id);
}
