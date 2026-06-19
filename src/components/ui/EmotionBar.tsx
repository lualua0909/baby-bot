'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import type { CharacterAnimation } from '@/types/animation';
import { Button } from '@/components/ui/Button';
import { AppIcon } from '@/components/ui/AppIcon';
import { cn } from '@/lib/utils';

/** Nhãn + câu nói tiếng Việt cho từng animation clip có trong GLB. */
const ANIMATION_META: Record<string, { label: string; phrases: string[] }> = {
  Idle: { label: 'Đứng yên', phrases: ['Mình đang thư giãn một chút đây!', 'Ngồi nghỉ tí nào bé ơi!'] },
  Walk: { label: 'Đi bộ', phrases: ['Mình đi dạo một vòng nhé!', 'Cùng đi bộ cho khỏe nào!'] },
  Run: { label: 'Chạy', phrases: ['Mình chạy thật nhanh nào, yeah!', 'Đuổi theo mình đi bé ơi!'] },
  Jump: { label: 'Nhảy', phrases: ['Nhảy lên thật cao nào, hú hú!', 'Bật nhảy vui ghê!'] },
  Jump_Idle: { label: 'Lơ lửng', phrases: ['Wow, mình đang bay lơ lửng nè!', 'Nhẹ như bay luôn á!'] },
  Jump_Land: { label: 'Tiếp đất', phrases: ['Hạ cánh an toàn rồi nha!', 'Tách! Tiếp đất hoàn hảo!'] },
  Wave: { label: 'Vẫy tay', phrases: ['Xin chào bé yêu, mình nhớ bé lắm!', 'Hú hú, chào bé nha!'] },
  Yes: { label: 'Đồng ý', phrases: ['Tuyệt vời, bé giỏi quá đi!', 'Đúng rồi đó, hoan hô bé!'] },
  No: { label: 'Lắc đầu', phrases: ['Ơ, hình như chưa đúng rồi nha!', 'Không phải đâu, thử lại nào bé!'] },
  Punch: { label: 'Đấm', phrases: ['Bùm! Mình mạnh mẽ chưa nào!', 'Pặc pặc, đấm thật lực luôn!'] },
  Duck: { label: 'Cúi né', phrases: ['Cúi xuống né nhanh nào!', 'Suýt nữa thì trúng, né hay ghê!'] },
  HitReact: { label: 'Trúng đòn', phrases: ['Ối, đau quá đi mất!', 'Ui da, hơi xíu thôi mà!'] },
  Death: { label: 'Ngã', phrases: ['Ôi mình xỉu mất thôi!', 'Hức, mình gục ngã rồi nè!'] },
  Idle_Gun: { label: 'Cầm súng', phrases: ['Mình sẵn sàng rồi đây!', 'Cẩn thận nào, mình đứng canh nè!'] },
  Run_Gun: { label: 'Chạy cầm súng', phrases: ['Vừa chạy vừa giữ chặt nào!', 'Tiến lên phía trước thôi!'] },
  Walk_Gun: { label: 'Đi cầm súng', phrases: ['Mình bước thật cẩn thận nha!', 'Đi từ từ quan sát nào!'] },
  Idle_Shoot: { label: 'Bắn', phrases: ['Đoàng! Trúng mục tiêu rồi!', 'Pằng pằng, ngắm chuẩn ghê!'] },
  Run_Shoot: { label: 'Chạy bắn', phrases: ['Vừa chạy vừa bắn, oách chưa!', 'Nhanh như chớp luôn nè!'] },
};

const FALLBACK_PHRASE = 'Xem mình làm động tác này nè!';

function metaFor(name: string) {
  return ANIMATION_META[name] ?? { label: name, phrases: [FALLBACK_PHRASE] };
}

function pickPhrase(phrases: string[]): string {
  if (phrases.length <= 1) return phrases[0] ?? FALLBACK_PHRASE;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

interface EmotionBarProps {
  /** Phát giọng nói câu tương ứng với cảm xúc khi bấm nút. */
  speakText: (text: string, systemPrompt?: string) => Promise<void>;
}

export default function EmotionBar({ speakText }: EmotionBarProps) {
  const setAnimation = useAppStore((s) => s.setAnimation);
  const availableAnimations = useAppStore((s) => s.availableAnimations);
  const overrideAnimation = useAppStore((s) => s.overrideAnimation);
  const currentAnimation = useAppStore((s) => s.currentAnimation);
  const active = overrideAnimation ?? currentAnimation;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="pointer-events-none fixed top-1/2 left-2 z-30 flex -translate-y-1/2 items-start gap-1 sm:left-3 md:left-5">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Mở thanh cảm xúc' : 'Thu gọn thanh cảm xúc'}
        aria-expanded={!collapsed}
        className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-white text-orange-500 shadow-md transition-transform hover:scale-110 active:scale-95"
      >
        <AppIcon name={collapsed ? 'chevron-right' : 'chevron-left'} className="h-5 w-5" />
      </button>
      {!collapsed && (
        <div className="pointer-events-auto flex max-h-[min(80vh,calc(100dvh-10rem))] flex-col gap-1 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {availableAnimations.map((name) => {
          const m = metaFor(name);
          return (
            <div key={name} className="shrink-0 pr-2 pb-2">
            <Button
              type="button"
              size="sm"
              variant={active === name ? 'red' : 'white'}
              onClick={() => {
                setAnimation(name as CharacterAnimation);
                void speakText(pickPhrase(m.phrases));
              }}
              className={cn(
                'min-w-0 w-full normal-case text-left text-sm leading-tight sm:text-base',
                active !== name && 'opacity-90'
              )}
            >
              {m.label}
            </Button>
            </div>
          );
      })}
        </div>
      )}
    </div>
  );
}
