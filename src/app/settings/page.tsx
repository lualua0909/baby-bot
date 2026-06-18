'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  STT_PROVIDER_OPTIONS,
  TTS_PROVIDER_OPTIONS,
  type SttProviderType,
  type TtsProviderType,
} from '@/types/admin';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import ProviderCard from '@/components/settings/ProviderCard';

export default function SettingsPage() {
  const { config, loading, error, saveConfig } = useAdminConfig();
  const [selectedStt, setSelectedStt] = useState<SttProviderType | null>(null);
  const [selectedTts, setSelectedTts] = useState<TtsProviderType | null>(null);
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeStt = selectedStt ?? config?.sttProvider ?? 'web-speech';
  const activeTts = selectedTts ?? config?.ttsProvider ?? 'openai-tts';

  const hasChanges =
    config !== null &&
    (activeStt !== config.sttProvider || activeTts !== config.ttsProvider);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage(null);
    try {
      const update: { sttProvider?: SttProviderType; ttsProvider?: TtsProviderType; pin?: string } =
        { pin: pin || undefined };

      if (activeStt !== config.sttProvider) update.sttProvider = activeStt;
      if (activeTts !== config.ttsProvider) update.ttsProvider = activeTts;

      await saveConfig(update);
      setMessage({ type: 'success', text: 'Đã lưu cấu hình voice. App sẽ dùng provider mới ngay lập tức.' });
      setPin('');
      setSelectedStt(null);
      setSelectedTts(null);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Lưu thất bại',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin Settings</h1>
            <p className="text-sm text-slate-500 mt-0.5">Cấu hình STT & TTS cho toàn bộ ứng dụng</p>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            ← Về app
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {loading && <p className="text-slate-500 text-center py-12">Đang tải cấu hình...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">{error}</div>
        )}

        {!loading && config && (
          <>
            {/* Current status */}
            <section className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Đang hoạt động
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">STT</p>
                  <p className="text-base font-bold text-slate-900">
                    {STT_PROVIDER_OPTIONS.find((o) => o.id === config.sttProvider)?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold">TTS</p>
                  <p className="text-base font-bold text-slate-900">
                    {TTS_PROVIDER_OPTIONS.find((o) => o.id === config.ttsProvider)?.name}
                  </p>
                </div>
              </div>
              {config.sttProvider === 'openai-realtime' && (
                <p className="text-sm text-slate-500 mt-3">
                  STT model: <code className="bg-slate-100 px-1 rounded">{config.realtimeModel}</code>
                </p>
              )}
              {config.sttProvider === 'elevenlabs' && (
                <p className="text-sm text-slate-500 mt-3">
                  STT model: <code className="bg-slate-100 px-1 rounded">scribe_v2_realtime</code>
                </p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                Cập nhật lần cuối: {new Date(config.updatedAt).toLocaleString('vi-VN')}
              </p>
            </section>

            {/* STT selection */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-1">STT Provider</h2>
              <p className="text-sm text-slate-500 mb-3">Speech-to-Text — nhận diện giọng nói bé</p>
              <div className="grid gap-4">
                {STT_PROVIDER_OPTIONS.map((option) => (
                  <ProviderCard
                    key={option.id}
                    option={option}
                    isSelected={activeStt === option.id}
                    onSelect={() => setSelectedStt(option.id)}
                    freeBadge={option.id === 'web-speech'}
                  />
                ))}
              </div>
            </section>

            {/* TTS selection */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-slate-900 mb-1">TTS Provider</h2>
              <p className="text-sm text-slate-500 mb-3">Text-to-Speech — giọng nói bạn thú trả lời</p>
              <div className="grid gap-4">
                {TTS_PROVIDER_OPTIONS.map((option) => (
                  <ProviderCard
                    key={option.id}
                    option={option}
                    isSelected={activeTts === option.id}
                    onSelect={() => setSelectedTts(option.id)}
                  />
                ))}
              </div>
            </section>

            {/* PIN + Save */}
            <section className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-base font-bold text-slate-900 mb-3">Lưu cấu hình</h2>

              <label className="block mb-4">
                <span className="text-sm font-medium text-slate-700">
                  Mã PIN admin
                  <span className="text-slate-400 font-normal"> (nếu có cấu hình ADMIN_SETTINGS_PIN)</span>
                </span>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Nhập PIN..."
                  className="mt-1 w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              {message && (
                <div
                  className={`rounded-lg p-3 mb-4 text-sm font-medium ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving || !hasChanges}
                className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Đang lưu...' : 'Lưu cấu hình Voice'}
              </button>

              {!hasChanges && (
                <p className="text-xs text-slate-400 text-center mt-2">Không có thay đổi để lưu</p>
              )}
            </section>

            <section className="mt-6 text-xs text-slate-400 space-y-1">
              <p>• Web Speech STT: không cần biến môi trường</p>
              <p>• LLM: <code>LLM_API_URL</code>, <code>LLM_API_KEY</code>, <code>LLM_MODEL</code></p>
              <p>• OpenAI STT/TTS: cần <code>OPENAI_API_KEY</code> (nếu dùng)</p>
              <p>• ElevenLabs STT/TTS: cần <code>ELEVENLABS_API_KEY</code></p>
              <p>• Tuỳ chọn voice ElevenLabs: <code>ELEVENLABS_VOICE_ID</code> (mặc định George)</p>
              <p>• Bảo vệ trang admin: <code>ADMIN_SETTINGS_PIN</code></p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
