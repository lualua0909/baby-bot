'use client';

import { create } from 'zustand';
import { Emotion, deriveEmotion } from './emotionEngine';

export interface PetState {
  name: string;
  hunger: number;
  happiness: number;
  energy: number;
  affection: number;
  age: number;
  emotion: Emotion;
  lastInteraction: Date;
  createdAt: Date;
  isSleeping: boolean;
}

interface PetActions {
  feed: () => void;
  play: () => void;
  sleep: () => void;
  cuddle: () => void;
  sing: () => void;
  wake: () => void;
  updateStats: (changes: Partial<Pick<PetState, 'hunger' | 'happiness' | 'energy' | 'affection'>>) => void;
  setEmotion: (emotion: Emotion) => void;
  setName: (name: string) => void;
  tick: () => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  applyTimeDecay: () => void;
}

type PetStore = PetState & PetActions;

const DEFAULT_STATE: PetState = {
  name: 'Aura',
  hunger: 70,
  happiness: 60,
  energy: 80,
  affection: 30,
  age: 0,
  emotion: 'neutral',
  lastInteraction: new Date(),
  createdAt: new Date(),
  isSleeping: false,
};

const STORAGE_KEY = 'aura-pet-state';

const clamp = (val: number, min = 0, max = 100) => Math.max(min, Math.min(max, val));

function calculateAge(createdAt: Date): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
}

export const usePetStore = create<PetStore>((set, get) => ({
  ...DEFAULT_STATE,

  feed: () => {
    set((s) => {
      const hunger = clamp(s.hunger + 25);
      const happiness = clamp(s.happiness + 5);
      const state = { ...s, hunger, happiness, lastInteraction: new Date() };
      return { ...state, emotion: deriveEmotion(state) };
    });
    get().saveToStorage();
  },

  play: () => {
    set((s) => {
      const happiness = clamp(s.happiness + 20);
      const energy = clamp(s.energy - 15);
      const hunger = clamp(s.hunger - 10);
      const affection = clamp(s.affection + 5);
      const state = { ...s, happiness, energy, hunger, affection, lastInteraction: new Date() };
      return { ...state, emotion: deriveEmotion(state) };
    });
    get().saveToStorage();
  },

  sleep: () => {
    set((s) => ({
      ...s,
      isSleeping: true,
      emotion: 'sleeping' as Emotion,
      lastInteraction: new Date(),
    }));
    get().saveToStorage();
  },

  wake: () => {
    set((s) => {
      const energy = clamp(s.energy + 40);
      const state = { ...s, energy, isSleeping: false, lastInteraction: new Date() };
      return { ...state, emotion: deriveEmotion(state) };
    });
    get().saveToStorage();
  },

  cuddle: () => {
    set((s) => {
      const affection = clamp(s.affection + 15);
      const happiness = clamp(s.happiness + 10);
      const state = { ...s, affection, happiness, lastInteraction: new Date() };
      return { ...state, emotion: deriveEmotion(state) };
    });
    get().saveToStorage();
  },

  sing: () => {
    set((s) => {
      const happiness = clamp(s.happiness + 15);
      const affection = clamp(s.affection + 8);
      const energy = clamp(s.energy - 5);
      const state = { ...s, happiness, affection, energy, lastInteraction: new Date() };
      return { ...state, emotion: deriveEmotion(state) };
    });
    get().saveToStorage();
  },

  updateStats: (changes) => {
    set((s) => {
      const hunger = changes.hunger !== undefined ? clamp(s.hunger + changes.hunger) : s.hunger;
      const happiness = changes.happiness !== undefined ? clamp(s.happiness + changes.happiness) : s.happiness;
      const energy = changes.energy !== undefined ? clamp(s.energy + changes.energy) : s.energy;
      const affection = changes.affection !== undefined ? clamp(s.affection + changes.affection) : s.affection;
      const state = { ...s, hunger, happiness, energy, affection };
      return { ...state, emotion: deriveEmotion(state) };
    });
    get().saveToStorage();
  },

  setEmotion: (emotion) => {
    set({ emotion });
    get().saveToStorage();
  },

  setName: (name) => {
    set({ name });
    get().saveToStorage();
  },

  tick: () => {
    set((s) => {
      if (s.isSleeping) {
        const energy = clamp(s.energy + 0.5);
        const hunger = clamp(s.hunger - 0.1);
        return { energy, hunger };
      }
      const hunger = clamp(s.hunger - 0.08);
      const energy = clamp(s.energy - 0.05);
      const happiness = clamp(s.happiness - 0.03);
      const state = { ...s, hunger, energy, happiness };
      return { hunger, energy, happiness, emotion: deriveEmotion(state) };
    });
  },

  applyTimeDecay: () => {
    set((s) => {
      const hoursPassed =
        (Date.now() - new Date(s.lastInteraction).getTime()) / (1000 * 60 * 60);
      if (hoursPassed < 0.1) return s;

      const decayFactor = Math.min(hoursPassed, 48);
      const hunger = clamp(s.hunger - decayFactor * 2);
      const energy = clamp(s.energy - decayFactor * 1.5);
      const happiness = clamp(s.happiness - decayFactor * 1);
      const affection = clamp(s.affection - decayFactor * 0.3);
      const age = calculateAge(s.createdAt);
      const state = { ...s, hunger, energy, happiness, affection, age };
      return { ...state, emotion: deriveEmotion(state) };
    });
  },

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.lastInteraction = new Date(parsed.lastInteraction);
        parsed.createdAt = new Date(parsed.createdAt);
        set(parsed);
      }
    } catch {
      // Use defaults
    }
  },

  saveToStorage: () => {
    if (typeof window === 'undefined') return;
    try {
      const state = get();
      const toSave: PetState = {
        name: state.name,
        hunger: state.hunger,
        happiness: state.happiness,
        energy: state.energy,
        affection: state.affection,
        age: state.age,
        emotion: state.emotion,
        lastInteraction: state.lastInteraction,
        createdAt: state.createdAt,
        isSleeping: state.isSleeping,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Ignore storage errors
    }
  },
}));
