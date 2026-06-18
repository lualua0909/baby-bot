import { NextRequest, NextResponse } from 'next/server';
import { readAdminConfig, writeAdminConfig, toPublicConfig } from '@/lib/admin/config';
import type { AdminConfig, SttProviderType, TtsProviderType } from '@/types/admin';
import { isValidElevenLabsViVoiceId } from '@/lib/voice/elevenlabsViVoices';

const VALID_STT: SttProviderType[] = ['web-speech', 'openai-realtime', 'elevenlabs'];
const VALID_TTS: TtsProviderType[] = ['web-speech', 'openai-tts', 'elevenlabs'];

function verifyPin(pin: string | undefined): boolean {
  const required = process.env.ADMIN_SETTINGS_PIN;
  if (!required) return true;
  return pin === required;
}

/** GET — public read of voice config (used by app) */
export async function GET() {
  const config = await readAdminConfig();
  return NextResponse.json(toPublicConfig(config));
}

interface AdminConfigUpdateBody {
  sttProvider?: SttProviderType;
  ttsProvider?: TtsProviderType;
  elevenlabsVoiceId?: string;
  pin?: string;
}

/** POST — admin update STT, TTS and/or ElevenLabs voice */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AdminConfigUpdateBody;
    const { sttProvider, ttsProvider, elevenlabsVoiceId, pin } = body;

    if (!sttProvider && !ttsProvider && !elevenlabsVoiceId) {
      return NextResponse.json(
        { error: 'Cần ít nhất sttProvider, ttsProvider hoặc elevenlabsVoiceId' },
        { status: 400 }
      );
    }

    if (sttProvider && !VALID_STT.includes(sttProvider)) {
      return NextResponse.json({ error: 'sttProvider không hợp lệ' }, { status: 400 });
    }

    if (ttsProvider && !VALID_TTS.includes(ttsProvider)) {
      return NextResponse.json({ error: 'ttsProvider không hợp lệ' }, { status: 400 });
    }

    if (elevenlabsVoiceId && !isValidElevenLabsViVoiceId(elevenlabsVoiceId)) {
      return NextResponse.json({ error: 'elevenlabsVoiceId không hợp lệ' }, { status: 400 });
    }

    if (!verifyPin(pin)) {
      return NextResponse.json({ error: 'Mã PIN admin không đúng' }, { status: 401 });
    }

    const current = await readAdminConfig();
    const next: AdminConfig = {
      ...current,
      ...(sttProvider ? { sttProvider } : {}),
      ...(ttsProvider ? { ttsProvider } : {}),
      ...(elevenlabsVoiceId ? { elevenlabsVoiceId } : {}),
    };

    if (next.sttProvider === 'openai-realtime' && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY chưa được cấu hình trên server' },
        { status: 400 }
      );
    }

    if (next.sttProvider === 'elevenlabs' && !process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ELEVENLABS_API_KEY chưa được cấu hình trên server' },
        { status: 400 }
      );
    }

    if (next.ttsProvider === 'openai-tts' && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY chưa được cấu hình trên server' },
        { status: 400 }
      );
    }

    if (next.ttsProvider === 'elevenlabs' && !process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ELEVENLABS_API_KEY chưa được cấu hình trên server' },
        { status: 400 }
      );
    }

    await writeAdminConfig(next);

    return NextResponse.json({
      success: true,
      config: toPublicConfig(next),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
