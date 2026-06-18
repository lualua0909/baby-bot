'use client';

import type { ElevenLabsViVoice } from '@/lib/voice/elevenlabsViVoices';
import { Badge } from '@/components/ui/Badge';
import { CartoonCard } from '@/components/cartoon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface ElevenLabsVoiceCardProps {
  voice: ElevenLabsViVoice;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ElevenLabsVoiceCard({ voice, isSelected, onSelect }: ElevenLabsVoiceCardProps) {
  return (
    <CartoonCard
      interactive
      onCardClick={onSelect}
      variant={isSelected ? 'purple' : 'white'}
      className={isSelected ? 'ring-4 ring-purple-500/40' : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn(cartoonTypography.subheading, isSelected ? 'text-white' : 'text-[#4a6a7d]')}>
            {voice.gender === 'female' ? '👧' : '👦'} {voice.name}
          </p>
          <p
            className={cn(
              cartoonTypography.body,
              isSelected ? 'text-white/80' : 'text-[#4a6a7d]/70',
              'mt-2'
            )}
          >
            {voice.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {voice.kidFriendly && <Badge variant="success">Hợp trẻ em</Badge>}
          {isSelected && <Badge variant="default">Đã chọn</Badge>}
        </div>
      </div>
    </CartoonCard>
  );
}
