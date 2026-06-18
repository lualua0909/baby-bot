import OpenAI from 'openai';

/**
 * OpenAI client — used only for TTS and Realtime STT features.
 * Chat/LLM uses OpenAI-compatible endpoint via @/lib/llm/client.
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
