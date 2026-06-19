import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIState, AppMode, StoryTheme, GameType } from '@/types/ai';
import type { CharacterAnimation } from '@/types/animation';
import type { Emotion } from '@/lib/emotionEngine';
import { ALL_ANIMATIONS } from '@/types/animation';
import { AI_STATE_ANIMATION_MAP } from '@/lib/animation/animationMap';
import type { CharacterSize } from '@/config/scene3d';

export interface AppSettings {
  characterFile: string;
  floorFile: string;
  petName: string;
  soundEnabled: boolean;
  /** Kích cỡ hiển thị của nhân vật (Large = mặc định, giữ nguyên). */
  characterSize: CharacterSize;
}

interface AppStoreState {
  coins: number;
  level: number;
  levelProgress: number;
  aiState: AIState;
  currentAnimation: CharacterAnimation;
  overrideAnimation: CharacterAnimation | null;
  /** Animation clips auto-detected from the loaded GLB. */
  availableAnimations: string[];
  appMode: AppMode;
  activeStoryTheme: StoryTheme | null;
  activeGame: GameType | null;
  isSettingsOpen: boolean;
  isMicActive: boolean;
  subtitle: string;
  /** Văn bản người dùng vừa nói qua mic (interim + final), hiển thị cạnh nút mic. */
  userTranscript: string;
  lastResponse: string;
  /** Transient particle burst shown when the user taps a body part (null = none). */
  emotionBurst: Emotion | null;
  settings: AppSettings;
}

interface AppStoreActions {
  setAIState: (state: AIState) => void;
  setAnimation: (animation: CharacterAnimation) => void;
  setOverrideAnimation: (animation: CharacterAnimation | null) => void;
  setAvailableAnimations: (names: string[]) => void;
  syncAnimationFromAIState: () => void;
  restAfterGesture: () => void;
  setAppMode: (mode: AppMode) => void;
  setStoryTheme: (theme: StoryTheme | null) => void;
  setActiveGame: (game: GameType | null) => void;
  addCoins: (amount: number) => void;
  setLevel: (level: number) => void;
  addLevelProgress: (amount: number) => void;
  setSettingsOpen: (open: boolean) => void;
  setMicActive: (active: boolean) => void;
  setSubtitle: (text: string) => void;
  setUserTranscript: (text: string) => void;
  setLastResponse: (text: string) => void;
  triggerEmotionBurst: (emotion: Emotion) => void;
  clearEmotionBurst: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSession: () => void;
}

type AppStore = AppStoreState & AppStoreActions;

const DEFAULT_SETTINGS: AppSettings = {
  characterFile: 'character-1.glb',
  floorFile: 'Beach.glb',
  petName: 'Bé Tom',
  soundEnabled: true,
  characterSize: 'large',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      coins: 100,
      level: 1,
      levelProgress: 0,
      aiState: 'IDLE',
      currentAnimation: 'Idle',
      overrideAnimation: null,
      availableAnimations: ALL_ANIMATIONS,
      appMode: 'home',
      activeStoryTheme: null,
      activeGame: null,
      isSettingsOpen: false,
      isMicActive: false,
      subtitle: '',
      userTranscript: '',
      lastResponse: '',
      emotionBurst: null,
      settings: DEFAULT_SETTINGS,

      setAIState: (aiState) => {
        set({ aiState });
        get().syncAnimationFromAIState();
      },

      setAnimation: (currentAnimation) => set({ currentAnimation, overrideAnimation: currentAnimation }),

      setOverrideAnimation: (overrideAnimation) => set({ overrideAnimation }),

      setAvailableAnimations: (availableAnimations) =>
        set({ availableAnimations: availableAnimations.length ? availableAnimations : ALL_ANIMATIONS }),

      syncAnimationFromAIState: () => {
        const { aiState, overrideAnimation } = get();
        if (overrideAnimation) return;
        const mapped = AI_STATE_ANIMATION_MAP[aiState];
        set({ currentAnimation: mapped });
      },

      /**
       * Called when a one-shot gesture (Yes/No/...) finishes playing.
       * Returns the pet to a resting Idle: clears any override and resets
       * transient emotional states so the gesture doesn't loop forever.
       */
      restAfterGesture: () =>
        set((s) => ({
          overrideAnimation: null,
          currentAnimation: 'Idle',
          aiState:
            s.aiState === 'HAPPY' || s.aiState === 'SAD' || s.aiState === 'EXCITED'
              ? 'IDLE'
              : s.aiState,
        })),

      setAppMode: (appMode) => set({ appMode }),

      setStoryTheme: (activeStoryTheme) => set({ activeStoryTheme }),

      setActiveGame: (activeGame) => set({ activeGame }),

      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),

      setLevel: (level) => set({ level }),

      addLevelProgress: (amount) =>
        set((s) => {
          const next = s.levelProgress + amount;
          if (next >= 100) {
            return { level: s.level + 1, levelProgress: next - 100 };
          }
          return { levelProgress: next };
        }),

      setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),

      setMicActive: (isMicActive) => set({ isMicActive }),

      setSubtitle: (subtitle) => set({ subtitle }),

      setUserTranscript: (userTranscript) => set({ userTranscript }),

      setLastResponse: (lastResponse) => set({ lastResponse }),

      triggerEmotionBurst: (emotion) => set({ emotionBurst: emotion }),

      clearEmotionBurst: () => set({ emotionBurst: null }),

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetSession: () =>
        set({
          aiState: 'IDLE',
          currentAnimation: 'Idle',
          overrideAnimation: null,
          isMicActive: false,
          subtitle: '',
          userTranscript: '',
          activeStoryTheme: null,
          activeGame: null,
        }),
    }),
    {
      name: 'aura-kids-store',
      partialize: (state) => ({
        coins: state.coins,
        level: state.level,
        levelProgress: state.levelProgress,
        settings: state.settings,
      }),
    }
  )
);

export function getCharacterUrl(filename: string): string {
  return `/api/character/${encodeURIComponent(filename)}`;
}
