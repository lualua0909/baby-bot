'use client';

import type { ElevenLabsViVoice } from '@/lib/voice/elevenlabsViVoices';
import { AppIcon } from '@/components/ui/AppIcon';
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
      <p
        className={cn(
          cartoonTypography.subheading,
          isSelected ? 'text-white' : 'text-[#4a6a7d]',
          'inline-flex items-center gap-2'
        )}
      >
        <AppIcon name={voice.gender === 'female' ? 'female' : 'male'} className="h-5 w-5" />
        {voice.name}
      </p>
    </CartoonCard>
  );
}
