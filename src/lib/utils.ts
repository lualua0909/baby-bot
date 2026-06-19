import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shadeHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Strip LLM meta artifacts that some models (e.g. OpenRouter free models) leak
 * into their text output: safety/moderation classification lines like
 * "User Safety: safe" and the trailing JSON stat block.
 */
export function sanitizeLLMText(text: string): string {
  return text
    // safety/moderation classification lines, with optional markdown/bracket
    // wrappers and surrounding parens, anywhere in the text. Examples:
    //   "User Safety: safe"        "**Safety:** safe"
    //   "Safety rating: low"       "(Content Safety: safe)"
    //   "[Moderation] flagged"     "- Classification: benign"
    .replace(
      /^[\s>*_\-#[\](]*(user[\s_-]+)?(content[\s_-]+)?(safety([\s_-]+(rating|level|status|score|check))?|moderation|classification)[\s*_\]]*[:=][^\n]*$/gim,
      ''
    )
    // trailing JSON stat block
    .replace(/\n?\{[^}]*"(happiness|emotion)"[^}]*\}\s*$/s, '')
    // collapse blank lines left behind by removed lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const NETWORK_ERROR_RE = /failed to fetch|networkerror|network request failed|load failed/i;

/** Turn browser fetch/network errors into a kid-friendly Vietnamese message. */
export function friendlyNetworkError(err: unknown, fallback = 'Lỗi không xác định'): string {
  const message = err instanceof Error ? err.message : fallback;
  if (NETWORK_ERROR_RE.test(message)) {
    return 'Không kết nối được server. Hãy chắc chắn ứng dụng đang chạy (npm run dev) và LM Studio đang bật.';
  }
  return message;
}
