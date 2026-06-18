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
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

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
          <Label htmlFor="sound-enabled" className="cursor-pointer">
            Bật âm thanh 🔊
          </Label>
        </div>
      </CartoonStack>
    </KidModal>
  );
}
