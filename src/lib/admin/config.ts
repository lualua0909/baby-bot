import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import {
  type AdminConfig,
  REALTIME_MODEL_CHEAP,
  TRANSCRIPTION_MODEL_CHEAP,
} from '@/types/admin';

const CONFIG_DIR = path.join(process.cwd(), 'data');
const CONFIG_PATH = path.join(CONFIG_DIR, 'admin-config.json');

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  sttProvider: 'web-speech',
  ttsProvider: 'openai-tts',
  realtimeModel: REALTIME_MODEL_CHEAP,
  transcriptionModel: TRANSCRIPTION_MODEL_CHEAP,
  updatedAt: new Date().toISOString(),
};

/** Read admin config from disk; falls back to defaults */
export async function readAdminConfig(): Promise<AdminConfig> {
  try {
    const raw = await readFile(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<AdminConfig>;
    return {
      ...DEFAULT_ADMIN_CONFIG,
      ...parsed,
      realtimeModel: REALTIME_MODEL_CHEAP,
      transcriptionModel: TRANSCRIPTION_MODEL_CHEAP,
    };
  } catch {
    return { ...DEFAULT_ADMIN_CONFIG };
  }
}

/** Persist admin config to disk */
export async function writeAdminConfig(config: AdminConfig): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  const payload: AdminConfig = {
    ...config,
    realtimeModel: REALTIME_MODEL_CHEAP,
    transcriptionModel: TRANSCRIPTION_MODEL_CHEAP,
    updatedAt: new Date().toISOString(),
  };
  await writeFile(CONFIG_PATH, JSON.stringify(payload, null, 2), 'utf-8');
}

/** Public shape returned by GET /api/admin/config */
export function toPublicConfig(config: AdminConfig) {
  return {
    sttProvider: config.sttProvider,
    ttsProvider: config.ttsProvider,
    realtimeModel: config.realtimeModel,
    transcriptionModel: config.transcriptionModel,
    updatedAt: config.updatedAt,
  };
}
