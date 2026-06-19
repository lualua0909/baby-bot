'use client';

import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import type { AnimationController } from '@/lib/animation/AnimationController';
import type { CharacterAnimation } from '@/types/animation';
import type { Emotion } from '@/lib/emotionEngine';
import type { BodyPart } from './CharacterModel';
import { getCharacterSizeScale } from '@/config/scene3d';

/**
 * Chạm vào từng vùng cơ thể → một cử chỉ (one-shot, tự về Idle) kèm hiệu ứng
 * particle tương ứng. Chỉ dùng các clip one-shot để nhân vật tự nghỉ sau đó.
 */
const BODY_PART_REACTIONS: Record<BodyPart, { animation: CharacterAnimation; emotion: Emotion }> = {
  head: { animation: 'Yes', emotion: 'glee' },
  body: { animation: 'Jump', emotion: 'happy' },
  hands: { animation: 'Punch', emotion: 'surprised' },
};

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
  const characterScale = useAppStore((s) => getCharacterSizeScale(s.settings.characterSize));
  const currentAnimation = useAppStore((s) => s.overrideAnimation ?? s.currentAnimation);
  const restAfterGesture = useAppStore((s) => s.restAfterGesture);
  const setAvailableAnimations = useAppStore((s) => s.setAvailableAnimations);
  const setOverrideAnimation = useAppStore((s) => s.setOverrideAnimation);
  const triggerEmotionBurst = useAppStore((s) => s.triggerEmotionBurst);
  const characterUrl = `/api/character/${encodeURIComponent(characterFile)}`;

  const handleBodyPartClick = useCallback(
    (part: BodyPart) => {
      const { animation, emotion } = BODY_PART_REACTIONS[part];
      setOverrideAnimation(animation);
      triggerEmotionBurst(emotion);
    },
    [setOverrideAnimation, triggerEmotionBurst]
  );

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
        characterScale={characterScale}
        animation={currentAnimation}
        isSpeaking={isSpeaking}
        onLipSyncReady={handleLipSyncReady}
        onControllerReady={(c) => {
          controllerRef.current = c;
          setAvailableAnimations(c.getAvailableAnimations());
        }}
        onGestureEnd={restAfterGesture}
        onSceneReady={handleSceneReady}
        onBodyPartClick={handleBodyPartClick}
      />
    </div>
  );
}
