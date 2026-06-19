'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Emotion, EMOTION_CONFIGS } from '@/lib/emotionEngine';
import { AppIcon, type IconName } from '@/components/ui/AppIcon';

const PARTICLE_ICONS: Record<string, IconName[]> = {
  sparkle: ['sparkles', 'star', 'sparkles', 'star'],
  rain: ['cloud', 'cloud', 'cloud', 'cloud'],
  hearts: ['heart', 'heart', 'heart'],
  zzz: ['moon', 'moon', 'moon'],
  fire: ['flame', 'flame', 'flame'],
  stars: ['star', 'star', 'sparkles', 'star'],
  none: [],
};

interface Particle {
  id: number;
  icon: IconName;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export default function EmotionParticles({ emotion }: { emotion: Emotion }) {
  const config = EMOTION_CONFIGS[emotion];

  const particles = useMemo(() => {
    const icons = PARTICLE_ICONS[config.particleType] || [];
    if (icons.length === 0) return [];

    const result: Particle[] = [];
    const count = config.particleType === 'rain' ? 12 : 8;

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        icon: icons[i % icons.length],
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
            className="absolute select-none"
            style={{
              left: `${p.x}%`,
              color: config.particleColor,
              filter: `drop-shadow(0 0 8px ${config.particleColor}) drop-shadow(0 0 16px ${config.particleColor}44)`,
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
            <AppIcon name={p.icon} style={{ width: p.size, height: p.size }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
