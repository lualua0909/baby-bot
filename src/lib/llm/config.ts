export type LLMProvider = 'custom' | 'openrouter';

export interface LLMConfig {
  provider: LLMProvider;
  /** Full chat completions URL, e.g. http://localhost:20128/v1/chat/completions */
  apiUrl: string;
  apiKey: string;
  /** Model name sent in chat/completions request body */
  model: string;
  /** OpenRouter attribution — optional but recommended */
  httpReferer?: string;
  xTitle?: string;
}

const DEFAULT_API_URL = 'http://localhost:20128/v1/chat/completions';
const DEFAULT_MODEL = 'lightrag';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_DEFAULT_MODEL = 'openrouter/free';

function resolveProvider(): LLMProvider {
  const raw = process.env.LLM_PROVIDER?.toLowerCase();
  if (raw === 'openrouter') return 'openrouter';
  return 'custom';
}

/** Read LLM configuration from environment variables */
export function getLLMConfig(): LLMConfig {
  const provider = resolveProvider();

  if (provider === 'openrouter') {
    return {
      provider,
      apiUrl: OPENROUTER_API_URL,
      apiKey: process.env.OPENROUTER_API_KEY ?? '',
      model: process.env.OPENROUTER_MODEL ?? OPENROUTER_DEFAULT_MODEL,
      httpReferer: process.env.OPENROUTER_HTTP_REFERER,
      xTitle: process.env.OPENROUTER_X_TITLE ?? 'Nuoi Thu Ao',
    };
  }

  return {
    provider,
    apiUrl: process.env.LLM_API_URL ?? DEFAULT_API_URL,
    apiKey: process.env.LLM_API_KEY ?? '',
    model: process.env.LLM_MODEL ?? DEFAULT_MODEL,
  };
}

/** Derive OpenAI SDK baseURL from full completions endpoint */
export function getLLMBaseUrl(apiUrl: string): string {
  const trimmed = apiUrl.replace(/\/$/, '');
  if (trimmed.endsWith('/chat/completions')) {
    return trimmed.replace(/\/chat\/completions$/, '');
  }
  return trimmed;
}

export function assertLLMConfig(config: LLMConfig): void {
  if (!config.apiKey) {
    throw new Error(
      config.provider === 'openrouter'
        ? 'OPENROUTER_API_KEY chưa được cấu hình trong .env'
        : 'LLM_API_KEY chưa được cấu hình trong .env'
    );
  }
  if (!config.apiUrl) {
    throw new Error(
      config.provider === 'openrouter'
        ? 'OpenRouter API URL chưa được cấu hình'
        : 'LLM_API_URL chưa được cấu hình trong .env'
    );
  }
}
