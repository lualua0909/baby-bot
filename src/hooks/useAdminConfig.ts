'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SttProviderType, TtsProviderType } from '@/types/admin';

export interface AdminConfigPublic {
  sttProvider: SttProviderType;
  ttsProvider: TtsProviderType;
  realtimeModel: string;
  transcriptionModel: string;
  updatedAt: string;
}

export interface AdminConfigUpdate {
  sttProvider?: SttProviderType;
  ttsProvider?: TtsProviderType;
  pin?: string;
}

export function useAdminConfig() {
  const [config, setConfig] = useState<AdminConfigPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/config');
      if (!res.ok) throw new Error('Không tải được cấu hình');
      const data = (await res.json()) as AdminConfigPublic;
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  const saveConfig = useCallback(async (update: AdminConfigUpdate) => {
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Lưu thất bại');
    }

    setConfig(data.config as AdminConfigPublic);
    return data.config as AdminConfigPublic;
  }, []);

  return { config, loading, error, fetchConfig, saveConfig };
}
