'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CartoonStack, CartoonVoiceButton } from '@/components/cartoon';
import { useAppStore } from '@/store/appStore';
import { cartoonTypography } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';

interface VoiceChatPanelProps {
  isListening: boolean;
  onToggleListening: () => void;
}

export default function VoiceChatPanel({ isListening, onToggleListening }: VoiceChatPanelProps) {
  const userTranscript = useAppStore((s) => s.userTranscript);
  const text = userTranscript.trim();

  return (
    <CartoonStack className="pointer-events-auto px-4 py-2">
      <AnimatePresence>
        {text && (
          <motion.div
            key="user-transcript"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="max-w-[min(88vw,26rem)] rounded-2xl border-4 border-sky-600 bg-sky-500 px-4 py-2 shadow-md"
          >
            <span className={cn(cartoonTypography.body, 'text-center text-white')}>{text}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <CartoonVoiceButton isListening={isListening} onToggle={onToggleListening} />
    </CartoonStack>
  );
}
