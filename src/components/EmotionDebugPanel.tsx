'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Emotion, ALL_EMOTIONS, EMOTION_CONFIGS } from '@/lib/emotionEngine';

const EMOTION_ICONS: Record<Emotion, string> = {
  neutral: '😐',
  blink_high: '😑',
  happy: '😊',
  glee: '🤩',
  blink_low: '😌',
  sad_down: '😞',
  sad_up: '🥺',
  worried: '😟',
  focused: '🧐',
  annoyed: '😒',
  surprised: '😲',
  skeptic: '🤨',
  frustrated: '😤',
  unimpressed: '😑',
  sleepy: '😴',
  suspicious: '🫣',
  squint: '😑',
  angry: '😠',
  furious: '🤬',
  scared: '😨',
  awe: '😯',
  sleeping: '💤',
};

const COLOR_PRESETS = [
  { label: 'Cyan', eye: '#00e5ff', glow: '#00e5ff' },
  { label: 'Teal', eye: '#1de9b6', glow: '#1de9b6' },
  { label: 'Green', eye: '#69f0ae', glow: '#69f0ae' },
  { label: 'Purple', eye: '#b388ff', glow: '#b388ff' },
  { label: 'Pink', eye: '#f48fb1', glow: '#f48fb1' },
  { label: 'Orange', eye: '#ffab40', glow: '#ffab40' },
  { label: 'Red', eye: '#ff5252', glow: '#ff5252' },
  { label: 'Blue', eye: '#448aff', glow: '#448aff' },
  { label: 'Yellow', eye: '#ffd740', glow: '#ffd740' },
  { label: 'White', eye: '#ffffff', glow: '#ffffff' },
];

export default function EmotionDebugPanel({
  currentEmotion,
  onSetEmotion,
  onSetColor,
  currentColor,
}: {
  currentEmotion: Emotion;
  onSetEmotion: (emotion: Emotion) => void;
  onSetColor?: (eyeColor: string, glowColor: string) => void;
  currentColor?: string;
}) {
  const [showColorPanel, setShowColorPanel] = useState(false);

  return (
    <div className="space-y-2">
      {/* Emotions Grid */}
      <div className="glass pixel-border rounded-lg p-3">
        <div className="text-[7px] font-pixel text-white/30 tracking-wider uppercase mb-2 text-center">
          Debug: 22 Emotions
        </div>
        <div className="grid grid-cols-7 gap-1">
          {ALL_EMOTIONS.map((em) => {
            const config = EMOTION_CONFIGS[em];
            const isActive = currentEmotion === em;
            return (
              <motion.button
                key={em}
                onClick={() => onSetEmotion(em)}
                whileTap={{ scale: 0.9 }}
                className={`
                  relative flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-md
                  transition-all duration-200 border
                  ${isActive
                    ? 'border-white/30 bg-white/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'}
                `}
                style={{
                  boxShadow: isActive ? `0 0 12px ${config.glowColor}44, 0 0 4px ${config.glowColor}22` : 'none',
                }}
                title={config.label}
              >
                <span className="text-base leading-none">{EMOTION_ICONS[em]}</span>
                <span
                  className="text-[5px] font-pixel tracking-wider uppercase leading-tight text-center"
                  style={{ color: isActive ? config.eyeColor : 'rgba(255,255,255,0.25)' }}
                >
                  {config.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="emotion-indicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: config.eyeColor }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Color Toggle Button */}
      {onSetColor && (
        <button
          onClick={() => setShowColorPanel(p => !p)}
          className="w-full text-[7px] font-pixel text-white/30 hover:text-white/50 tracking-wider uppercase text-center py-1 border border-white/5 rounded-md hover:border-white/10 transition-all"
        >
          {showColorPanel ? '▲ Hide Colors' : '▼ Eye Color'}
        </button>
      )}

      {/* Color Picker Panel */}
      {onSetColor && showColorPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass pixel-border rounded-lg p-3"
        >
          <div className="text-[7px] font-pixel text-white/30 tracking-wider uppercase mb-2 text-center">
            Eye Color
          </div>

          {/* Preset colors */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {COLOR_PRESETS.map((preset) => {
              const isActive = currentColor === preset.eye;
              return (
                <button
                  key={preset.label}
                  onClick={() => onSetColor(preset.eye, preset.glow)}
                  className={`
                    w-7 h-7 rounded-full border-2 transition-all duration-200
                    ${isActive ? 'border-white scale-110' : 'border-white/20 hover:border-white/50 hover:scale-105'}
                  `}
                  style={{
                    backgroundColor: preset.eye,
                    boxShadow: isActive ? `0 0 12px ${preset.eye}88, 0 0 4px ${preset.eye}44` : `0 0 6px ${preset.eye}22`,
                  }}
                  title={preset.label}
                />
              );
            })}
          </div>

          {/* Custom color picker */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-[6px] font-pixel text-white/30 uppercase">Custom:</span>
            <input
              type="color"
              value={currentColor || '#00e5ff'}
              onChange={(e) => onSetColor(e.target.value, e.target.value)}
              className="w-8 h-6 rounded cursor-pointer bg-transparent border border-white/10"
            />
            <span className="text-[7px] font-mono text-white/40">{currentColor || '#00e5ff'}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
