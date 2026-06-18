import * as THREE from 'three';
import type { CharacterAnimation, AnimationTransitionOptions } from '@/types/animation';

const DEFAULT_CROSSFADE = 0.35;

/**
 * Controls skeletal animation playback with smooth crossfades.
 * Wraps THREE.AnimationMixer for production use with GLB characters.
 */
export class AnimationController {
  private mixer: THREE.AnimationMixer;
  private actions: Map<string, THREE.AnimationAction> = new Map();
  private currentAction: THREE.AnimationAction | null = null;
  private currentName: CharacterAnimation | null = null;

  constructor(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
    this.mixer = new THREE.AnimationMixer(root);
    for (const clip of clips) {
      const action = this.mixer.clipAction(clip);
      action.clampWhenFinished = true;
      this.actions.set(clip.name, action);
    }
  }

  getMixer(): THREE.AnimationMixer {
    return this.mixer;
  }

  getAvailableAnimations(): string[] {
    return Array.from(this.actions.keys());
  }

  getCurrentAnimation(): CharacterAnimation | null {
    return this.currentName;
  }

  play(name: CharacterAnimation, options: AnimationTransitionOptions = {}): void {
    const { duration = DEFAULT_CROSSFADE, loop = true, timeScale = 1 } = options;

    let action = this.actions.get(name);
    let resolvedName = name;
    if (!action) {
      action = this.actions.get('Idle');
      if (!action) return;
      resolvedName = 'Idle';
    }

    if (this.currentAction === action && this.currentName === resolvedName) {
      return;
    }

    action.reset();
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    action.timeScale = timeScale;
    action.enabled = true;

    if (this.currentAction && this.currentAction !== action) {
      action.crossFadeFrom(this.currentAction, duration, true);
    } else {
      action.fadeIn(duration);
    }

    action.play();
    this.currentAction = action;
    this.currentName = resolvedName;
  }

  playOnce(name: CharacterAnimation, onComplete?: () => void): void {
    const action = this.actions.get(name);
    if (!action) {
      onComplete?.();
      return;
    }

    const handleFinished = (e: THREE.Event & { action?: THREE.AnimationAction }) => {
      if (e.action === action) {
        this.mixer.removeEventListener('finished', handleFinished as (event: THREE.Event) => void);
        this.play('Idle');
        onComplete?.();
      }
    };

    this.mixer.addEventListener('finished', handleFinished as (event: THREE.Event) => void);
    this.play(name, { loop: false });
  }

  update(delta: number): void {
    this.mixer.update(delta);
  }

  dispose(): void {
    this.actions.forEach((action) => action.stop());
    this.actions.clear();
    this.mixer.stopAllAction();
    this.currentAction = null;
    this.currentName = null;
  }
}
