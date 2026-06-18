'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import type { AIState } from '@/types/ai';

const STATE_CONFIG: Record<AIState, { emoji: string; label: string; color: string }> = {
  IDLE: { emoji: '😊', label: 'Chào bé!', color: '#A78BFA' },
  LISTENING: { emoji: '👂', label: 'Đang nghe...', color: '#F472B6' },
  THINKING: { emoji: '🤔', label: 'Suy nghĩ...', color: '#FBBF24' },
  SPEAKING: { emoji: '💬', label: 'Đang nói...', color: '#60A5FA' },
  HAPPY: { emoji: '🎉', label: 'Vui quá!', color: '#4ADE80' },
  SAD: { emoji: '😢', label: 'Buồn quá...', color: '#94A3B8' },
  EXCITED: { emoji: '🚀', label: 'Hào hứng!', color: '#FB923C' },
};

/** Reveal `text` one char at a time (typewriter) when `enabled`. */
function useTypewriter(text: string, enabled: boolean, speed = 32) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      return;
    }
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, enabled, speed]);

  return shown;
}

/**
 * Cartoon speech bubble above the pet. While the pet speaks (story / chat) it
 * types out the spoken text in sync with the voice; otherwise it shows a short
 * status label. Bob animation + hover wiggle keep it lively.
 */
export default function AIStateBadge() {
  const aiState = useAppStore((s) => s.aiState);
  const subtitle = useAppStore((s) => s.subtitle);
  const config = STATE_CONFIG[aiState];

  // Show the spoken text whenever there is some, except while listening/thinking
  // (those are transient states where a status label reads better).
  const hasSpeech =
    !!subtitle.trim() && aiState !== 'LISTENING' && aiState !== 'THINKING';

  const fullText = hasSpeech ? subtitle.trim() : config.label;
  const typed = useTypewriter(fullText, hasSpeech);
  const text = hasSpeech ? typed : fullText;
  const isTyping = hasSpeech && typed.length < fullText.length;

  // Re-pop the bubble only when switching between speech and labels (or label
  // changes) — not on every typed character.
  const animKey = hasSpeech ? 'speech' : aiState;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
      <motion.div
        className="animate-bubble-bob pointer-events-auto"
        whileHover={{ scale: 1.06, rotate: -1.5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 14 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={animKey}
            initial={{ opacity: 0, y: -12, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="speech-bubble flex items-center gap-2 px-4 py-2 max-w-[min(85vw,24rem)] cursor-default"
          >
            <motion.span
              className="text-xl leading-none shrink-0"
              animate={
                aiState === 'LISTENING' || aiState === 'EXCITED'
                  ? { rotate: [0, -12, 12, 0] }
                  : { scale: [1, 1.15, 1] }
              }
              transition={{ repeat: Infinity, duration: 0.7 }}
            >
              {config.emoji}
            </motion.span>
            <span className="text-sm md:text-base font-bold text-[#4a6a7d] leading-snug text-left">
              {text}
              {isTyping && <span className="typing-caret" aria-hidden />}
            </span>
            {aiState === 'LISTENING' && (
              <span className="relative flex h-3 w-3 shrink-0">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: config.color }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3"
                  style={{ backgroundColor: config.color }}
                />
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
