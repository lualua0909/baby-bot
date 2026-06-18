'use client';

import type { ProviderOption } from '@/types/admin';
import { Badge } from '@/components/ui/Badge';
import { List, ListItem } from '@/components/ui/List';
import { CartoonCard } from '@/components/cartoon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface ProviderCardProps<T extends string> {
  option: ProviderOption<T>;
  isSelected: boolean;
  onSelect: () => void;
  freeBadge?: boolean;
}

export default function ProviderCard<T extends string>({
  option,
  isSelected,
  onSelect,
  freeBadge = false,
}: ProviderCardProps<T>) {
  return (
    <CartoonCard
      interactive
      onCardClick={onSelect}
      variant={isSelected ? 'green' : 'white'}
      className={isSelected ? 'ring-4 ring-green-600/50' : undefined}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className={cn(cartoonTypography.subheading, isSelected ? 'text-white' : 'text-[#4a6a7d]')}>
            {option.name}
          </p>
          <p className={cn(cartoonTypography.body, isSelected ? 'text-white/80' : 'text-[#4a6a7d]/70', 'mt-2')}>
            {option.description}
          </p>
        </div>
        <Badge variant={freeBadge ? 'success' : 'warning'}>{option.cost}</Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-6">
        <div>
          <p className={cn(cartoonTypography.body, 'text-green-600 mb-2')}>Ưu điểm</p>
          <List className={cn(cartoonTypography.caption, isSelected ? 'text-white/80' : 'text-[#4a6a7d]/70')}>
            {option.pros.map((p) => (
              <ListItem key={p}>✓ {p}</ListItem>
            ))}
          </List>
        </div>
        <div>
          <p className={cn(cartoonTypography.body, 'text-pink-600 mb-2')}>Nhược điểm</p>
          <List className={cn(cartoonTypography.caption, isSelected ? 'text-white/80' : 'text-[#4a6a7d]/70')}>
            {option.cons.map((c) => (
              <ListItem key={c}>✗ {c}</ListItem>
            ))}
          </List>
        </div>
      </div>

      {isSelected && (
        <p className={cn(cartoonTypography.body, 'text-white mt-6')}>⭐ Đã chọn!</p>
      )}
    </CartoonCard>
  );
}
