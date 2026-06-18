import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import {
  ELEVENLABS_TTS_MODEL,
  ELEVENLABS_DEFAULT_VOICE_ID,
  ELEVENLABS_VOICE_SETTINGS,
} from '@/types/admin';

/** Collect audio output into a single Buffer */
async function audioToBuffer(
  audio: ReadableStream<Uint8Array> | AsyncIterable<Uint8Array>
): Promise<Buffer> {
  if (audio instanceof ReadableStream) {
    const arrayBuffer = await new Response(audio).arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of audio) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ELEVENLABS_API_KEY chưa được cấu hình' },
        { status: 500 }
      );
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID ?? ELEVENLABS_DEFAULT_VOICE_ID;

    const elevenlabs = new ElevenLabsClient({ apiKey });

    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: text.slice(0, 4096),
      modelId: ELEVENLABS_TTS_MODEL,
      outputFormat: 'mp3_44100_128',
      voiceSettings: ELEVENLABS_VOICE_SETTINGS,
    });

    const buffer = await audioToBuffer(audio);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('ElevenLabs TTS error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'ElevenLabs TTS failed', details: errorMessage },
      { status: 500 }
    );
  }
}
