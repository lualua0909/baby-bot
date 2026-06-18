export interface LLMConfig {
  /** Full chat completions URL, e.g. http://localhost:20128/v1/chat/completions */
  apiUrl: string;
  apiKey: string;
  /** Model name sent in chat/completions request body */
  model: string;
}

const DEFAULT_API_URL = 'http://localhost:20128/v1/chat/completions';
const DEFAULT_MODEL = 'lightrag';

/** Read LLM configuration from environment variables */
export function getLLMConfig(): LLMConfig {
  return {
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
    throw new Error('LLM_API_KEY chưa được cấu hình trong .env');
  }
  if (!config.apiUrl) {
    throw new Error('LLM_API_URL chưa được cấu hình trong .env');
  }
}
