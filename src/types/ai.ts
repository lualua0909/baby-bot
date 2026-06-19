import type { IconName } from '@/components/ui/AppIcon';

/** AI conversation states that drive character animations */
export type AIState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'HAPPY'
  | 'SAD'
  | 'EXCITED';

/** Application interaction modes */
export type AppMode = 'home' | 'voice' | 'story' | 'english' | 'singing' | 'game';

/** Story themes available in story mode */
export type StoryTheme = 'princess' | 'dinosaur' | 'superhero' | 'animals' | 'space';

export interface StoryThemeOption {
  id: StoryTheme;
  label: string;
  icon: IconName;
  color: string;
}

export const STORY_THEMES: StoryThemeOption[] = [
  { id: 'princess', label: 'Công chúa', icon: 'princess', color: '#FF69B4' },
  { id: 'dinosaur', label: 'Khủng long', icon: 'dinosaur', color: '#32CD32' },
  { id: 'superhero', label: 'Siêu nhân', icon: 'superhero', color: '#FF4500' },
  { id: 'animals', label: 'Động vật', icon: 'animals', color: '#FFA500' },
  { id: 'space', label: 'Không gian', icon: 'space', color: '#4169E1' },
];

export type GameType = 'guess-animal' | 'guess-color' | 'number-quiz';

export interface GameOption {
  id: GameType;
  label: string;
  icon: IconName;
}

export const GAME_OPTIONS: GameOption[] = [
  { id: 'guess-animal', label: 'Đoán con vật', icon: 'paw' },
  { id: 'guess-color', label: 'Đoán màu sắc', icon: 'palette' },
  { id: 'number-quiz', label: 'Đếm số', icon: 'numbers' },
];
