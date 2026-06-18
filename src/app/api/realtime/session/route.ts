import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { readAdminConfig } from '@/lib/admin/config';
import { REALTIME_MODEL_CHEAP, TRANSCRIPTION_MODEL_CHEAP } from '@/types/admin';

/**
 * Creates an ephemeral Realtime session for client-side STT.
 * Uses cheapest models: gpt-4o-mini-realtime-preview + whisper-1 transcription.
 */
export async function POST() {
  try {
    const adminConfig = await readAdminConfig();

    if (adminConfig.sttProvider !== 'openai-realtime') {
      return NextResponse.json(
        { error: 'OpenAI Realtime STT chưa được bật trong admin settings' },
        { status: 400 }
      );
    }

    const session = await openai.beta.realtime.sessions.create({
      model: REALTIME_MODEL_CHEAP,
      modalities: ['text'],
      input_audio_transcription: {
        model: TRANSCRIPTION_MODEL_CHEAP,
      },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 900,
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret.value,
      expiresAt: session.client_secret.expires_at,
      model: REALTIME_MODEL_CHEAP,
      transcriptionModel: TRANSCRIPTION_MODEL_CHEAP,
    });
  } catch (error: unknown) {
    console.error('Realtime session error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Không tạo được Realtime session', details: message }, { status: 500 });
  }
}
