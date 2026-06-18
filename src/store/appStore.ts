import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIState, AppMode, StoryTheme, GameType } from '@/types/ai';
import type { CharacterAnimation } from '@/types/animation';
import { ALL_ANIMATIONS } from '@/types/animation';
import { AI_STATE_ANIMATION_MAP } from '@/lib/animation/animationMap';

export interface AppSettings {
  characterFile: string;
  petName: string;
  soundEnabled: boolean;
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
  lastResponse: string;
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
  setLastResponse: (text: string) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSession: () => void;
}

type AppStore = AppStoreState & AppStoreActions;

const DEFAULT_SETTINGS: AppSettings = {
  characterFile: 'character-1.glb',
  petName: 'Bé Tom',
  soundEnabled: true,
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
      lastResponse: '',
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

      setLastResponse: (lastResponse) => set({ lastResponse }),

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetSession: () =>
        set({
          aiState: 'IDLE',
          currentAnimation: 'Idle',
          overrideAnimation: null,
          isMicActive: false,
          subtitle: '',
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
