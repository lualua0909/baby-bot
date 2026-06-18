'use client';

import { useEffect, useLayoutEffect, useRef, useMemo } from 'react';
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

/** Thời lượng hiệu ứng nhân vật "mọc lên" khi mới xuất hiện / đổi nhân vật (giây). */
const ENTRANCE_DURATION = 0.85;
/** Góc xoay vào vị trí khi xuất hiện (radian) — nhân vật xoay ~135° rồi dừng. */
const ENTRANCE_SPIN = Math.PI * 0.75;

/** easeOutBack: bật vượt nhẹ rồi lùi về đúng đích → cảm giác "nảy" sống động. */
function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/** easeOutCubic: vào nhanh, hãm mượt ở cuối — dùng cho xoay & fade. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
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
  // Tiến trình hiệu ứng xuất hiện: t chạy 0→1 trong ENTRANCE_DURATION.
  const entranceRef = useRef({ t: 1, active: false });
  // Bỏ qua hiệu ứng ở lần mount ĐẦU: lúc đó CameraFit còn đo bounding box để căn
  // khung hình, scale tạm 0 sẽ làm camera căn nhầm. Khi ĐỔI character về sau,
  // CameraFit không đo lại (cùng group) nên scale tạm hoàn toàn an toàn.
  const firstMountRef = useRef(true);
  // Vật liệu cần fade-in cùng các giá trị transparent gốc để khôi phục sau.
  const fadeMatsRef = useRef<{ mat: THREE.Material; transparent: boolean }[]>([]);

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

  // Khởi động hiệu ứng "mọc lên" mỗi khi ĐỔI sang nhân vật mới (bỏ qua lần mount
  // đầu — xem firstMountRef). useLayoutEffect để đặt scale=0/opacity=0 NGAY sau
  // commit, trước khung hình kế → không nháy 1 frame nhân vật hiện full size.
  useLayoutEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }
    entranceRef.current.active = true;
    entranceRef.current.t = 0;

    const mats: { mat: THREE.Material; transparent: boolean }[] = [];
    clonedScene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      list.forEach((mat) => {
        mats.push({ mat, transparent: mat.transparent });
        mat.transparent = true;
        mat.opacity = 0;
      });
    });
    fadeMatsRef.current = mats;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(0.0001);
      groupRef.current.rotation.y = config.rotationY - ENTRANCE_SPIN;
    }
  }, [clonedScene, config.rotationY]);

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

    const entrance = entranceRef.current;
    if (entrance.active && groupRef.current) {
      entrance.t = Math.min(1, entrance.t + delta / ENTRANCE_DURATION);
      const t = entrance.t;

      // Scale bật vượt nhẹ; gốc group đặt ở chân (GROUND_Y) nên nhân vật mọc
      // thẳng lên từ mặt đất thay vì phình ra giữa không trung.
      groupRef.current.scale.setScalar(config.scale * easeOutBack(t));
      // Xoay vào đúng hướng đứng cuối cùng.
      const spin = easeOutCubic(t);
      groupRef.current.rotation.y = config.rotationY - ENTRANCE_SPIN * (1 - spin);
      // Fade-in vật liệu trong ~nửa đầu hiệu ứng để hình khối rõ sớm.
      const opacity = easeOutCubic(Math.min(1, t * 2));
      fadeMatsRef.current.forEach(({ mat }) => (mat.opacity = opacity));

      if (t >= 1) {
        entrance.active = false;
        groupRef.current.scale.setScalar(config.scale);
        groupRef.current.rotation.y = config.rotationY;
        fadeMatsRef.current.forEach(({ mat, transparent }) => {
          mat.opacity = 1;
          mat.transparent = transparent;
        });
      }
    }

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

// Preload sẵn cả 3 nhân vật → khi đổi character không phải chờ tải (không lóe
// quả cầu loading), hiệu ứng "mọc lên" chạy mượt ngay tức thì.
useGLTF.preload('/api/character/character-1.glb');
useGLTF.preload('/api/character/character-2.glb');
useGLTF.preload('/api/character/character-3.glb');
