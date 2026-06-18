const TARGET_SAMPLE_RATE = 24000;

/** Encode Float32 samples to base64 PCM16 (little-endian) */
export function encodePcm16Base64(samples: Float32Array): string {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Downsample audio buffer to 24kHz mono for OpenAI Realtime */
export function resampleTo24kHz(
  input: Float32Array,
  inputSampleRate: number
): Float32Array {
  if (inputSampleRate === TARGET_SAMPLE_RATE) return input;

  const ratio = inputSampleRate / TARGET_SAMPLE_RATE;
  const outputLength = Math.round(input.length / ratio);
  const output = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i++) {
    const srcIndex = i * ratio;
    const idx = Math.floor(srcIndex);
    const frac = srcIndex - idx;
    const s0 = input[idx] ?? 0;
    const s1 = input[idx + 1] ?? s0;
    output[i] = s0 + (s1 - s0) * frac;
  }

  return output;
}

export { TARGET_SAMPLE_RATE };
