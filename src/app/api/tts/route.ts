import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { OPENAI_TTS_MODEL, OPENAI_TTS_VOICE, KID_TTS_SPEED } from '@/types/admin';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const response = await openai.audio.speech.create({
      model: OPENAI_TTS_MODEL,
      voice: OPENAI_TTS_VOICE,
      input: text.slice(0, 4096),
      speed: KID_TTS_SPEED,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('TTS API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'TTS failed', details: errorMessage },
      { status: 500 }
    );
  }
}
