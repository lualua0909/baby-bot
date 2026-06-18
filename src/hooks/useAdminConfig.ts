'use client';

import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import type { SttProviderType, TtsProviderType } from '@/types/admin';

export interface AdminConfigPublic {
  sttProvider: SttProviderType;
  ttsProvider: TtsProviderType;
  elevenlabsVoiceId: string;
  realtimeModel: string;
  transcriptionModel: string;
  updatedAt: string;
}

export interface AdminConfigUpdate {
  sttProvider?: SttProviderType;
  ttsProvider?: TtsProviderType;
  elevenlabsVoiceId?: string;
  pin?: string;
}

interface AdminConfigStore {
  config: AdminConfigPublic | null;
  loading: boolean;
  error: string | null;
  setConfig: (config: AdminConfigPublic | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/** Shared across Settings page and voice hooks — save here propagates app-wide */
const useAdminConfigStore = create<AdminConfigStore>((set) => ({
  config: null,
  loading: true,
  error: null,
  setConfig: (config) => set({ config }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

let fetchPromise: Promise<void> | null = null;

async function fetchAdminConfigOnce(): Promise<void> {
  const { setConfig, setLoading, setError } = useAdminConfigStore.getState();
  setLoading(true);
  setError(null);
  try {
    const res = await fetch('/api/admin/config', { cache: 'no-store' });
    if (!res.ok) throw new Error('Không tải được cấu hình');
    const data = (await res.json()) as AdminConfigPublic;
    setConfig(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Lỗi không xác định');
  } finally {
    setLoading(false);
  }
}

function ensureAdminConfigLoaded(): Promise<void> {
  if (!fetchPromise) {
    fetchPromise = fetchAdminConfigOnce().finally(() => {
      fetchPromise = null;
    });
  }
  return fetchPromise;
}

export function useAdminConfig() {
  const config = useAdminConfigStore((s) => s.config);
  const loading = useAdminConfigStore((s) => s.loading);
  const error = useAdminConfigStore((s) => s.error);
  const setConfig = useAdminConfigStore((s) => s.setConfig);

  const fetchConfig = useCallback(async () => {
    await fetchAdminConfigOnce();
  }, []);

  useEffect(() => {
    void ensureAdminConfigLoaded();
  }, []);

  const saveConfig = useCallback(
    async (update: AdminConfigUpdate) => {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Lưu thất bại');
      }

      const saved = data.config as AdminConfigPublic;
      setConfig(saved);
      return saved;
    },
    [setConfig]
  );

  return { config, loading, error, fetchConfig, saveConfig };
}
