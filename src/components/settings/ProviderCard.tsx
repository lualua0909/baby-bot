'use client';

import type { ProviderOption } from '@/types/admin';
import { CartoonCard } from '@/components/cartoon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface ProviderCardProps<T extends string> {
  option: ProviderOption<T>;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ProviderCard<T extends string>({
  option,
  isSelected,
  onSelect,
}: ProviderCardProps<T>) {
  return (
    <CartoonCard
      interactive
      onCardClick={onSelect}
      variant={isSelected ? 'green' : 'white'}
      className={isSelected ? 'ring-4 ring-green-600/50' : undefined}
    >
      <p className={cn(cartoonTypography.subheading, isSelected ? 'text-white' : 'text-[#4a6a7d]')}>
        {option.name}
      </p>
    </CartoonCard>
  );
}
