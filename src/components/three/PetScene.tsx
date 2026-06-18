'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { CharacterModel } from './CharacterModel';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import type { AnimationController } from '@/lib/animation/AnimationController';
import type { CharacterAnimation } from '@/types/animation';

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

    const box = new THREE.Box3().setFromObject(target);
    if (box.isEmpty()) return;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const radius = size.length() / 2;

    // Leave room under the feet so the contact shadow isn't clipped, and bias
    // the framing downward so that extra room sits at the bottom.
    const shadowPad = size.y * 0.16;
    const fitHeight = size.y + shadowPad;
    center.y -= shadowPad / 2;

    const aspect = width / height;
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    // Fit by actual box extents so a tall character fills the stage height.
    const distV = fitHeight / 2 / Math.tan(vFov / 2);
    const distH = size.x / 2 / Math.tan(hFov / 2);
    const dist = Math.max(distV, distH) * 1.06; // small margin → pet fills the stage

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
