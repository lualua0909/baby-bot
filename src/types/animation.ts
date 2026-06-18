/** Animation clip names bundled with the character GLB */
export type CharacterAnimation =
  | 'Idle'
  | 'Walk'
  | 'Run'
  | 'Jump'
  | 'Jump_Idle'
  | 'Jump_Land'
  | 'Wave'
  | 'Yes'
  | 'No'
  | 'Punch'
  | 'Duck'
  | 'HitReact'
  | 'Death'
  | 'Idle_Gun'
  | 'Run_Gun'
  | 'Walk_Gun'
  | 'Idle_Shoot'
  | 'Run_Shoot';

export const ALL_ANIMATIONS: CharacterAnimation[] = [
  'Idle',
  'Walk',
  'Run',
  'Jump',
  'Jump_Idle',
  'Jump_Land',
  'Wave',
  'Yes',
  'No',
  'Punch',
  'Duck',
  'HitReact',
  'Death',
  'Idle_Gun',
  'Run_Gun',
  'Walk_Gun',
  'Idle_Shoot',
  'Run_Shoot',
];

export interface AnimationTransitionOptions {
  /** Crossfade duration in seconds */
  duration?: number;
  /** Loop the target animation */
  loop?: boolean;
  /** Time scale multiplier */
  timeScale?: number;
}
