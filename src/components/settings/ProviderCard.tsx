'use client';

import type { ProviderOption } from '@/types/admin';

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
    <button
      type="button"
      onClick={onSelect}
      className={`text-left rounded-xl border-2 p-5 transition-all w-full ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900">{option.name}</p>
          <p className="text-sm text-slate-600 mt-1">{option.description}</p>
        </div>
        <span
          className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full ${
            freeBadge ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {option.cost}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
        <div>
          <p className="font-semibold text-green-700 mb-1">Ưu điểm</p>
          <ul className="text-slate-600 space-y-0.5">
            {option.pros.map((p) => (
              <li key={p}>✓ {p}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-red-600 mb-1">Nhược điểm</p>
          <ul className="text-slate-600 space-y-0.5">
            {option.cons.map((c) => (
              <li key={c}>✗ {c}</li>
            ))}
          </ul>
        </div>
      </div>

      {isSelected && <p className="mt-3 text-xs font-semibold text-blue-600">● Đã chọn</p>}
    </button>
  );
}
