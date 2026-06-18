'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import KidButton from '@/components/ui/KidButton';

interface VoiceChatPanelProps {
  isListening: boolean;
  onToggleListening: () => void;
}

export default function VoiceChatPanel({ isListening, onToggleListening }: VoiceChatPanelProps) {
  const subtitle = useAppStore((s) => s.subtitle);
  const aiState = useAppStore((s) => s.aiState);

  const stateLabel: Record<string, string> = {
    IDLE: 'Chạm mic để nói chuyện!',
    LISTENING: 'Đang nghe bé nói...',
    THINKING: 'Đang suy nghĩ...',
    SPEAKING: 'Đang trả lời...',
    HAPPY: 'Vui quá!',
    SAD: 'Buồn quá...',
    EXCITED: 'Hào hứng!',
  };

  const displayText = subtitle || stateLabel[aiState] || 'Chạm mic để nói chuyện!';

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayText}
          initial={{ opacity: 0, y: 10, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.7 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          whileHover={{ scale: 1.05, rotate: -1.5 }}
          className="speech-bubble max-w-[18rem] px-5 py-2.5 text-center"
        >
          <span className="text-sm md:text-base font-bold text-[#4a6a7d]">
            {displayText}
          </span>
        </motion.div>
      </AnimatePresence>

      <KidButton
        color={isListening ? '#EF4444' : '#FF6B9D'}
        size="lg"
        active={isListening}
        pulsing={isListening}
        onClick={onToggleListening}
      >
        {isListening ? '⏹️' : '🎤'}
      </KidButton>
    </div>
  );
}
