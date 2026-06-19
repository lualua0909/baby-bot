'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  STT_PROVIDER_OPTIONS,
  TTS_PROVIDER_OPTIONS,
  type SttProviderType,
  type TtsProviderType,
} from '@/types/admin';
import {
  ELEVENLABS_VI_FEMALE_VOICES,
  ELEVENLABS_VI_MALE_VOICES,
  ELEVENLABS_DEFAULT_VI_VOICE_ID,
  getElevenLabsViVoice,
} from '@/lib/voice/elevenlabsViVoices';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import ProviderCard from '@/components/settings/ProviderCard';
import ElevenLabsVoiceCard from '@/components/settings/ElevenLabsVoiceCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import {
  CartoonCard,
  CartoonIconButton,
  CartoonPage,
  CartoonRow,
  CartoonSection,
  CartoonStack,
} from '@/components/cartoon';
import { AppIcon } from '@/components/ui/AppIcon';
import { cartoonTypography, cartoonInk } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { config, loading, error, saveConfig } = useAdminConfig();
  const [selectedStt, setSelectedStt] = useState<SttProviderType | null>(null);
  const [selectedTts, setSelectedTts] = useState<TtsProviderType | null>(null);
  const [selectedElevenLabsVoice, setSelectedElevenLabsVoice] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activeStt = selectedStt ?? config?.sttProvider ?? 'web-speech';
  const activeTts = selectedTts ?? config?.ttsProvider ?? 'web-speech';
  const activeElevenLabsVoice =
    selectedElevenLabsVoice ?? config?.elevenlabsVoiceId ?? ELEVENLABS_DEFAULT_VI_VOICE_ID;
  const activeElevenLabsVoiceLabel = getElevenLabsViVoice(activeElevenLabsVoice)?.name;

  const hasChanges =
    config !== null &&
    (activeStt !== config.sttProvider ||
      activeTts !== config.ttsProvider ||
      (activeTts === 'elevenlabs' &&
        activeElevenLabsVoice !== (config.elevenlabsVoiceId ?? ELEVENLABS_DEFAULT_VI_VOICE_ID)));

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage(null);
    try {
      await saveConfig({
        sttProvider: activeStt,
        ttsProvider: activeTts,
        ...(activeTts === 'elevenlabs' ? { elevenlabsVoiceId: activeElevenLabsVoice } : {}),
        pin: pin || undefined,
      });
      setMessage({ type: 'success', text: 'Đã lưu cấu hình voice. App sẽ dùng provider mới ngay lập tức.' });
      setPin('');
      setSelectedStt(null);
      setSelectedTts(null);
      setSelectedElevenLabsVoice(null);
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
    <CartoonPage>
      <header>
        <CartoonRow className="max-w-3xl mx-auto justify-between">
          <div>
            <h1 className={cn(cartoonTypography.heading, cartoonInk, 'inline-flex items-center gap-3')}>
              <AppIcon name="settings" className="h-8 w-8" />
              Admin Settings
            </h1>
          </div>
          <Link href="/">
            <CartoonIconButton variant="green" ariaLabel="Về app">
              <AppIcon name="home" className="h-6 w-6" />
            </CartoonIconButton>
          </Link>
        </CartoonRow>
      </header>

      <main className="max-w-3xl mx-auto">
        {loading && (
          <p className={cn(cartoonTypography.body, cartoonInk, 'text-center py-12 animate-pulse inline-flex items-center justify-center gap-2 w-full')}>
            <AppIcon name="loader" className="h-5 w-5 animate-spin" />
            Đang tải cấu hình...
          </p>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && config && (
          <CartoonSection>
            <CartoonCard variant="yellow">
              <p className={cn(cartoonTypography.caption, 'text-white/80 uppercase mb-4')}>
                {hasChanges ? 'Đã chọn (chưa lưu)' : 'Đang hoạt động'}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className={cn(cartoonTypography.caption, 'text-white/70 uppercase')}>STT</p>
                  <p className={cn(cartoonTypography.subheading, 'text-white')}>
                    {STT_PROVIDER_OPTIONS.find((o) => o.id === activeStt)?.name}
                  </p>
                </div>
                <div>
                  <p className={cn(cartoonTypography.caption, 'text-white/70 uppercase')}>TTS</p>
                  <p className={cn(cartoonTypography.subheading, 'text-white')}>
                    {TTS_PROVIDER_OPTIONS.find((o) => o.id === activeTts)?.name}
                  </p>
                  {activeTts === 'elevenlabs' && activeElevenLabsVoiceLabel && (
                    <p className={cn(cartoonTypography.caption, 'text-white/80 mt-1')}>
                      Giọng: {activeElevenLabsVoiceLabel}
                    </p>
                  )}
                </div>
              </div>
            </CartoonCard>

            <CartoonSection>
              <h2 className={cn(cartoonTypography.subheading, cartoonInk, 'inline-flex items-center gap-2')}>
                <AppIcon name="stt" className="h-5 w-5" />
                STT Provider
              </h2>
              <CartoonStack align="stretch">
                {STT_PROVIDER_OPTIONS.map((option) => (
                  <ProviderCard
                    key={option.id}
                    option={option}
                    isSelected={activeStt === option.id}
                    onSelect={() => setSelectedStt(option.id)}
                  />
                ))}
              </CartoonStack>
            </CartoonSection>

            <CartoonSection>
              <h2 className={cn(cartoonTypography.subheading, cartoonInk, 'inline-flex items-center gap-2')}>
                <AppIcon name="tts" className="h-5 w-5" />
                TTS Provider
              </h2>
              <CartoonStack align="stretch">
                {TTS_PROVIDER_OPTIONS.map((option) => (
                  <ProviderCard
                    key={option.id}
                    option={option}
                    isSelected={activeTts === option.id}
                    onSelect={() => setSelectedTts(option.id)}
                  />
                ))}
              </CartoonStack>

              {activeTts === 'elevenlabs' && (
                <>
                  <h2 className={cn(cartoonTypography.subheading, cartoonInk, 'mt-8 inline-flex items-center gap-2')}>
                    <AppIcon name="drama" className="h-5 w-5" />
                    Giọng nhân vật ElevenLabs
                  </h2>
                  <h3 className={cn(cartoonTypography.body, cartoonInk, 'font-semibold mt-4 inline-flex items-center gap-2')}>
                    <AppIcon name="female" className="h-4 w-4" />
                    Giọng nữ
                  </h3>
                  <CartoonStack align="stretch">
                    {ELEVENLABS_VI_FEMALE_VOICES.map((voice) => (
                      <ElevenLabsVoiceCard
                        key={voice.id}
                        voice={voice}
                        isSelected={activeElevenLabsVoice === voice.id}
                        onSelect={() => setSelectedElevenLabsVoice(voice.id)}
                      />
                    ))}
                  </CartoonStack>

                  <h3 className={cn(cartoonTypography.body, cartoonInk, 'font-semibold mt-6 inline-flex items-center gap-2')}>
                    <AppIcon name="male" className="h-4 w-4" />
                    Giọng nam
                  </h3>
                  <CartoonStack align="stretch">
                    {ELEVENLABS_VI_MALE_VOICES.map((voice) => (
                      <ElevenLabsVoiceCard
                        key={voice.id}
                        voice={voice}
                        isSelected={activeElevenLabsVoice === voice.id}
                        onSelect={() => setSelectedElevenLabsVoice(voice.id)}
                      />
                    ))}
                  </CartoonStack>

                </>
              )}
            </CartoonSection>

            <CartoonCard variant="pink">
              <h2 className={cn(cartoonTypography.subheading, 'text-white mb-6 inline-flex items-center gap-2')}>
                <AppIcon name="save" className="h-5 w-5" />
                Lưu cấu hình
              </h2>
              <CartoonStack align="stretch">
                <div className="flex flex-col gap-6">
                  <Label htmlFor="admin-pin" className="text-white">
                    Mã PIN admin (nếu có ADMIN_SETTINGS_PIN)
                  </Label>
                  <Input id="admin-pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Nhập PIN..." />
                </div>

                {message && (
                  <Alert variant={message.type === 'success' ? 'success' : 'destructive'}>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                <Button type="button" variant="green" onClick={() => void handleSave()} disabled={saving || !hasChanges} className="w-full normal-case" size="lg">
                  {saving ? (
                    <span className="inline-flex items-center gap-2">
                      <AppIcon name="loader" className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <AppIcon name="save" className="h-4 w-4" />
                      Lưu cấu hình Voice
                    </span>
                  )}
                </Button>

                {!hasChanges && (
                  <p className={cn(cartoonTypography.caption, 'text-white/70 text-center')}>
                    Không có thay đổi để lưu
                  </p>
                )}
              </CartoonStack>
            </CartoonCard>

          </CartoonSection>
        )}
      </main>
    </CartoonPage>
  );
}
