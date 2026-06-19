import OpenAI from 'openai';

let client: OpenAI | null = null;

/**
 * OpenAI client — used only for TTS and Realtime STT features.
 * Chat/LLM uses OpenAI-compatible endpoint via @/lib/llm/client.
 * Lazy-init so build succeeds without OPENAI_API_KEY (only required at runtime).
 */
export function getOpenAI(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY chưa được cấu hình trên server');
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}
