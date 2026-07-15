import { NextRequest } from 'next/server';
import { createLLMClient, getLLMModel } from '@/lib/llm/client';
import { getLLMConfig } from '@/lib/llm/config';
import { buildSystemPrompt } from '@/lib/petPersonality';

const DEFAULT_CHAT_COOLDOWN_MS = 10_000;
const configuredCooldownMs = Number(process.env.CHAT_COOLDOWN_MS);
const CHAT_COOLDOWN_MS =
  Number.isFinite(configuredCooldownMs) && configuredCooldownMs > 0
    ? configuredCooldownMs
    : DEFAULT_CHAT_COOLDOWN_MS;
const recentChatRequests = new Map<string, number>();

function getClientKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous';
}

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req);
  const now = Date.now();
  const lastRequestAt = recentChatRequests.get(clientKey) ?? 0;
  const retryAfterMs = CHAT_COOLDOWN_MS - (now - lastRequestAt);

  if (retryAfterMs > 0) {
    return new Response(JSON.stringify({ error: 'Vui lòng chờ một chút trước khi nói tiếp.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(retryAfterMs / 1_000)),
      },
    });
  }

  recentChatRequests.set(clientKey, now);

  try {
    const body = await req.json();
    const { message, petState, context, systemPrompt: customSystemPrompt } = body;

    const userMessage = context
      ? `[Action context: ${context}] ${message}`
      : message;

    const systemPrompt =
      typeof customSystemPrompt === 'string' && customSystemPrompt.length > 0
        ? customSystemPrompt
        : buildSystemPrompt(petState);

    const llm = createLLMClient();
    const model = getLLMModel();

    const response = await llm.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.9,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Connection refused → the OpenAI-compatible LLM server (per LLM_API_URL) is unreachable.
    const isConnError =
      (error as { code?: string })?.code === 'ECONNREFUSED' ||
      /connection error|ECONNREFUSED|fetch failed/i.test(errorMessage);
    const config = getLLMConfig();
    const friendly = isConnError
      ? config.provider === 'openrouter'
        ? 'Không kết nối được tới OpenRouter. Kiểm tra mạng và OPENROUTER_API_KEY.'
        : `Không kết nối được tới LLM server tại ${process.env.LLM_API_URL ?? 'LLM_API_URL'}. Hãy chắc chắn server đang chạy.`
      : 'Failed to generate response';
    return new Response(
      JSON.stringify({ error: friendly, details: errorMessage }),
      { status: isConnError ? 503 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
