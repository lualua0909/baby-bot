'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Emotion, EMOTION_CONFIGS, EmotionConfig } from '@/lib/emotionEngine';

// --- Lerp helper for smooth transitions ---
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function parseColor(color: string): [number, number, number] {
  // Handle both "#rrggbb" and "rgb(r,g,b)" formats
  if (color.startsWith('#')) {
    const c = color.replace('#', '');
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }
  const match = color.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  return [0, 0, 0];
}

function toHex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = parseColor(a);
  const [br, bg, bb] = parseColor(b);
  const r = lerp(ar, br, t);
  const g = lerp(ag, bg, t);
  const bl = lerp(ab, bb, t);
  // Always return hex so hexToRgb and parseColor both work
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

// --- Canvas drawing ---
const CANVAS_W = 280;
const CANVAS_H = 200;

interface AnimState {
  // Current interpolated eye params
  leftW: number; leftH: number; leftR: number; leftTilt: number;
  rightW: number; rightH: number; rightR: number; rightTilt: number;
  eyeOffsetY: number; eyeGap: number;
  eyeColor: string; glowColor: string;
  glowIntensity: number; screenBrightness: number;
  bodyTilt: number;
}

function drawCozmoFace(
  ctx: CanvasRenderingContext2D,
  state: AnimState,
  time: number,
  blinkProgress: number, // 0 = open, 1 = closed
  lookX: number,
  lookY: number,
  bounceY: number,
) {
  const W = CANVAS_W;
  const H = CANVAS_H;
  ctx.clearRect(0, 0, W, H);

  ctx.save();

  // Body tilt
  const cx = W / 2;
  const cy = H / 2 + bounceY;
  ctx.translate(cx, cy);
  ctx.rotate((state.bodyTilt * Math.PI) / 180);
  ctx.translate(-cx, -cy);

  // --- Robot body (dark rounded rectangle) ---
  const bodyW = 220;
  const bodyH = 150;
  const bodyX = (W - bodyW) / 2;
  const bodyY = (H - bodyH) / 2 + bounceY;
  const bodyR = 30;

  // Outer body shadow
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;
  drawRoundRect(ctx, bodyX - 2, bodyY - 2, bodyW + 4, bodyH + 4, bodyR + 2);
  ctx.fillStyle = '#0d0d0d';
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Main body
  drawRoundRect(ctx, bodyX, bodyY, bodyW, bodyH, bodyR);
  const bodyGrad = ctx.createLinearGradient(bodyX, bodyY, bodyX, bodyY + bodyH);
  bodyGrad.addColorStop(0, '#2a2a2a');
  bodyGrad.addColorStop(0.3, '#1a1a1a');
  bodyGrad.addColorStop(1, '#0f0f0f');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Body edge highlight
  drawRoundRect(ctx, bodyX, bodyY, bodyW, bodyH, bodyR);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- Screen area (where eyes live) ---
  const screenMargin = 16;
  const screenX = bodyX + screenMargin;
  const screenY = bodyY + screenMargin;
  const screenW = bodyW - screenMargin * 2;
  const screenH = bodyH - screenMargin * 2;
  const screenR = 18;

  drawRoundRect(ctx, screenX, screenY, screenW, screenH, screenR);
  const screenGrad = ctx.createRadialGradient(
    cx, cy + bounceY, 0,
    cx, cy + bounceY, screenW * 0.7,
  );
  screenGrad.addColorStop(0, `rgba(${hexToRgb(state.glowColor)},${state.screenBrightness * 0.15})`);
  screenGrad.addColorStop(1, `rgba(0,0,0,0.95)`);
  ctx.fillStyle = '#050508';
  ctx.fill();
  drawRoundRect(ctx, screenX, screenY, screenW, screenH, screenR);
  ctx.fillStyle = screenGrad;
  ctx.fill();

  // Screen edge
  drawRoundRect(ctx, screenX, screenY, screenW, screenH, screenR);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- Eyes ---
  const eyeCenterX = cx + lookX * 8;
  const eyeCenterY = cy + bounceY + state.eyeOffsetY + lookY * 4;

  // Left eye
  drawEye(ctx,
    eyeCenterX - state.eyeGap / 2 - state.leftW / 2 + lookX * 3,
    eyeCenterY,
    state.leftW, state.leftH, state.leftR, state.leftTilt,
    state.eyeColor, state.glowIntensity, blinkProgress, time
  );

  // Right eye
  drawEye(ctx,
    eyeCenterX + state.eyeGap / 2 + state.rightW / 2 + lookX * 3,
    eyeCenterY,
    state.rightW, state.rightH, state.rightR, state.rightTilt,
    state.eyeColor, state.glowIntensity, blinkProgress, time
  );

  // --- Chin notch (Cozmo detail) ---
  const notchW = 30;
  const notchH = 8;
  const notchX = cx - notchW / 2;
  const notchY = bodyY + bodyH - notchH;
  drawRoundRect(ctx, notchX, notchY, notchW, notchH + 5, 4);
  ctx.fillStyle = '#151515';
  ctx.fill();

  ctx.restore();
}

function drawEye(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  w: number, h: number, r: number, tilt: number,
  color: string, glowIntensity: number,
  blinkProgress: number, _time: number,
) {
  // Apply blink — squish height
  const blinkH = h * (1 - blinkProgress * 0.92);
  const actualH = Math.max(2, blinkH);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tilt * Math.PI) / 180);

  // Glow behind eye
  ctx.shadowColor = color;
  ctx.shadowBlur = 15 * glowIntensity;

  // Eye shape
  const halfW = w / 2;
  const halfH = actualH / 2;
  const cornerR = Math.min(r, halfW, halfH);

  drawRoundRect(ctx, -halfW, -halfH, w, actualH, cornerR);
  ctx.fillStyle = color;
  ctx.fill();

  // Inner bright core
  ctx.shadowBlur = 0;
  const innerMargin = 3;
  if (actualH > innerMargin * 2 + 2) {
    drawRoundRect(ctx, -halfW + innerMargin, -halfH + innerMargin,
      w - innerMargin * 2, actualH - innerMargin * 2, Math.max(1, cornerR - 2));
    const innerGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
    innerGrad.addColorStop(0, `rgba(255,255,255,0.3)`);
    innerGrad.addColorStop(0.5, `rgba(255,255,255,0.05)`);
    innerGrad.addColorStop(1, `rgba(255,255,255,0.15)`);
    ctx.fillStyle = innerGrad;
    ctx.fill();
  }

  ctx.restore();
}

function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexToRgb(hex: string): string {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)}`;
}

// --- Main Component ---
export default function PetFace({
  emotion,
  action,
  colorOverride,
}: {
  emotion: Emotion;
  action: string | null;
  colorOverride?: { eyeColor: string; glowColor: string } | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animStateRef = useRef<AnimState | null>(null);
  const targetConfigRef = useRef<EmotionConfig>(EMOTION_CONFIGS[emotion]);
  const timeRef = useRef(0);
  const blinkRef = useRef({ timer: 0, isBlinking: false, progress: 0 });
  const lookRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, timer: 0 });
  const actionBounceRef = useRef(0);
  const [, setRender] = useState(0);

  // Update target when emotion or color override changes
  useEffect(() => {
    const base = EMOTION_CONFIGS[emotion];
    if (colorOverride) {
      targetConfigRef.current = {
        ...base,
        eyeColor: colorOverride.eyeColor,
        glowColor: colorOverride.glowColor,
      };
    } else {
      targetConfigRef.current = base;
    }
  }, [emotion, colorOverride]);

  // Trigger action bounce
  useEffect(() => {
    if (action) {
      actionBounceRef.current = 1;
    }
  }, [action]);

  const initState = useCallback((config: EmotionConfig): AnimState => {
    return {
      leftW: config.eyes.leftEye[0],
      leftH: config.eyes.leftEye[1],
      leftR: config.eyes.leftEye[2],
      leftTilt: config.eyes.leftEye[3],
      rightW: config.eyes.rightEye[0],
      rightH: config.eyes.rightEye[1],
      rightR: config.eyes.rightEye[2],
      rightTilt: config.eyes.rightEye[3],
      eyeOffsetY: config.eyes.eyeOffsetY,
      eyeGap: config.eyes.eyeGap,
      eyeColor: config.eyeColor,
      glowColor: config.glowColor,
      glowIntensity: config.glowIntensity,
      screenBrightness: config.screenBrightness,
      bodyTilt: config.bodyTilt,
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let animId: number;
    const config0 = EMOTION_CONFIGS[emotion];
    if (!animStateRef.current) {
      animStateRef.current = initState(config0);
    }

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) { animId = requestAnimationFrame(animate); return; }
      const ctx = canvas.getContext('2d');
      if (!ctx) { animId = requestAnimationFrame(animate); return; }

      timeRef.current += 1;
      const t = timeRef.current;
      const target = targetConfigRef.current;
      const state = animStateRef.current!;
      const lerpSpeed = 0.06;

      // Lerp all state towards target
      state.leftW = lerp(state.leftW, target.eyes.leftEye[0], lerpSpeed);
      state.leftH = lerp(state.leftH, target.eyes.leftEye[1], lerpSpeed);
      state.leftR = lerp(state.leftR, target.eyes.leftEye[2], lerpSpeed);
      state.leftTilt = lerp(state.leftTilt, target.eyes.leftEye[3], lerpSpeed);
      state.rightW = lerp(state.rightW, target.eyes.rightEye[0], lerpSpeed);
      state.rightH = lerp(state.rightH, target.eyes.rightEye[1], lerpSpeed);
      state.rightR = lerp(state.rightR, target.eyes.rightEye[2], lerpSpeed);
      state.rightTilt = lerp(state.rightTilt, target.eyes.rightEye[3], lerpSpeed);
      state.eyeOffsetY = lerp(state.eyeOffsetY, target.eyes.eyeOffsetY, lerpSpeed);
      state.eyeGap = lerp(state.eyeGap, target.eyes.eyeGap, lerpSpeed);
      state.glowIntensity = lerp(state.glowIntensity, target.glowIntensity, lerpSpeed);
      state.screenBrightness = lerp(state.screenBrightness, target.screenBrightness, lerpSpeed);
      state.bodyTilt = lerp(state.bodyTilt, target.bodyTilt, lerpSpeed);
      state.eyeColor = lerpColor(state.eyeColor, target.eyeColor, lerpSpeed);
      state.glowColor = lerpColor(state.glowColor, target.glowColor, lerpSpeed);

      // Blink logic
      const blink = blinkRef.current;
      blink.timer--;
      if (blink.timer <= 0 && !blink.isBlinking) {
        blink.isBlinking = true;
        blink.timer = 8; // blink duration in frames
      }
      if (blink.isBlinking) {
        if (blink.timer > 4) {
          blink.progress = Math.min(1, blink.progress + 0.35);
        } else {
          blink.progress = Math.max(0, blink.progress - 0.35);
          if (blink.progress <= 0) {
            blink.isBlinking = false;
            blink.timer = 80 + Math.floor(Math.random() * 120);
          }
        }
      }

      // Look direction
      const look = lookRef.current;
      look.timer--;
      if (look.timer <= 0) {
        look.targetX = (Math.random() - 0.5) * 2;
        look.targetY = (Math.random() - 0.5) * 1;
        look.timer = 60 + Math.floor(Math.random() * 100);
      }
      look.x = lerp(look.x, look.targetX, 0.04);
      look.y = lerp(look.y, look.targetY, 0.04);

      // Bounce
      const bounceSpeed = target.bounceSpeed;
      const bounceAmt = target.bounceAmount;
      let bounceY = Math.sin(t * bounceSpeed) * bounceAmt;

      // Action bounce
      if (actionBounceRef.current > 0) {
        actionBounceRef.current -= 0.03;
        bounceY += Math.sin(actionBounceRef.current * Math.PI * 4) * 8 * actionBounceRef.current;
      }

      drawCozmoFace(ctx, state, t, blink.progress, look.x, look.y, bounceY);

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [emotion, initState]);

  // Force a re-render to update glow div color
  useEffect(() => {
    const interval = setInterval(() => setRender(r => r + 1), 500);
    return () => clearInterval(interval);
  }, []);

  const config = EMOTION_CONFIGS[emotion];
  const displayGlow = colorOverride?.glowColor || config.glowColor;

  return (
    <div className="w-full max-w-[400px] mx-auto relative flex flex-col items-center">
      {/* Ambient glow behind robot */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 rounded-full blur-3xl pointer-events-none"
        animate={{
          backgroundColor: displayGlow,
          opacity: config.glowIntensity * 0.25,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="relative z-10"
        style={{
          width: CANVAS_W * 1.3,
          height: CANVAS_H * 1.3,
        }}
      />

      {/* Emotion label */}
      <motion.div
        className="mt-1 text-xs tracking-[0.3em] uppercase font-mono"
        animate={{ color: config.glowColor }}
        transition={{ duration: 0.8 }}
      >
        [ {config.label} ]
      </motion.div>
    </div>
  );
}
