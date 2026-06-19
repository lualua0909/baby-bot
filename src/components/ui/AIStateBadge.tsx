'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/store/appStore';
import { CartoonChatBubble, CartoonRow } from '@/components/cartoon';
import { AppIcon } from '@/components/ui/AppIcon';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

/** Luôn nằm trên mọi lớp UI (dialog z-50, reward z-60, …). */
const CHAT_BUBBLE_Z = 9999;

function useTypewriter(text: string, enabled: boolean, speed = 32) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!enabled) {
      setShown('');
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

  // Bubble chat chỉ hiển thị khi character đang nói; khi đợi response thì ẩn (nội dung đã clear).
  const visible = hasSpeech;

  if (!mounted) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: CHAT_BUBBLE_Z }}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute top-6 left-1/2 w-[min(88vw,26rem)] -translate-x-1/2 md:top-8">
        <motion.div className="animate-bubble-bob pointer-events-auto flex justify-center">
          <AnimatePresence mode="wait">
            {visible && (
              <motion.div
                key="speech"
                initial={{ opacity: 0, y: -12, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              >
                <CartoonChatBubble variant="ai" tail="down" className="max-w-full w-full">
                  <CartoonRow className="pointer-events-none">
                    <motion.span
                      className="leading-none shrink-0"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                    >
                      <AppIcon name="message" className="h-6 w-6 text-white" />
                    </motion.span>
                    <span className={cn(cartoonTypography.body, 'text-left text-white')}>
                      {typed}
                      {isTyping && <span className="typing-caret" aria-hidden />}
                    </span>
                  </CartoonRow>
                </CartoonChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
