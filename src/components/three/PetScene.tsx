'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterModel } from './CharacterModel';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import type { AnimationController } from '@/lib/animation/AnimationController';
import type { CharacterAnimation } from '@/types/animation';
import { DEFAULT_FLOOR, GROUND_Y } from '@/config/scene3d';

interface PetSceneProps {
  characterUrl: string;
  animation: CharacterAnimation;
  isSpeaking: boolean;
  onLipSyncReady?: (lipSync: LipSyncManager) => void;
  onControllerReady?: (controller: AnimationController) => void;
  onGestureEnd?: () => void;
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#FFD93D" wireframe />
    </mesh>
  );
}

/**
 * Mặt sàn 3D: tự canh tâm về gốc toạ độ (để nhân vật đứng chính giữa, không
 * lệch), phóng to lấp đầy màn hình, và đặt bề mặt ngang mốc chân (GROUND_Y).
 * Thông số riêng của từng sàn lấy từ config (xem src/config/scene3d.ts).
 */
function BeachFloor() {
  const { scene } = useGLTF(DEFAULT_FLOOR.url);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) mesh.receiveShadow = true;
    });
    return clone;
  }, [scene]);

  const { scale, position } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = DEFAULT_FLOOR.footprint / Math.max(size.x, size.z);

    // Dò cao độ MẶT CÁT: lấy y của vertex xa tâm nhất (mép bãi biển), tránh
    // canh nhầm theo ngọn cây dừa (điểm cao nhất của model).
    let maxR = -1;
    let sandY = box.max.y;
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const pos = mesh.isMesh ? mesh.geometry?.attributes?.position : undefined;
      if (!pos) return;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const r = Math.hypot(x, z);
        if (r > maxR) {
          maxR = r;
          sandY = pos.getY(i);
        }
      }
    });

    return {
      scale: s,
      // Tâm về gốc trên trục X/Z; mặt cát canh về mốc chân (GROUND_Y).
      position: [-center.x * s, GROUND_Y - sandY * s, -center.z * s] as [number, number, number],
    };
  }, [cloned]);

  return (
    <group rotation={[0, DEFAULT_FLOOR.rotationY, 0]}>
      <primitive object={cloned} scale={scale} position={position} />
    </group>
  );
}

useGLTF.preload(DEFAULT_FLOOR.url);

/**
 * Bounding box dùng để frame camera. Chỉ gộp các mesh KHÔNG phải skinned
 * (thân, đầu, tay/chân cứng) — chiếm gần như toàn thân — để có khung ổn định.
 * Skinned mesh (vd bàn tay) bị bỏ qua vì geometry boundingBox của nó nằm trong
 * không gian bind, có thể phình rất to làm camera zoom xa → nhân vật tí hon.
 */
function boundingBoxForFraming(target: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  target.updateWorldMatrix(true, true);
  target.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || (mesh as THREE.SkinnedMesh).isSkinnedMesh) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    if (!mesh.geometry.boundingBox) return;
    tmp.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
    box.union(tmp);
  });
  // Fallback nếu model toàn skinned mesh.
  if (box.isEmpty()) box.setFromObject(target);
  return box;
}

/**
 * Frames the camera to the whole character on load and re-fits on resize,
 * so the full body is always visible on any aspect ratio (desktop + mobile).
 */
function CameraFit({ target }: { target: THREE.Group | null }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as
    | (THREE.EventDispatcher & { target: THREE.Vector3; update: () => void })
    | null;
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);

  useEffect(() => {
    if (!target) return;

    const box = boundingBoxForFraming(target);
    if (box.isEmpty()) return;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const radius = size.length() / 2;

    // Leave room under the feet for the contact shadow, generous room above the
    // head for tall motions (Jump), and side room for lateral motions (Run) so
    // the character is never clipped while animating.
    const bottomPad = size.y * 0.12;
    const topPad = size.y * 0.24;
    const sidePad = size.x * 0.15;
    const fitHeight = size.y + bottomPad + topPad;
    const fitWidth = size.x + sidePad * 2;
    // Recentre the framed region so the extra headroom sits above the character.
    center.y += (topPad - bottomPad) / 2;

    const aspect = width / height;
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    // Fit by padded extents so the whole character + motion range stays visible.
    const distV = fitHeight / 2 / Math.tan(vFov / 2);
    const distH = fitWidth / 2 / Math.tan(hFov / 2);
    const dist = Math.max(distV, distH) * 1.04;

    // Look from slightly above & in front, like the reference.
    const dir = new THREE.Vector3(0, 0.1, 1).normalize();
    camera.position.copy(center).add(dir.multiplyScalar(dist));
    camera.near = Math.max(0.1, dist - radius * 3);
    camera.far = dist + radius * 4;
    camera.updateProjectionMatrix();

    if (controls) {
      controls.target.copy(center);
      controls.update();
    } else {
      camera.lookAt(center);
    }
  }, [target, width, height, camera, controls]);

  return null;
}

function SceneContent({
  characterUrl,
  animation,
  isSpeaking,
  onLipSyncReady,
  onControllerReady,
  onGestureEnd,
}: PetSceneProps) {
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  if (error) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial color="#FF6B9D" />
      </mesh>
    );
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-3, 4, 2]} intensity={0.4} color="#FFE66D" />

      <Suspense fallback={<LoadingFallback />}>
        <CharacterModel
          url={characterUrl}
          animation={animation}
          lipSyncManager={null}
          isSpeaking={isSpeaking}
          onLoaded={(controller, lipSync) => {
            onControllerReady?.(controller);
            onLipSyncReady?.(lipSync);
          }}
          onModelReady={setModel}
          onGestureEnd={onGestureEnd}
          onError={setError}
        />
      </Suspense>

      {/* Bãi biển 3D làm mặt sàn quanh nhân vật. */}
      <Suspense fallback={null}>
        <BeachFloor />
      </Suspense>

      <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={8} blur={2} />
      <Environment preset="apartment" />
      <CameraFit target={model} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

export default function PetScene(props: PetSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.4, 5.0], fov: 40 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}
