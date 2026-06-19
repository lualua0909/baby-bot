'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AppIcon, type IconName } from '@/components/ui/AppIcon';

interface ActionConfig {
  id: string;
  icon: IconName;
  wakeIcon?: IconName;
  label: string;
  cooldown: number;
  color: string;
}

const ACTIONS: ActionConfig[] = [
  { id: 'feed', icon: 'feed', label: 'FEED', cooldown: 10, color: '#f59e0b' },
  { id: 'play', icon: 'play', label: 'PLAY', cooldown: 15, color: '#ec4899' },
  { id: 'sleep', icon: 'sleep', wakeIcon: 'wake', label: 'REST', cooldown: 30, color: '#8b5cf6' },
  { id: 'cuddle', icon: 'cuddle', label: 'PET', cooldown: 10, color: '#ef4444' },
  { id: 'sing', icon: 'sing', label: 'SING', cooldown: 20, color: '#22c55e' },
];

export default function ActionButtons({
  onAction,
  isSleeping,
}: {
  onAction: (action: string) => void;
  isSleeping: boolean;
}) {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handleAction = useCallback(
    (action: ActionConfig) => {
      if (cooldowns[action.id] && cooldowns[action.id] > Date.now()) return;
      if (isSleeping && action.id !== 'sleep') return;

      onAction(action.id);
      setActiveBtn(action.id);
      setTimeout(() => setActiveBtn(null), 300);

      setCooldowns((prev) => ({
        ...prev,
        [action.id]: Date.now() + action.cooldown * 1000,
      }));

      setTimeout(() => {
        setCooldowns((prev) => {
          const next = { ...prev };
          delete next[action.id];
          return next;
        });
      }, action.cooldown * 1000);
    },
    [cooldowns, onAction, isSleeping]
  );

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {ACTIONS.map((action) => {
        const isOnCooldown = cooldowns[action.id] && cooldowns[action.id] > Date.now();
        const isDisabled = isOnCooldown || (isSleeping && action.id !== 'sleep');
        const isActive = activeBtn === action.id;
        const buttonIcon =
          isSleeping && action.id === 'sleep' ? (action.wakeIcon ?? action.icon) : action.icon;
        const buttonLabel = isSleeping && action.id === 'sleep' ? 'WAKE' : action.label;

        return (
          <motion.button
            key={action.id}
            onClick={() => handleAction(action)}
            disabled={!!isDisabled}
            className={`relative flex flex-col items-center gap-1 px-3 py-2 glass pixel-border rounded-lg
              transition-all duration-100
              ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5 active:translate-y-[2px]'}
              ${isActive ? 'translate-y-[2px]' : ''}`}
            style={{
              boxShadow: isActive
                ? `0 0 12px ${action.color}44, inset 0 0 8px ${action.color}22`
                : undefined,
              borderColor: isActive ? `${action.color}66` : undefined,
            }}
            title={buttonLabel}
          >
            <AppIcon name={buttonIcon} className="h-5 w-5" style={{ color: action.color }} />
            <span className="text-[6px] font-pixel text-white/40 tracking-wider">{buttonLabel}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
