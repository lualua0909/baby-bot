'use client';

import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import type { AnimationController } from '@/lib/animation/AnimationController';

const PetScene = dynamic(() => import('./PetScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <span className="text-5xl animate-bounce">🐾</span>
      <div className="text-lg font-extrabold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)] animate-pulse">Đang tải bạn thú...</div>
    </div>
  ),
});

interface PetCanvasProps {
  isSpeaking: boolean;
  lipSyncRef?: React.MutableRefObject<LipSyncManager | null>;
}

export default function PetCanvas({ isSpeaking, lipSyncRef }: PetCanvasProps) {
  const characterFile = useAppStore((s) => s.settings.characterFile);
  const currentAnimation = useAppStore((s) => s.overrideAnimation ?? s.currentAnimation);
  const restAfterGesture = useAppStore((s) => s.restAfterGesture);
  const setAvailableAnimations = useAppStore((s) => s.setAvailableAnimations);
  const characterUrl = `/api/character/${encodeURIComponent(characterFile)}`;

  const internalLipSyncRef = useRef<LipSyncManager | null>(null);
  const controllerRef = useRef<AnimationController | null>(null);

  const handleLipSyncReady = useCallback(
    (lipSync: LipSyncManager) => {
      internalLipSyncRef.current = lipSync;
      if (lipSyncRef) lipSyncRef.current = lipSync;
    },
    [lipSyncRef]
  );

  return (
    <div className="absolute inset-0">
      <PetScene
        characterUrl={characterUrl}
        animation={currentAnimation}
        isSpeaking={isSpeaking}
        onLipSyncReady={handleLipSyncReady}
        onControllerReady={(c) => {
          controllerRef.current = c;
          setAvailableAnimations(c.getAvailableAnimations());
        }}
        onGestureEnd={restAfterGesture}
      />
    </div>
  );
}
