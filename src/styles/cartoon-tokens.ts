import { cn } from '@/lib/utils';

/** Single source of truth — all cartoon UI must consume these tokens. */

export type CartoonVariant = 'green' | 'yellow' | 'pink' | 'blue' | 'purple';

export const cartoonRadius = {
  button: 'rounded-full',
  input: 'rounded-full',
  card: 'rounded-[32px]',
  modal: 'rounded-[40px]',
  avatar: 'rounded-[30px]',
  badge: 'rounded-[20px]',
  chatBubble: 'rounded-[32px]',
  progressIcon: 'rounded-[20px]',
} as const;

export const cartoonBorder = {
  base: 'border-4',
  card: 'border-[5px]',
  modal: 'border-[6px]',
} as const;

export const cartoonShadow = {
  cta: 'shadow-[0_6px_0_rgba(0,0,0,0.15)]',
  card: 'shadow-[0_8px_20px_rgba(0,0,0,0.12)]',
  popup: 'shadow-[0_12px_30px_rgba(0,0,0,0.15)]',
  floating: 'shadow-[0_8px_0_rgba(0,0,0,0.12)]',
} as const;

export const cartoonSpacing = {
  page: 'p-6 md:p-8',
  sectionGap: 'gap-6',
  cardPadding: 'p-6',
  buttonPx: 'px-8',
  buttonPy: 'py-4',
  stack: 'flex flex-col gap-6',
  row: 'flex items-center gap-6',
  grid: 'grid gap-6',
  grid2: 'grid grid-cols-2 gap-6',
} as const;

export const cartoonBackground = {
  page: 'bg-[#DDF4F8]',
  panel: 'bg-white/90',
  glass: 'bg-white/70 backdrop-blur-md',
  card: 'bg-white',
} as const;

export const cartoonTypography = {
  heading: 'text-4xl font-black',
  subheading: 'text-2xl font-bold',
  body: 'text-lg font-bold',
  button: 'text-xl font-black tracking-wide',
  label: 'text-lg font-bold',
  caption: 'text-lg font-semibold',
} as const;

export const cartoonVariantFill: Record<CartoonVariant, string> = {
  green: 'bg-gradient-to-b from-lime-300 to-green-500',
  yellow: 'bg-gradient-to-b from-yellow-300 to-orange-400',
  pink: 'bg-gradient-to-b from-pink-400 to-rose-500',
  blue: 'bg-gradient-to-b from-cyan-300 to-sky-500',
  purple: 'bg-gradient-to-b from-violet-400 to-purple-600',
};

export const cartoonVariantBorder: Record<CartoonVariant, string> = {
  green: 'border-green-600',
  yellow: 'border-orange-500',
  pink: 'border-pink-600',
  blue: 'border-sky-600',
  purple: 'border-purple-700',
};

export const cartoonVariantText: Record<CartoonVariant, string> = {
  green: 'text-white',
  yellow: 'text-white',
  pink: 'text-white',
  blue: 'text-white',
  purple: 'text-white',
};

export function cartoonVariant(variant: CartoonVariant) {
  return cn(
    cartoonVariantFill[variant],
    cartoonVariantBorder[variant],
    cartoonVariantText[variant]
  );
}

/** Glass nav — transparent by default, solidifies on parent `.group` hover */
export const cartoonNavGlassBar = cn(
  'border-0 bg-white/4 backdrop-blur-[2px]',
  'transition-[background-color,backdrop-filter] duration-300 ease-out',
  'group-hover:bg-white/16 group-hover:backdrop-blur-sm'
);

export const cartoonNavGlassButtonBase = cn(
  'border-0 shadow-none backdrop-blur-[2px]',
  'transition-[background-color,backdrop-filter] duration-300 ease-out',
  'group-hover:backdrop-blur-sm'
);

export const cartoonNavGlassButton: Record<CartoonVariant, string> = {
  green: cn(
    'bg-gradient-to-b from-lime-300/10 to-green-500/10',
    'group-hover:from-lime-300/35 group-hover:to-green-500/35'
  ),
  yellow: cn(
    'bg-gradient-to-b from-yellow-300/10 to-orange-400/10',
    'group-hover:from-yellow-300/35 group-hover:to-orange-400/35'
  ),
  pink: cn(
    'bg-gradient-to-b from-pink-400/12 to-rose-500/12',
    'group-hover:from-pink-400/38 group-hover:to-rose-500/38'
  ),
  blue: cn(
    'bg-gradient-to-b from-cyan-300/10 to-sky-500/10',
    'group-hover:from-cyan-300/35 group-hover:to-sky-500/35'
  ),
  purple: cn(
    'bg-gradient-to-b from-violet-400/10 to-purple-600/10',
    'group-hover:from-violet-400/35 group-hover:to-purple-600/35'
  ),
};

export function cartoonNavGlassVariant(variant: CartoonVariant) {
  return cn(cartoonNavGlassButtonBase, cartoonNavGlassButton[variant], cartoonVariantText[variant]);
}

export const cartoonButtonBase = cn(
  cartoonRadius.button,
  cartoonBorder.base,
  cartoonSpacing.buttonPx,
  cartoonSpacing.buttonPy,
  cartoonTypography.button,
  'text-white',
  cartoonShadow.cta,
  'inline-flex items-center justify-center select-none transition-all hover:scale-105 active:translate-y-1 disabled:opacity-50 disabled:pointer-events-none'
);

export const cartoonIconButtonBase = cn(
  'w-16 h-16',
  cartoonRadius.button,
  cartoonBorder.base,
  cartoonShadow.cta,
  'flex items-center justify-center select-none transition-all'
);

export const cartoonCardBase = cn(
  cartoonRadius.card,
  cartoonBorder.card,
  cartoonBackground.card,
  cartoonSpacing.cardPadding,
  cartoonShadow.card
);

export const cartoonDialogBase = cn(
  cartoonRadius.modal,
  cartoonBorder.modal,
  'bg-gradient-to-b from-yellow-200 to-orange-300',
  'p-8',
  cartoonShadow.popup
);

export const cartoonDialogPanel = cn(
  cartoonRadius.card,
  cartoonBorder.base,
  cartoonBackground.glass,
  cartoonSpacing.cardPadding
);

export const cartoonInputBase = cn(
  'h-14 w-full',
  cartoonRadius.input,
  cartoonBorder.base,
  cartoonBackground.card,
  'px-5',
  cartoonTypography.body,
  'text-purple-800 placeholder:text-purple-400/70',
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-300/50',
  'disabled:cursor-not-allowed disabled:opacity-50'
);

export const cartoonChatBubbleUser = cn(
  cartoonRadius.chatBubble,
  cartoonBorder.base,
  cartoonVariantFill.blue,
  cartoonVariantBorder.blue,
  'text-white',
  cartoonShadow.floating,
  cartoonSpacing.cardPadding
);

export const cartoonChatBubbleAi = cn(
  cartoonRadius.chatBubble,
  cartoonBorder.base,
  cartoonVariantFill.yellow,
  cartoonVariantBorder.yellow,
  'text-white',
  cartoonShadow.floating,
  cartoonSpacing.cardPadding
);

export const cartoonMotion = {
  buttonHover: { scale: 1.05 },
  buttonTap: { scale: 0.95 },
  cardHover: { scale: 1.04, y: -4 },
  cardTap: { scale: 0.97, y: 2 },
  modalInitial: { scale: 0.7, opacity: 0 },
  modalAnimate: { scale: 1, opacity: 1 },
  modalTransition: { type: 'spring' as const, stiffness: 250 },
  coinFloat: { y: [0, -8, 0] as number[] },
  coinTransition: { repeat: Infinity, duration: 2 },
  bubbleInitial: { opacity: 0, y: 12, scale: 0.75 },
  bubbleAnimate: { opacity: 1, y: 0, scale: 1 },
  bubbleTransition: { type: 'spring' as const, stiffness: 320, damping: 18 },
};

export const cartoonButtonSizes = {
  sm: cn('min-w-16 min-h-16 text-xl', cartoonSpacing.buttonPx, 'py-4'),
  md: cn('min-w-24 min-h-24 text-2xl md:min-w-28 md:min-h-28 md:text-3xl'),
  lg: cn('min-w-28 min-h-28 text-3xl md:min-w-32 md:min-h-32 md:text-4xl'),
  play: cn('min-w-[13rem] min-h-[5.5rem] text-2xl md:text-3xl'),
} as const;

export const cartoonIconButtonSizes = {
  md: 'w-16 h-16 text-2xl',
  lg: 'w-20 h-20 text-3xl',
} as const;

export const cartoonCardVariants: Record<CartoonVariant | 'white', string> = {
  green: cn(cartoonCardBase, cartoonVariantFill.green, cartoonVariantBorder.green),
  yellow: cn(cartoonCardBase, cartoonVariantFill.yellow, cartoonVariantBorder.yellow),
  pink: cn(cartoonCardBase, cartoonVariantFill.pink, cartoonVariantBorder.pink),
  blue: cn(cartoonCardBase, cartoonVariantFill.blue, cartoonVariantBorder.blue),
  purple: cn(cartoonCardBase, cartoonVariantFill.purple, cartoonVariantBorder.purple),
  white: cartoonCardBase,
};

export const cartoonProgressFill: Record<CartoonVariant, string> = {
  green: 'bg-gradient-to-b from-lime-300 to-green-500',
  yellow: 'bg-gradient-to-b from-yellow-300 to-orange-400',
  pink: 'bg-gradient-to-b from-pink-400 to-rose-500',
  blue: 'bg-gradient-to-b from-cyan-300 to-sky-500',
  purple: 'bg-gradient-to-b from-violet-400 to-purple-600',
};

export const cartoonInk = 'text-[#4a6a7d]';
