'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Emotion, EMOTION_CONFIGS } from '@/lib/emotionEngine';

const SHAPES: Record<string, string[]> = {
  sparkle: ['✦', '✧', '⬥', '◆'],
  rain: ['│', '╎', '┊', '╏'],
  hearts: ['♥', '♡', '❤'],
  zzz: ['z', 'Z', 'z'],
  fire: ['▲', '△', '◢'],
  stars: ['★', '☆', '✦', '⭐'],
  none: [],
};

interface Particle {
  id: number;
  char: string;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export default function EmotionParticles({ emotion }: { emotion: Emotion }) {
  const config = EMOTION_CONFIGS[emotion];

  const particles = useMemo(() => {
    const chars = SHAPES[config.particleType] || [];
    if (chars.length === 0) return [];

    const result: Particle[] = [];
    const count = config.particleType === 'rain' ? 12 : 8;

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        char: chars[i % chars.length],
        x: 10 + Math.random() * 80,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 10 + Math.floor(Math.random() * 8),
      });
    }
    return result;
  }, [config.particleType]);

  const isRain = config.particleType === 'rain';
  const isZzz = config.particleType === 'zzz';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={`${emotion}-${p.id}`}
            className="absolute font-mono select-none"
            style={{
              left: `${p.x}%`,
              fontSize: p.size,
              color: config.particleColor,
              textShadow: `0 0 8px ${config.particleColor}, 0 0 16px ${config.particleColor}44`,
            }}
            initial={{
              top: isRain ? '-5%' : isZzz ? '30%' : '90%',
              opacity: 0,
              x: isZzz ? 60 : 0,
            }}
            animate={{
              top: isRain ? '105%' : isZzz ? '0%' : '-10%',
              opacity: [0, 0.7, 0.7, 0],
              x: isZzz ? [60, 80, 100] : [0, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 50],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {p.char}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
