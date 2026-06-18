'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PetState } from '@/lib/petState';
import { detectEmotionFromMessage } from '@/lib/emotionDetector';

interface Message {
  role: 'user' | 'pet';
  content: string;
}

interface StatChanges {
  happiness?: number;
  affection?: number;
  hunger?: number;
  energy?: number;
  emotion?: string;
}

export default function ChatInterface({
  petState,
  onStatChanges,
}: {
  petState: PetState;
  onStatChanges: (changes: StatChanges) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string, context?: string) => {
      if (!text.trim() && !context) return;

      const userMessage = text.trim() || context || '';

      if (text.trim()) {
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

        // Instant emotion detection from user message
        const detectedEmotion = detectEmotionFromMessage(userMessage);
        if (detectedEmotion) {
          onStatChanges({ emotion: detectedEmotion });
        }
      }

      setInput('');
      setIsTyping(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            petState: {
              name: petState.name,
              hunger: petState.hunger,
              happiness: petState.happiness,
              energy: petState.energy,
              affection: petState.affection,
              age: petState.age,
              emotion: petState.emotion,
              isSleeping: petState.isSleeping,
            },
            context,
          }),
        });

        if (!response.ok) throw new Error('Failed to send message');

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let fullResponse = '';

        setMessages((prev) => [...prev, { role: 'pet', content: '' }]);
        setIsTyping(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;

          // Don't display JSON stat block
          const displayText = fullResponse.replace(/\n?\{[^}]*"(happiness|emotion)"[^}]*\}\s*$/s, '').trim();

          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'pet', content: displayText };
            return updated;
          });
        }

        // Extract stat changes from API response (overrides instant detection with AI's choice)
        const jsonMatch = fullResponse.match(/\{[^}]*"(happiness|emotion)"[^}]*\}/);
        if (jsonMatch) {
          try {
            const changes = JSON.parse(jsonMatch[0]) as StatChanges;
            onStatChanges(changes);
          } catch {
            // Ignore JSON parse errors
          }
        }
      } catch {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: 'pet', content: '*ngáp* ...ôi, đầu mình xoay xoay quá...' },
        ]);
      }
    },
    [petState, onStatChanges]
  );

  // Expose sendMessage for action context
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__auraSendMessage = sendMessage;
    return () => {
      delete (window as unknown as Record<string, unknown>).__auraSendMessage;
    };
  }, [sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input);
  };

  return (
    <div className="glass pixel-border rounded-lg flex flex-col h-[300px] overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-white/20 text-[8px] font-pixel pt-8 leading-relaxed">
            NÓI GÌ ĐÓ VỚI {petState.name.toUpperCase()} ĐI...
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/30 text-white/90 rounded-br-sm'
                    : 'glass text-white/80 rounded-bl-sm'
                }`}
              >
                <span className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass px-4 py-2 rounded-2xl rounded-bl-sm">
              <span className="text-white/40 text-sm typing-cursor">đang nghĩ</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Nói chuyện với ${petState.name}...`}
            className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm font-mono text-white/80
              placeholder:text-white/20 outline-none focus:ring-1 focus:ring-indigo-500/30
              transition-all duration-200"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/30 text-white/70 text-sm font-outfit
              hover:bg-indigo-600/50 disabled:opacity-30 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
}
