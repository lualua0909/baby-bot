import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { readAdminConfig } from '@/lib/admin/config';
import {
  ELEVENLABS_TTS_MODEL,
  ELEVENLABS_LANGUAGE_CODE,
  ELEVENLABS_DEFAULT_VOICE_ID,
  ELEVENLABS_FREE_TIER_VOICE_IDS,
  ELEVENLABS_VOICE_SETTINGS,
} from '@/types/admin';
import { ELEVENLABS_DEFAULT_VI_VOICE_ID } from '@/lib/voice/elevenlabsViVoices';

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

function isPaidPlanRequired(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes('402') || error.message.includes('paid_plan_required');
}

function resolveVoiceCandidates(adminVoiceId: string): string[] {
  const envVoice = process.env.ELEVENLABS_VOICE_ID;
  const ordered = [
    adminVoiceId,
    envVoice,
    ELEVENLABS_DEFAULT_VI_VOICE_ID,
    ELEVENLABS_DEFAULT_VOICE_ID,
    ...ELEVENLABS_FREE_TIER_VOICE_IDS,
  ].filter((id): id is string => Boolean(id));

  return [...new Set(ordered)];
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

    const adminConfig = await readAdminConfig();
    const languageCode = process.env.ELEVENLABS_LANGUAGE_CODE ?? ELEVENLABS_LANGUAGE_CODE;
    const elevenlabs = new ElevenLabsClient({ apiKey });
    const voiceCandidates = resolveVoiceCandidates(adminConfig.elevenlabsVoiceId);

    let lastError: unknown;

    for (const voiceId of voiceCandidates) {
      try {
        const audio = await elevenlabs.textToSpeech.convert(voiceId, {
          text: text.slice(0, 4096),
          modelId: ELEVENLABS_TTS_MODEL,
          languageCode,
          outputFormat: 'mp3_44100_128',
          voiceSettings: ELEVENLABS_VOICE_SETTINGS,
        });

        const buffer = await audioToBuffer(audio);

        if (voiceId !== voiceCandidates[0]) {
          console.info(
            `[ElevenLabs TTS] Used fallback voice ${voiceId} (requested: ${voiceCandidates[0]})`
          );
        }

        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'no-cache',
          },
        });
      } catch (error: unknown) {
        lastError = error;
        if (isPaidPlanRequired(error)) {
          console.warn(`[ElevenLabs TTS] Voice ${voiceId} requires paid plan, trying next...`);
          continue;
        }
        throw error;
      }
    }

    throw lastError ?? new Error('No compatible ElevenLabs voice available');
  } catch (error: unknown) {
    console.error('ElevenLabs TTS error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'ElevenLabs TTS failed', details: errorMessage },
      { status: 500 }
    );
  }
}
