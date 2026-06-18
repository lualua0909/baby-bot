'use client';

import KidModal from '@/components/ui/KidModal';
import { useAppStore } from '@/store/appStore';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import { STT_PROVIDER_OPTIONS, TTS_PROVIDER_OPTIONS } from '@/types/admin';

const CHARACTER_OPTIONS = ['character-1.glb', 'character-2.glb', 'character-3.glb'];

export default function SettingsModal() {
  const isOpen = useAppStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const { config: adminConfig } = useAdminConfig();

  const sttLabel =
    STT_PROVIDER_OPTIONS.find((o) => o.id === adminConfig?.sttProvider)?.name ?? 'Đang tải...';
  const ttsLabel =
    TTS_PROVIDER_OPTIONS.find((o) => o.id === adminConfig?.ttsProvider)?.name ?? 'Đang tải...';

  return (
    <KidModal open={isOpen} onClose={() => setSettingsOpen(false)} title="🎨 Cài đặt">
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-bold text-gray-600 text-sm">Tên bạn thú</span>
          <input
            type="text"
            value={settings.petName}
            onChange={(e) => updateSettings({ petName: e.target.value })}
            className="px-4 py-2 rounded-xl border-2 border-purple-200 font-bold text-purple-700"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-bold text-gray-600 text-sm">Nhân vật (GLB)</span>
          <select
            value={settings.characterFile}
            onChange={(e) => updateSettings({ characterFile: e.target.value })}
            className="px-4 py-2 rounded-xl border-2 border-purple-200 font-bold text-purple-700"
          >
            {CHARACTER_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200">
          <span className="font-bold text-gray-600 text-sm">Nhận diện giọng (STT)</span>
          <span className="font-extrabold text-purple-700">{sttLabel}</span>
          <span className="text-xs text-gray-400">Do admin cấu hình tại trang Settings</span>
        </div>

        <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200">
          <span className="font-bold text-gray-600 text-sm">Giọng nói (TTS)</span>
          <span className="font-extrabold text-purple-700">{ttsLabel}</span>
          <span className="text-xs text-gray-400">Do admin cấu hình tại trang Settings</span>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
            className="w-5 h-5"
          />
          <span className="font-bold text-gray-600">Bật âm thanh</span>
        </label>
      </div>
    </KidModal>
  );
}
