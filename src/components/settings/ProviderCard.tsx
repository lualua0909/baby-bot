'use client';

import type { ProviderOption } from '@/types/admin';
import { Badge } from '@/components/ui/Badge';
import { List, ListItem } from '@/components/ui/List';
import { AppIcon } from '@/components/ui/AppIcon';
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
              <ListItem key={p} className="inline-flex items-start gap-1.5">
                <AppIcon name="check" className="h-3.5 w-3.5 mt-0.5 shrink-0 text-green-600" />
                {p}
              </ListItem>
            ))}
          </List>
        </div>
        <div>
          <p className={cn(cartoonTypography.body, 'text-pink-600 mb-2')}>Nhược điểm</p>
          <List className={cn(cartoonTypography.caption, isSelected ? 'text-white/80' : 'text-[#4a6a7d]/70')}>
            {option.cons.map((c) => (
              <ListItem key={c} className="inline-flex items-start gap-1.5">
                <AppIcon name="cross" className="h-3.5 w-3.5 mt-0.5 shrink-0 text-pink-600" />
                {c}
              </ListItem>
            ))}
          </List>
        </div>
      </div>

      {isSelected && (
        <p className={cn(cartoonTypography.body, 'text-white mt-6 inline-flex items-center gap-2')}>
          <AppIcon name="star" className="h-4 w-4 text-yellow-300" />
          Đã chọn!
        </p>
      )}
    </CartoonCard>
  );
}
