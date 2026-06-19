'use client';

import { useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
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

/** Vùng cơ thể nhân vật được chạm vào (phân theo độ cao của điểm click). */
export type BodyPart = 'head' | 'body' | 'hands';

/** Quãng di chuyển con trỏ (px) tối đa vẫn coi là "chạm" thay vì kéo xoay camera. */
const CLICK_DRAG_THRESHOLD = 6;

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
  /** Người dùng chạm vào nhân vật; part được suy ra từ độ cao điểm chạm. */
  onBodyPartClick?: (part: BodyPart) => void;
  /**
   * Cao độ mặt sàn thật tại (x,z) của nhân vật (raycast từ PetScene). Dùng cho
   * position.y để chân đứng đúng trên mặt cát dù bãi biển không phẳng; chưa đo
   * được thì rơi về config.position[1] (GROUND_Y).
   */
  groundY?: number;
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
  onBodyPartClick,
  groundY,
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

  // Cao độ ĐÁY (min.y) của model ở BIND POSE, tính từ boundingBox geometry từng
  // mesh (ổn định với cả skinned mesh — xem boundingBoxForFraming ở PetScene).
  // Mỗi model có pivot khác nhau: char-1 chân nằm ngay gốc (≈0) nên đặt thẳng là
  // chạm sàn, còn char-2/3 pivot nằm TRÊN chân (đáy < 0) nên không bù sẽ chìm
  // xuống dưới mặt sàn. Dời primitive lên -bottom để chân về đúng gốc group
  // (local y = 0), nhờ vậy group ở GROUND_Y là chân chạm sàn và scale "mọc lên"
  // vẫn nảy từ chân.
  const footOffset = useMemo(() => {
    const box = new THREE.Box3();
    const tmp = new THREE.Box3();
    clonedScene.updateWorldMatrix(true, true);
    clonedScene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      if (!mesh.geometry.boundingBox) return;
      tmp.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
      box.union(tmp);
    });
    return box.isEmpty() ? 0 : -box.min.y;
  }, [clonedScene]);

  // Hộp bao BIND POSE trong hệ toạ độ riêng của clonedScene — dùng để quy đổi
  // điểm chạm (world) về độ cao chuẩn hoá 0..1 nhằm phân vùng đầu/mình/tay.
  const bounds = useMemo(() => {
    const box = new THREE.Box3();
    const tmp = new THREE.Box3();
    clonedScene.updateWorldMatrix(true, true);
    clonedScene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      if (!mesh.geometry.boundingBox) return;
      tmp.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
      box.union(tmp);
    });
    return box;
  }, [clonedScene]);

  // Vị trí con trỏ lúc nhấn xuống, để phân biệt "chạm" với "kéo xoay" camera.
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      const down = pointerDownRef.current;
      pointerDownRef.current = null;
      // Bỏ qua nếu là thao tác kéo xoay camera (con trỏ di chuyển nhiều).
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > CLICK_DRAG_THRESHOLD) {
        return;
      }
      if (!onBodyPartClick || bounds.isEmpty()) return;
      e.stopPropagation();

      // Đưa điểm chạm về hệ toạ độ clonedScene (trùng hệ của bounds).
      const local = clonedScene.worldToLocal(e.point.clone());
      const ny = (local.y - bounds.min.y) / (bounds.max.y - bounds.min.y || 1);
      const halfW = (bounds.max.x - bounds.min.x) / 2 || 1;
      const cx = (bounds.max.x + bounds.min.x) / 2;
      const nx = Math.abs(local.x - cx) / halfW;

      let part: BodyPart;
      if (ny >= 0.72) part = 'head';
      else if (nx >= 0.55 && ny >= 0.3) part = 'hands';
      else part = 'body';
      onBodyPartClick(part);
    },
    [bounds, clonedScene, onBodyPartClick]
  );

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
      position={[config.position[0], groundY ?? config.position[1], config.position[2]]}
      rotation={[0, config.rotationY, 0]}
      scale={config.scale}
    >
      <primitive
        object={clonedScene}
        position={[0, footOffset, 0]}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
    </group>
  );
}

// Preload sẵn cả 3 nhân vật → khi đổi character không phải chờ tải (không lóe
// quả cầu loading), hiệu ứng "mọc lên" chạy mượt ngay tức thì.
useGLTF.preload('/api/character/character-1.glb');
useGLTF.preload('/api/character/character-2.glb');
useGLTF.preload('/api/character/character-3.glb');
