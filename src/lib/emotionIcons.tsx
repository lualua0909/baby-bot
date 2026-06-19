import type { Emotion } from '@/lib/emotionEngine';
import type { IconName } from '@/components/ui/AppIcon';

export const EMOTION_ICON_NAMES: Record<Emotion, IconName> = {
  neutral: 'moon',
  blink_high: 'moon',
  happy: 'joy',
  glee: 'sparkles',
  blink_low: 'moon',
  sad_down: 'heart',
  sad_up: 'heart',
  worried: 'cloud',
  focused: 'settings',
  annoyed: 'angry',
  surprised: 'star',
  skeptic: 'settings',
  frustrated: 'angry',
  unimpressed: 'moon',
  sleepy: 'sleep',
  suspicious: 'settings',
  squint: 'moon',
  angry: 'angry',
  furious: 'flame',
  scared: 'moon',
  awe: 'sparkles',
  sleeping: 'sleep',
};
