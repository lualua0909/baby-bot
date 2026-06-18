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
  emoji: string;
  color: string;
}

export const STORY_THEMES: StoryThemeOption[] = [
  { id: 'princess', label: 'Công chúa', emoji: '👸', color: '#FF69B4' },
  { id: 'dinosaur', label: 'Khủng long', emoji: '🦕', color: '#32CD32' },
  { id: 'superhero', label: 'Siêu nhân', emoji: '🦸', color: '#FF4500' },
  { id: 'animals', label: 'Động vật', emoji: '🐾', color: '#FFA500' },
  { id: 'space', label: 'Không gian', emoji: '🚀', color: '#4169E1' },
];

export type GameType = 'guess-animal' | 'guess-color' | 'number-quiz';

export interface GameOption {
  id: GameType;
  label: string;
  emoji: string;
}

export const GAME_OPTIONS: GameOption[] = [
  { id: 'guess-animal', label: 'Đoán con vật', emoji: '🦁' },
  { id: 'guess-color', label: 'Đoán màu sắc', emoji: '🎨' },
  { id: 'number-quiz', label: 'Đếm số', emoji: '🔢' },
];
