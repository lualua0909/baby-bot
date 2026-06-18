import * as THREE from 'three';

const MOUTH_BLENDSHAPES = [
  'mouthOpen',
  'MouthOpen',
  'mouth_open',
  'jawOpen',
  'JawOpen',
  'viseme_aa',
  'viseme_O',
  'viseme_E',
];

const MOUTH_CLOSE_BLENDSHAPES = ['mouthClose', 'MouthClose', 'mouth_close'];

interface MorphMesh {
  mesh: THREE.SkinnedMesh | THREE.Mesh;
  openIndex: number;
  closeIndex: number | null;
}

/**
 * Drives lip sync via morph targets when available,
 * otherwise fakes mouth movement from audio amplitude.
 */
export class LipSyncManager {
  private morphMeshes: MorphMesh[] = [];
  private fakeJawBone: THREE.Bone | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private smoothedAmplitude = 0;
  private readonly smoothing = 0.35;

  initialize(root: THREE.Object3D): void {
    this.morphMeshes = [];
    this.fakeJawBone = null;

    root.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh || (child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.SkinnedMesh | THREE.Mesh;
        const influences = mesh.morphTargetDictionary;
        const morphInfluences = mesh.morphTargetInfluences;

        if (influences && morphInfluences) {
          const openKey = MOUTH_BLENDSHAPES.find((k) => k in influences);
          if (openKey !== undefined) {
            const closeKey = MOUTH_CLOSE_BLENDSHAPES.find((k) => k in influences) ?? null;
            this.morphMeshes.push({
              mesh,
              openIndex: influences[openKey],
              closeIndex: closeKey ? influences[closeKey] : null,
            });
          }
        }
      }

      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const name = bone.name.toLowerCase();
        if (!this.fakeJawBone && (name.includes('jaw') || name.includes('mouth'))) {
          this.fakeJawBone = bone;
        }
      }
    });
  }

  connectAudio(audioContext: AudioContext, source: AudioNode): void {
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    source.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  disconnect(): void {
    this.analyser = null;
    this.dataArray = null;
    this.smoothedAmplitude = 0;
    this.resetMouth();
  }

  private getAmplitude(): number {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const raw = sum / (this.dataArray.length * 255);
    this.smoothedAmplitude += (raw - this.smoothedAmplitude) * this.smoothing;
    return Math.min(1, this.smoothedAmplitude * 2.5);
  }

  update(): void {
    const amp = this.getAmplitude();

    if (this.morphMeshes.length > 0) {
      for (const { mesh, openIndex, closeIndex } of this.morphMeshes) {
        const influences = mesh.morphTargetInfluences;
        if (!influences) continue;
        influences[openIndex] = amp;
        if (closeIndex !== null) {
          influences[closeIndex] = 1 - amp;
        }
      }
    } else if (this.fakeJawBone) {
      this.fakeJawBone.rotation.x = amp * 0.25;
    }
  }

  resetMouth(): void {
    for (const { mesh, openIndex, closeIndex } of this.morphMeshes) {
      const influences = mesh.morphTargetInfluences;
      if (!influences) continue;
      influences[openIndex] = 0;
      if (closeIndex !== null) influences[closeIndex] = 1;
    }
    if (this.fakeJawBone) {
      this.fakeJawBone.rotation.x = 0;
    }
  }

  hasMorphTargets(): boolean {
    return this.morphMeshes.length > 0;
  }
}
