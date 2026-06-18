import OpenAI from 'openai';
import { assertLLMConfig, getLLMBaseUrl, getLLMConfig } from './config';

/** OpenAI-compatible LLM client (LightRAG, Ollama, vLLM, etc.) */
export function createLLMClient(): OpenAI {
  const config = getLLMConfig();
  assertLLMConfig(config);

  return new OpenAI({
    apiKey: config.apiKey,
    baseURL: getLLMBaseUrl(config.apiUrl),
  });
}

export function getLLMModel(): string {
  return getLLMConfig().model;
}
