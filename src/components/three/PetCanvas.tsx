'use client';

import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import type { AnimationController } from '@/lib/animation/AnimationController';

const PetScene = dynamic(() => import('./PetScene'), {
  ssr: false,
  loading: () => null,
});

interface PetCanvasProps {
  isSpeaking: boolean;
  lipSyncRef?: React.MutableRefObject<LipSyncManager | null>;
  onSceneReady?: () => void;
}

export default function PetCanvas({ isSpeaking, lipSyncRef, onSceneReady }: PetCanvasProps) {
  const characterFile = useAppStore((s) => s.settings.characterFile);
  const floorFile = useAppStore((s) => s.settings.floorFile);
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

  const handleSceneReady = useCallback(() => {
    onSceneReady?.();
  }, [onSceneReady]);

  return (
    <div className="absolute inset-0">
      <PetScene
        characterUrl={characterUrl}
        floorFile={floorFile}
        animation={currentAnimation}
        isSpeaking={isSpeaking}
        onLipSyncReady={handleLipSyncReady}
        onControllerReady={(c) => {
          controllerRef.current = c;
          setAvailableAnimations(c.getAvailableAnimations());
        }}
        onGestureEnd={restAfterGesture}
        onSceneReady={handleSceneReady}
      />
    </div>
  );
}
