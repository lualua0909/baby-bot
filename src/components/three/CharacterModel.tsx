'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clone as cloneWithSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AnimationController } from '@/lib/animation/AnimationController';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import { ONE_SHOT_ANIMATIONS } from '@/lib/animation/animationMap';
import type { CharacterAnimation } from '@/types/animation';
import { getCharacterConfig } from '@/config/scene3d';

/** Lấy tên file .glb từ URL phục vụ character (vd /api/character/character-1.glb). */
function fileNameFromUrl(url: string): string {
  return decodeURIComponent(url.split('/').pop() ?? '');
}

interface CharacterModelProps {
  url: string;
  animation: CharacterAnimation;
  lipSyncManager: LipSyncManager | null;
  isSpeaking: boolean;
  onLoaded?: (controller: AnimationController, lipSync: LipSyncManager) => void;
  onModelReady?: (group: THREE.Group) => void;
  onGestureEnd?: () => void;
  onError?: (error: string) => void;
}

export function CharacterModel({
  url,
  animation,
  lipSyncManager,
  isSpeaking,
  onLoaded,
  onModelReady,
  onGestureEnd,
  onError,
}: CharacterModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const controllerRef = useRef<AnimationController | null>(null);
  const localLipSyncRef = useRef<LipSyncManager | null>(null);
  const prevAnimationRef = useRef<CharacterAnimation | null>(null);

  const { scene, animations } = useGLTF(url, true);
  const config = useMemo(() => getCharacterConfig(fileNameFromUrl(url)), [url]);

  const clonedScene = useMemo(() => {
    // SkeletonUtils.clone clone đúng cả skeleton → skinned mesh (bàn tay) bám
    // vào xương của BẢN CLONE (xương được mixer animate). scene.clone(true) để
    // skinned mesh trỏ về xương GỐC (không bao giờ được animate) nên tay đứng im.
    const clone = cloneWithSkeleton(scene) as THREE.Object3D;
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    if (!groupRef.current) return;

    try {
      const controller = new AnimationController(groupRef.current, animations);
      controllerRef.current = controller;

      const lipSync = lipSyncManager ?? new LipSyncManager();
      lipSync.initialize(groupRef.current);
      localLipSyncRef.current = lipSync;

      controller.play('Idle');
      onLoaded?.(controller, lipSync);
      onModelReady?.(groupRef.current);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to init animations');
    }

    return () => {
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, [animations, onLoaded, onModelReady, onError, lipSyncManager]);

  useEffect(() => {
    if (!controllerRef.current) return;
    if (prevAnimationRef.current === animation) return;
    prevAnimationRef.current = animation;
    if (ONE_SHOT_ANIMATIONS.includes(animation)) {
      // Play once, then AnimationController returns to Idle; let the app rest.
      controllerRef.current.playOnce(animation, () => onGestureEnd?.());
    } else {
      controllerRef.current.play(animation);
    }
  }, [animation, onGestureEnd]);

  useFrame((_, delta) => {
    controllerRef.current?.update(delta);
    if (isSpeaking) {
      localLipSyncRef.current?.update();
    } else {
      localLipSyncRef.current?.resetMouth();
    }
  });

  return (
    // Cả khung xương lẫn cánh tay (skinned) nằm trong CÙNG 1 group này, nên
    // xoay group là xoay toàn bộ nhân vật đồng bộ.
    <group
      ref={groupRef}
      position={config.position}
      rotation={[0, config.rotationY, 0]}
      scale={config.scale}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload('/api/character/character-1.glb');
