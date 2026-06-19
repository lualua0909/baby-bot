'use client';

import KidModal from '@/components/ui/KidModal';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CartoonCard, CartoonStack } from '@/components/cartoon';
import { useAppStore } from '@/store/appStore';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import { STT_PROVIDER_OPTIONS, TTS_PROVIDER_OPTIONS } from '@/types/admin';
import { getElevenLabsViVoice } from '@/lib/voice/elevenlabsViVoices';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

import { FLOOR_LABELS, FLOOR_OPTIONS, FLOOR_ICONS } from '@/config/scene3d';
import { AppIcon } from '@/components/ui/AppIcon';

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
    adminConfig?.ttsProvider === 'elevenlabs'
      ? `${TTS_PROVIDER_OPTIONS.find((o) => o.id === adminConfig?.ttsProvider)?.name ?? 'ElevenLabs'} — ${
          getElevenLabsViVoice(adminConfig.elevenlabsVoiceId)?.name ?? 'Đang tải...'
        }`
      : TTS_PROVIDER_OPTIONS.find((o) => o.id === adminConfig?.ttsProvider)?.name ?? 'Đang tải...';

  return (
    <KidModal
      open={isOpen}
      onClose={() => setSettingsOpen(false)}
      title={
        <span className="inline-flex items-center gap-2">
          <AppIcon name="palette" className="h-6 w-6" />
          Cài đặt
        </span>
      }
    >
      <CartoonStack align="stretch">
        <div className="flex flex-col gap-6">
          <Label htmlFor="pet-name">Tên bạn thú</Label>
          <Input
            id="pet-name"
            type="text"
            value={settings.petName}
            onChange={(e) => updateSettings({ petName: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-6">
          <Label htmlFor="character">Nhân vật (GLB)</Label>
          <Select
            value={settings.characterFile}
            onValueChange={(value) => updateSettings({ characterFile: value })}
          >
            <SelectTrigger id="character">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHARACTER_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-6">
          <Label htmlFor="floor">Mặt sàn (GLB)</Label>
          <Select
            value={settings.floorFile ?? 'Beach.glb'}
            onValueChange={(value) => updateSettings({ floorFile: value })}
          >
            <SelectTrigger id="floor">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FLOOR_OPTIONS.map((f) => (
                <SelectItem key={f} value={f}>
                  <span className="inline-flex items-center gap-2">
                    <AppIcon name={FLOOR_ICONS[f] ?? 'shop'} className="h-4 w-4" />
                    {FLOOR_LABELS[f] ?? f}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <CartoonCard variant="blue">
          <span className={cn(cartoonTypography.caption, 'text-white/80')}>Nhận diện giọng (STT)</span>
          <span className={cn(cartoonTypography.subheading, 'text-white block')}>{sttLabel}</span>
          <span className={cn(cartoonTypography.caption, 'text-white/70')}>
            Do admin cấu hình tại trang Settings
          </span>
        </CartoonCard>

        <CartoonCard variant="purple">
          <span className={cn(cartoonTypography.caption, 'text-white/80')}>Giọng nói (TTS)</span>
          <span className={cn(cartoonTypography.subheading, 'text-white block')}>{ttsLabel}</span>
          <span className={cn(cartoonTypography.caption, 'text-white/70')}>
            Do admin cấu hình tại trang Settings
          </span>
        </CartoonCard>

        <div className="flex items-center gap-6">
          <Checkbox
            id="sound-enabled"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) =>
              updateSettings({ soundEnabled: checked === true })
            }
          />
          <Label htmlFor="sound-enabled" className="cursor-pointer inline-flex items-center gap-2">
            Bật âm thanh
            <AppIcon name="volume" className="h-4 w-4" />
          </Label>
        </div>
      </CartoonStack>
    </KidModal>
  );
}
