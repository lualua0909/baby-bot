'use client';

import { motion } from 'framer-motion';

interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function StatBar({ label, value, icon, color }: StatBarProps) {
  // Create pixel blocks for the stat bar
  const totalBlocks = 10;
  const filledBlocks = Math.round((value / 100) * totalBlocks);

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-base w-6 text-center" style={{ imageRendering: 'pixelated' }}>{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-[8px] font-pixel text-white/50 uppercase tracking-wider">{label}</span>
          <span className="text-[8px] font-pixel text-white/40">{Math.round(value)}</span>
        </div>
        <div className="flex gap-[2px] h-3">
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: i < filledBlocks ? 1 : 0.15,
                scaleY: 1,
              }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              style={{
                backgroundColor: i < filledBlocks ? color : 'rgba(255,255,255,0.1)',
                boxShadow: i < filledBlocks ? `0 0 6px ${color}44` : 'none',
                imageRendering: 'pixelated',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StatsPanel({
  hunger,
  happiness,
  energy,
  affection,
}: {
  hunger: number;
  happiness: number;
  energy: number;
  affection: number;
}) {
  return (
    <div className="glass pixel-border rounded-lg p-4 space-y-3">
      <StatBar label="HNG" value={hunger} icon="🍙" color="#f59e0b" />
      <StatBar label="JOY" value={happiness} icon="✨" color="#ec4899" />
      <StatBar label="NRG" value={energy} icon="⚡" color="#8b5cf6" />
      <StatBar label="LUV" value={affection} icon="💖" color="#ef4444" />
    </div>
  );
}
