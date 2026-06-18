'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/store/appStore';
import { CartoonChatBubble, CartoonRow } from '@/components/cartoon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

/** Luôn nằm trên mọi lớp UI (dialog z-50, reward z-60, …). */
const CHAT_BUBBLE_Z = 9999;

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

function ThinkingDots() {
  return (
    <CartoonRow className="pointer-events-none gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2.5 w-2.5 rounded-full bg-white"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
        />
      ))}
    </CartoonRow>
  );
}

export default function AIStateBadge() {
  const aiState = useAppStore((s) => s.aiState);
  const subtitle = useAppStore((s) => s.subtitle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isThinking = aiState === 'THINKING';
  const hasSpeech = !!subtitle.trim() && !isThinking && aiState !== 'LISTENING';

  const fullText = hasSpeech ? subtitle.trim() : '';
  const typed = useTypewriter(fullText, hasSpeech);
  const isTyping = hasSpeech && typed.length < fullText.length;

  // Bubble chat chỉ hiển thị khi character đang nói hoặc đang suy nghĩ.
  const visible = hasSpeech || isThinking;

  if (!mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: CHAT_BUBBLE_Z }}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute top-[max(5.5rem,14%)] left-1/2 w-[min(88vw,26rem)] -translate-x-1/2">
        <motion.div className="animate-bubble-bob pointer-events-auto flex justify-center">
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div
                key={isThinking ? 'thinking' : 'speech'}
                initial={{ opacity: 0, y: -12, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className={isThinking ? 'inline-block' : undefined}
              >
                {isThinking ? (
                  <CartoonChatBubble
                    variant="ai"
                    tail="down"
                    className="inline-flex w-auto max-w-none rounded-full px-4 py-3"
                  >
                    <ThinkingDots />
                  </CartoonChatBubble>
                ) : (
                  <CartoonChatBubble variant="ai" tail="down" className="max-w-full w-full">
                    <CartoonRow className="pointer-events-none">
                      <motion.span
                        className="text-2xl leading-none shrink-0"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 0.7 }}
                      >
                        💬
                      </motion.span>
                      <span className={cn(cartoonTypography.body, 'text-left text-white')}>
                        {typed}
                        {isTyping && <span className="typing-caret" aria-hidden />}
                      </span>
                    </CartoonRow>
                  </CartoonChatBubble>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
