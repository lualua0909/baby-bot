import type { AIState } from '@/types/ai';

type StateTransition = {
  from: AIState;
  to: AIState;
  trigger: string;
};

const VALID_TRANSITIONS: StateTransition[] = [
  { from: 'IDLE', to: 'LISTENING', trigger: 'mic_start' },
  { from: 'LISTENING', to: 'THINKING', trigger: 'transcript_final' },
  { from: 'THINKING', to: 'SPEAKING', trigger: 'tts_start' },
  { from: 'SPEAKING', to: 'IDLE', trigger: 'tts_end' },
  { from: 'IDLE', to: 'SPEAKING', trigger: 'auto_speak' },
  { from: 'SPEAKING', to: 'HAPPY', trigger: 'positive' },
  { from: 'SPEAKING', to: 'SAD', trigger: 'negative' },
  { from: 'SPEAKING', to: 'EXCITED', trigger: 'excited' },
  { from: 'HAPPY', to: 'IDLE', trigger: 'reset' },
  { from: 'SAD', to: 'IDLE', trigger: 'reset' },
  { from: 'EXCITED', to: 'IDLE', trigger: 'reset' },
  { from: 'THINKING', to: 'IDLE', trigger: 'error' },
  { from: 'LISTENING', to: 'IDLE', trigger: 'cancel' },
];

/**
 * Lightweight AI state machine for coordinating voice + animation flows.
 * Validates transitions and emits the next state.
 */
export class AIStateMachine {
  private currentState: AIState = 'IDLE';

  getState(): AIState {
    return this.currentState;
  }

  canTransition(to: AIState, trigger: string): boolean {
    return VALID_TRANSITIONS.some(
      (t) => t.from === this.currentState && t.to === to && t.trigger === trigger
    );
  }

  transition(to: AIState, trigger: string): AIState {
    if (!this.canTransition(to, trigger)) {
      if (['HAPPY', 'SAD', 'EXCITED'].includes(to) && ['SPEAKING', 'IDLE'].includes(this.currentState)) {
        this.currentState = to;
        return this.currentState;
      }
      return this.currentState;
    }
    this.currentState = to;
    return this.currentState;
  }

  forceState(state: AIState): void {
    this.currentState = state;
  }

  reset(): void {
    this.currentState = 'IDLE';
  }
}

export const aiStateMachine = new AIStateMachine();
