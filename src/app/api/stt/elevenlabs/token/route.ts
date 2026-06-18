import { NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { readAdminConfig } from '@/lib/admin/config';

/**
 * Issues a single-use token for client-side ElevenLabs realtime STT.
 * Token expires after 15 minutes and is consumed on use.
 */
export async function POST() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ELEVENLABS_API_KEY chưa được cấu hình' },
        { status: 500 }
      );
    }

    const adminConfig = await readAdminConfig();
    if (adminConfig.sttProvider !== 'elevenlabs') {
      return NextResponse.json(
        { error: 'ElevenLabs STT chưa được bật trong admin settings' },
        { status: 400 }
      );
    }

    const elevenlabs = new ElevenLabsClient({ apiKey });
    const tokenResponse = await elevenlabs.tokens.singleUse.create('realtime_scribe');

    return NextResponse.json({ token: tokenResponse.token });
  } catch (error: unknown) {
    console.error('ElevenLabs STT token error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Không tạo được STT token', details: message },
      { status: 500 }
    );
  }
}
