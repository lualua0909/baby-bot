import type { AIState } from '@/types/ai';
import type { CharacterAnimation } from '@/types/animation';

/** Maps AI states to default character animations */
export const AI_STATE_ANIMATION_MAP: Record<AIState, CharacterAnimation> = {
  IDLE: 'Idle',
  LISTENING: 'Idle',
  THINKING: 'Idle',
  SPEAKING: 'Wave',
  HAPPY: 'Yes',
  SAD: 'No',
  EXCITED: 'Run',
};

/** Keyword → animation for story mode emotional beats */
export const STORY_EMOTION_KEYWORDS: Array<{
  keywords: string[];
  animation: CharacterAnimation;
  aiState: AIState;
}> = [
  { keywords: ['chào', 'hello', 'xin chào', 'hi'], animation: 'Wave', aiState: 'SPEAKING' },
  { keywords: ['vui', 'happy', 'haha', 'cười', 'yay', 'tuyệt'], animation: 'Yes', aiState: 'HAPPY' },
  { keywords: ['buồn', 'sad', 'khóc', 'cry', 'tiếc'], animation: 'No', aiState: 'SAD' },
  { keywords: ['chạy', 'run', 'nhanh', 'fast', 'bay', 'fly'], animation: 'Run', aiState: 'EXCITED' },
  { keywords: ['nhảy', 'jump', 'bounce'], animation: 'Jump', aiState: 'EXCITED' },
  { keywords: ['đánh', 'punch', 'fight', 'đấm'], animation: 'Punch', aiState: 'EXCITED' },
];

/** Singing mode alternates between these animations */
export const SINGING_ANIMATIONS: CharacterAnimation[] = ['Wave', 'Idle', 'Yes'];

/**
 * Gesture clips that should play exactly once and then return to Idle,
 * instead of looping forever (e.g. HAPPY→Yes nod, SAD→No shake).
 * Looping clips like Idle/Wave/Run are intentionally excluded.
 */
export const ONE_SHOT_ANIMATIONS: CharacterAnimation[] = ['Yes', 'No', 'Jump', 'Punch'];
