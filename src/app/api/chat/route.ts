import { NextRequest } from 'next/server';
import { createLLMClient, getLLMModel } from '@/lib/llm/client';
import { buildSystemPrompt } from '@/lib/petPersonality';

export async function POST(req: NextRequest) {
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
    const friendly = isConnError
      ? `Không kết nối được tới LLM server tại ${process.env.LLM_API_URL ?? 'LLM_API_URL'}. Hãy chắc chắn server đang chạy.`
      : 'Failed to generate response';
    return new Response(
      JSON.stringify({ error: friendly, details: errorMessage }),
      { status: isConnError ? 503 : 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
