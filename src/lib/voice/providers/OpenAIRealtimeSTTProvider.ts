import type { VoiceProvider, SpeechResult, TTSResult } from '@/types/voice';
import { encodePcm16Base64, resampleTo24kHz } from '@/lib/voice/audioUtils';

interface RealtimeServerEvent {
  type: string;
  transcript?: string;
  error?: { message?: string };
}

/**
 * OpenAI Realtime API for STT only.
 * Uses gpt-4o-mini-realtime-preview (cheapest) + whisper-1 transcription.
 * Ignores auto-generated responses to minimize cost.
 */
export class OpenAIRealtimeSTTProvider implements VoiceProvider {
  readonly name = 'openai-realtime' as const;

  private ws: WebSocket | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private callbacks: {
    onTranscript?: (result: SpeechResult) => void;
    onError?: (error: Error) => void;
  } = {};
  private interimText = '';

  isSupported(): boolean {
    return typeof WebSocket !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices;
  }

  async startListening(
    callbacks: {
      onTranscript?: (result: SpeechResult) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    this.callbacks = callbacks;
    this.interimText = '';

    const sessionRes = await fetch('/api/realtime/session', { method: 'POST' });
    if (!sessionRes.ok) {
      const err = await sessionRes.json().catch(() => ({ error: 'Session failed' }));
      throw new Error(typeof err.error === 'string' ? err.error : 'Không tạo được Realtime session');
    }

    const { clientSecret, model } = (await sessionRes.json()) as {
      clientSecret: string;
      model: string;
    };

    await this.connectWebSocket(clientSecret, model);
    await this.startMicrophone();
  }

  private connectWebSocket(clientSecret: string, model: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(
        `wss://api.openai.com/v1/realtime?model=${model}`,
        ['realtime', `openai-insecure-api-key.${clientSecret}`, 'openai-beta.realtime-v1']
      );

      this.ws = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'session.update',
            session: {
              modalities: ['text'],
              input_audio_transcription: { model: 'whisper-1' },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 900,
              },
            },
          })
        );
        resolve();
      };

      ws.onmessage = (event) => {
        this.handleServerEvent(event.data as string);
      };

      ws.onerror = () => {
        this.callbacks.onError?.(new Error('Lỗi kết nối OpenAI Realtime'));
        reject(new Error('WebSocket error'));
      };

      ws.onclose = () => {
        this.cleanupAudio();
      };
    });
  }

  private handleServerEvent(raw: string): void {
    let data: RealtimeServerEvent;
    try {
      data = JSON.parse(raw) as RealtimeServerEvent;
    } catch {
      return;
    }

    switch (data.type) {
      case 'conversation.item.input_audio_transcription.delta':
        if (data.transcript) {
          this.interimText += data.transcript;
          this.callbacks.onTranscript?.({
            text: this.interimText,
            isFinal: false,
          });
        }
        break;

      case 'conversation.item.input_audio_transcription.completed':
        if (data.transcript) {
          this.callbacks.onTranscript?.({
            text: data.transcript,
            isFinal: true,
          });
          this.interimText = '';
        }
        break;

      // Cancel auto-responses to reduce cost — we only need STT
      case 'response.created':
        this.ws?.send(JSON.stringify({ type: 'response.cancel' }));
        break;

      case 'error':
        this.callbacks.onError?.(
          new Error(data.error?.message ?? 'OpenAI Realtime error')
        );
        break;
    }
  }

  private async startMicrophone(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.processor = processor;

    processor.onaudioprocess = (e) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      const input = e.inputBuffer.getChannelData(0);
      const resampled = resampleTo24kHz(input, this.audioContext?.sampleRate ?? 44100);
      const base64 = encodePcm16Base64(resampled);

      this.ws.send(
        JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64,
        })
      );
    };

    source.connect(processor);
    processor.connect(this.audioContext.destination);
  }

  stopListening(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
      setTimeout(() => this.ws?.close(), 500);
    } else {
      this.ws?.close();
    }
    this.cleanupAudio();
  }

  private cleanupAudio(): void {
    this.processor?.disconnect();
    this.processor = null;
    this.mediaStream?.getTracks().forEach((t) => t.stop());
    this.mediaStream = null;
    void this.audioContext?.close();
    this.audioContext = null;
  }

  async synthesize(_text: string): Promise<TTSResult> {
    throw new Error('OpenAIRealtimeSTTProvider does not support TTS');
  }

  destroy(): void {
    this.stopListening();
    this.ws = null;
    this.callbacks = {};
  }
}
