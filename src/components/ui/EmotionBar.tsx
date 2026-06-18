'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import type { CharacterAnimation } from '@/types/animation';
import { cartoonTypography } from '@/styles/cartoon-tokens';
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

  return (
    <div className="pointer-events-auto fixed top-1/2 left-2 z-30 flex max-h-[min(80vh,calc(100dvh-10rem))] -translate-y-1/2 flex-col gap-1.5 overflow-y-auto [scrollbar-width:none] sm:left-3 md:left-5 [&::-webkit-scrollbar]:hidden">
      {availableAnimations.map((name) => {
          const m = metaFor(name);
          return (
            <motion.button
              key={name}
              type="button"
              onClick={() => {
                setAnimation(name as CharacterAnimation);
                void speakText(pickPhrase(m.phrases));
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                cartoonTypography.caption,
                'shrink-0 rounded-xl border-2 px-3 py-1.5 text-left text-sm font-bold leading-tight transition-colors sm:text-base',
                active === name
                  ? 'border-orange-500 bg-orange-400 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]'
                  : 'border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100'
              )}
            >
              {m.label}
            </motion.button>
          );
      })}
    </div>
  );
}
