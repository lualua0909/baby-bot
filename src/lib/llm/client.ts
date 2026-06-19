import OpenAI from 'openai';
import { assertLLMConfig, getLLMBaseUrl, getLLMConfig } from './config';

/** OpenAI-compatible LLM client (LightRAG, Ollama, vLLM, OpenRouter, etc.) */
export function createLLMClient(): OpenAI {
  const config = getLLMConfig();
  assertLLMConfig(config);

  const defaultHeaders: Record<string, string> = {};
  if (config.provider === 'openrouter') {
    if (config.httpReferer) defaultHeaders['HTTP-Referer'] = config.httpReferer;
    if (config.xTitle) defaultHeaders['X-Title'] = config.xTitle;
  }

  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: getLLMBaseUrl(config.apiUrl),
    ...(Object.keys(defaultHeaders).length > 0 ? { defaultHeaders } : {}),
  });
}

export function getLLMModel(): string {
  return getLLMConfig().model;
}
