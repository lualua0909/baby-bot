import type { AIState } from '@/types/ai';
import type { CharacterAnimation } from '@/types/animation';
import { STORY_EMOTION_KEYWORDS } from '@/lib/animation/animationMap';

export interface StoryEmotionBeat {
  animation: CharacterAnimation;
  aiState: AIState;
}

export function parseStoryEmotion(text: string): StoryEmotionBeat | null {
  const lower = text.toLowerCase();
  for (const entry of STORY_EMOTION_KEYWORDS) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { animation: entry.animation, aiState: entry.aiState };
    }
  }
  return null;
}

export function splitIntoChunks(text: string): string[] {
  return text
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
