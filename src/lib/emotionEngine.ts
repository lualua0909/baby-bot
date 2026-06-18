// All 21 Cozmo-style emotions
export type Emotion =
  | 'neutral'
  | 'blink_high'
  | 'happy'
  | 'glee'
  | 'blink_low'
  | 'sad_down'
  | 'sad_up'
  | 'worried'
  | 'focused'
  | 'annoyed'
  | 'surprised'
  | 'skeptic'
  | 'frustrated'
  | 'unimpressed'
  | 'sleepy'
  | 'suspicious'
  | 'squint'
  | 'angry'
  | 'furious'
  | 'scared'
  | 'awe'
  | 'sleeping';

export const ALL_EMOTIONS: Emotion[] = [
  'neutral', 'blink_high', 'happy', 'glee', 'blink_low',
  'sad_down', 'sad_up', 'worried', 'focused', 'annoyed',
  'surprised', 'skeptic', 'frustrated', 'unimpressed',
  'sleepy', 'suspicious', 'squint', 'angry', 'furious',
  'scared', 'awe', 'sleeping',
];

export interface EyeConfig {
  // [width, height, cornerRadius, tiltAngle(degrees)]
  leftEye: [number, number, number, number];
  rightEye: [number, number, number, number];
  eyeOffsetY: number;
  eyeGap: number;
}

export interface EmotionConfig {
  eyes: EyeConfig;
  eyeColor: string;
  glowColor: string;
  glowIntensity: number;
  bodyTilt: number;
  bounceSpeed: number;
  bounceAmount: number;
  particleType: 'sparkle' | 'rain' | 'hearts' | 'zzz' | 'fire' | 'none' | 'stars' | 'sweat' | 'exclaim';
  particleColor: string;
  label: string;
  screenBrightness: number;
}

export const EMOTION_CONFIGS: Record<Emotion, EmotionConfig> = {
  // 1. Neutral — standard relaxed eyes
  neutral: {
    eyes: {
      leftEye: [28, 32, 8, 0],
      rightEye: [28, 32, 8, 0],
      eyeOffsetY: -2,
      eyeGap: 24,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00e5ff',
    glowIntensity: 0.6,
    bodyTilt: 0,
    bounceSpeed: 0.02,
    bounceAmount: 2,
    particleType: 'none',
    particleColor: '#00e5ff',
    label: 'Neutral',
    screenBrightness: 0.4,
  },

  // 2. Blink High — eyes become thin horizontal lines at top
  blink_high: {
    eyes: {
      leftEye: [30, 4, 2, 0],
      rightEye: [30, 4, 2, 0],
      eyeOffsetY: -8,
      eyeGap: 24,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00e5ff',
    glowIntensity: 0.5,
    bodyTilt: 0,
    bounceSpeed: 0.02,
    bounceAmount: 1,
    particleType: 'none',
    particleColor: '#00e5ff',
    label: 'Blink High',
    screenBrightness: 0.35,
  },

  // 3. Happy — eyes squish shorter and wider, curved up ^_^
  happy: {
    eyes: {
      leftEye: [34, 16, 8, 0],
      rightEye: [34, 16, 8, 0],
      eyeOffsetY: 2,
      eyeGap: 22,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00e5ff',
    glowIntensity: 0.8,
    bodyTilt: 0,
    bounceSpeed: 0.04,
    bounceAmount: 4,
    particleType: 'sparkle',
    particleColor: '#00e5ff',
    label: 'Happy',
    screenBrightness: 0.5,
  },

  // 4. Glee — tall wide eyes, maximum joy
  glee: {
    eyes: {
      leftEye: [36, 42, 14, 0],
      rightEye: [36, 42, 14, 0],
      eyeOffsetY: -4,
      eyeGap: 18,
    },
    eyeColor: '#00e5ff',
    glowColor: '#4df0ff',
    glowIntensity: 1.0,
    bodyTilt: 0,
    bounceSpeed: 0.06,
    bounceAmount: 6,
    particleType: 'stars',
    particleColor: '#4df0ff',
    label: 'Glee',
    screenBrightness: 0.65,
  },

  // 5. Blink Low — thin lines at bottom
  blink_low: {
    eyes: {
      leftEye: [30, 4, 2, 0],
      rightEye: [30, 4, 2, 0],
      eyeOffsetY: 6,
      eyeGap: 24,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00e5ff',
    glowIntensity: 0.5,
    bodyTilt: 0,
    bounceSpeed: 0.02,
    bounceAmount: 1,
    particleType: 'none',
    particleColor: '#00e5ff',
    label: 'Blink Low',
    screenBrightness: 0.35,
  },

  // 6. Sad (looking down) — droopy eyes, tilted inward tops, looking down
  sad_down: {
    eyes: {
      leftEye: [26, 22, 6, 12],
      rightEye: [26, 22, 6, -12],
      eyeOffsetY: 10,
      eyeGap: 26,
    },
    eyeColor: '#0097a7',
    glowColor: '#0097a7',
    glowIntensity: 0.3,
    bodyTilt: -3,
    bounceSpeed: 0.012,
    bounceAmount: 1,
    particleType: 'rain',
    particleColor: '#0097a7',
    label: 'Sad ↓',
    screenBrightness: 0.2,
  },

  // 7. Sad (looking up) — same droopy shape but eyes up, tilted head
  sad_up: {
    eyes: {
      leftEye: [26, 24, 6, 10],
      rightEye: [26, 24, 6, -10],
      eyeOffsetY: -6,
      eyeGap: 26,
    },
    eyeColor: '#0097a7',
    glowColor: '#00acc1',
    glowIntensity: 0.35,
    bodyTilt: 4,
    bounceSpeed: 0.012,
    bounceAmount: 1,
    particleType: 'rain',
    particleColor: '#00acc1',
    label: 'Sad ↑',
    screenBrightness: 0.25,
  },

  // 8. Worried — eyes tilt outward at top, wide
  worried: {
    eyes: {
      leftEye: [28, 30, 8, -10],
      rightEye: [28, 30, 8, 10],
      eyeOffsetY: -2,
      eyeGap: 24,
    },
    eyeColor: '#00bcd4',
    glowColor: '#00bcd4',
    glowIntensity: 0.5,
    bodyTilt: -2,
    bounceSpeed: 0.03,
    bounceAmount: 2,
    particleType: 'sweat',
    particleColor: '#00bcd4',
    label: 'Worried',
    screenBrightness: 0.35,
  },

  // 9. Focused/Determined — slightly narrowed, slight inward tilt
  focused: {
    eyes: {
      leftEye: [30, 22, 6, -4],
      rightEye: [30, 22, 6, 4],
      eyeOffsetY: 0,
      eyeGap: 22,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00e5ff',
    glowIntensity: 0.7,
    bodyTilt: 0,
    bounceSpeed: 0.015,
    bounceAmount: 1,
    particleType: 'none',
    particleColor: '#00e5ff',
    label: 'Focused',
    screenBrightness: 0.45,
  },

  // 10. Annoyed — half-closed, slight inward tilt
  annoyed: {
    eyes: {
      leftEye: [30, 14, 4, -6],
      rightEye: [30, 14, 4, 6],
      eyeOffsetY: 2,
      eyeGap: 22,
    },
    eyeColor: '#00bcd4',
    glowColor: '#00acc1',
    glowIntensity: 0.5,
    bodyTilt: 0,
    bounceSpeed: 0.015,
    bounceAmount: 1,
    particleType: 'none',
    particleColor: '#00acc1',
    label: 'Annoyed',
    screenBrightness: 0.35,
  },

  // 11. Surprised — very large round eyes
  surprised: {
    eyes: {
      leftEye: [36, 44, 18, 0],
      rightEye: [36, 44, 18, 0],
      eyeOffsetY: -4,
      eyeGap: 20,
    },
    eyeColor: '#00e5ff',
    glowColor: '#4df0ff',
    glowIntensity: 0.9,
    bodyTilt: 0,
    bounceSpeed: 0.05,
    bounceAmount: 5,
    particleType: 'exclaim',
    particleColor: '#4df0ff',
    label: 'Surprised',
    screenBrightness: 0.6,
  },

  // 12. Skeptic — one eye bigger than other, tilt
  skeptic: {
    eyes: {
      leftEye: [30, 34, 10, 0],
      rightEye: [24, 18, 6, 6],
      eyeOffsetY: 0,
      eyeGap: 24,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00bcd4',
    glowIntensity: 0.5,
    bodyTilt: 3,
    bounceSpeed: 0.015,
    bounceAmount: 1,
    particleType: 'none',
    particleColor: '#00bcd4',
    label: 'Skeptic',
    screenBrightness: 0.38,
  },

  // 13. Frustrated/Bored — droopy half-closed
  frustrated: {
    eyes: {
      leftEye: [32, 10, 4, 0],
      rightEye: [32, 10, 4, 0],
      eyeOffsetY: 4,
      eyeGap: 24,
    },
    eyeColor: '#0097a7',
    glowColor: '#00838f',
    glowIntensity: 0.35,
    bodyTilt: -2,
    bounceSpeed: 0.01,
    bounceAmount: 1,
    particleType: 'none',
    particleColor: '#00838f',
    label: 'Frustrated',
    screenBrightness: 0.25,
  },

  // 14. Unimpressed — flat narrow eyes, no tilt
  unimpressed: {
    eyes: {
      leftEye: [32, 12, 4, 0],
      rightEye: [32, 12, 4, 0],
      eyeOffsetY: 2,
      eyeGap: 26,
    },
    eyeColor: '#00acc1',
    glowColor: '#00838f',
    glowIntensity: 0.4,
    bodyTilt: 0,
    bounceSpeed: 0.01,
    bounceAmount: 0.5,
    particleType: 'none',
    particleColor: '#00838f',
    label: 'Unimpressed',
    screenBrightness: 0.3,
  },

  // 15. Sleepy — very thin lines, droopy
  sleepy: {
    eyes: {
      leftEye: [30, 5, 2, 3],
      rightEye: [30, 5, 2, -3],
      eyeOffsetY: 6,
      eyeGap: 24,
    },
    eyeColor: '#0097a7',
    glowColor: '#006064',
    glowIntensity: 0.2,
    bodyTilt: -4,
    bounceSpeed: 0.008,
    bounceAmount: 1,
    particleType: 'zzz',
    particleColor: '#4dd0e1',
    label: 'Sleepy',
    screenBrightness: 0.12,
  },

  // 16. Suspicious — one eye narrower, strong tilt
  suspicious: {
    eyes: {
      leftEye: [28, 28, 8, -3],
      rightEye: [26, 14, 4, 8],
      eyeOffsetY: 0,
      eyeGap: 22,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00bcd4',
    glowIntensity: 0.55,
    bodyTilt: -4,
    bounceSpeed: 0.015,
    bounceAmount: 1,
    particleType: 'none',
    particleColor: '#00bcd4',
    label: 'Suspicious',
    screenBrightness: 0.38,
  },

  // 17. Squint — both eyes very narrow, focused
  squint: {
    eyes: {
      leftEye: [30, 8, 3, 0],
      rightEye: [30, 8, 3, 0],
      eyeOffsetY: 1,
      eyeGap: 22,
    },
    eyeColor: '#00e5ff',
    glowColor: '#00bcd4',
    glowIntensity: 0.45,
    bodyTilt: 0,
    bounceSpeed: 0.01,
    bounceAmount: 0.5,
    particleType: 'none',
    particleColor: '#00bcd4',
    label: 'Squint',
    screenBrightness: 0.3,
  },

  // 18. Angry — narrow, strong inward V-tilt
  angry: {
    eyes: {
      leftEye: [30, 18, 4, -14],
      rightEye: [30, 18, 4, 14],
      eyeOffsetY: 2,
      eyeGap: 20,
    },
    eyeColor: '#ff1744',
    glowColor: '#ff1744',
    glowIntensity: 0.7,
    bodyTilt: 0,
    bounceSpeed: 0.04,
    bounceAmount: 2,
    particleType: 'fire',
    particleColor: '#ff5252',
    label: 'Angry',
    screenBrightness: 0.4,
  },

  // 19. Furious — very narrow, extreme V-tilt, intense red
  furious: {
    eyes: {
      leftEye: [32, 12, 3, -20],
      rightEye: [32, 12, 3, 20],
      eyeOffsetY: 3,
      eyeGap: 16,
    },
    eyeColor: '#ff0000',
    glowColor: '#ff0000',
    glowIntensity: 1.0,
    bodyTilt: 0,
    bounceSpeed: 0.07,
    bounceAmount: 3,
    particleType: 'fire',
    particleColor: '#ff1744',
    label: 'Furious',
    screenBrightness: 0.55,
  },

  // 20. Scared — very large round eyes, pulled apart, body tilted back
  scared: {
    eyes: {
      leftEye: [34, 42, 16, 5],
      rightEye: [34, 42, 16, -5],
      eyeOffsetY: -6,
      eyeGap: 30,
    },
    eyeColor: '#4dd0e1',
    glowColor: '#4dd0e1',
    glowIntensity: 0.8,
    bodyTilt: 5,
    bounceSpeed: 0.06,
    bounceAmount: 4,
    particleType: 'sweat',
    particleColor: '#4dd0e1',
    label: 'Scared',
    screenBrightness: 0.5,
  },

  // 21. Awe — very large perfectly round eyes, close together
  awe: {
    eyes: {
      leftEye: [38, 44, 20, 0],
      rightEye: [38, 44, 20, 0],
      eyeOffsetY: -2,
      eyeGap: 16,
    },
    eyeColor: '#00e5ff',
    glowColor: '#80deea',
    glowIntensity: 0.9,
    bodyTilt: 3,
    bounceSpeed: 0.02,
    bounceAmount: 2,
    particleType: 'stars',
    particleColor: '#80deea',
    label: 'Awe',
    screenBrightness: 0.55,
  },

  // 22. Sleeping — eyes completely closed (curved down arcs), deep Zzz
  sleeping: {
    eyes: {
      leftEye: [28, 2, 1, 4],
      rightEye: [28, 2, 1, -4],
      eyeOffsetY: 6,
      eyeGap: 24,
    },
    eyeColor: '#004d40',
    glowColor: '#004d40',
    glowIntensity: 0.1,
    bodyTilt: -6,
    bounceSpeed: 0.006,
    bounceAmount: 1.5,
    particleType: 'zzz',
    particleColor: '#26a69a',
    label: 'Sleeping',
    screenBrightness: 0.05,
  },
};

// Map game stats to the most fitting emotion
export function deriveEmotion(stats: {
  hunger: number;
  happiness: number;
  energy: number;
  affection: number;
  lastInteraction: Date;
}): Emotion {
  const hoursSinceInteraction =
    (Date.now() - new Date(stats.lastInteraction).getTime()) / (1000 * 60 * 60);

  // Neglected → sad looking up at user
  if (hoursSinceInteraction > 24) return 'sad_up';

  // Very hungry → worried
  if (stats.hunger < 10) return 'frustrated';
  if (stats.hunger < 20) return 'worried';

  // Very tired → sleepy
  if (stats.energy < 10) return 'sleepy';
  if (stats.energy < 20) return 'sleepy';

  // Very sad
  if (stats.happiness < 15) return 'sad_down';
  if (stats.happiness < 30) return 'sad_up';

  // Angry — low happiness + low affection
  if (stats.happiness < 40 && stats.affection < 20) return 'annoyed';

  // Excited — high affection + happiness
  if (stats.affection > 80 && stats.happiness > 80) return 'glee';
  if (stats.affection > 70 && stats.happiness > 60) return 'happy';

  // Happy
  if (stats.happiness > 80 && stats.hunger > 50) return 'happy';
  if (stats.happiness > 60) return 'focused';

  return 'neutral';
}
