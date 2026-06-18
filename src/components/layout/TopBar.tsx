'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import KidIconButton from '@/components/ui/KidIconButton';

export default function TopBar() {
  const coins = useAppStore((s) => s.coins);
  const level = useAppStore((s) => s.level);
  const levelProgress = useAppStore((s) => s.levelProgress);
  const petName = useAppStore((s) => s.settings.petName);
  const setSettingsOpen = useAppStore((s) => s.setSettingsOpen);

  return (
    <header className="relative z-20 grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-3 md:px-6 md:py-4">
      {/* Level badge — cartoon outlined disc with progress ring */}
      <motion.div className="flex items-center gap-2 justify-self-start" whileHover={{ scale: 1.05 }}>
        <div className="cartoon-surface relative w-12 h-12 md:w-14 md:h-14 rounded-full" style={{ ['--face' as string]: '#ffffff', ['--edge' as string]: '#f0e6c8' }}>
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
            <motion.circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#A7D02C"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${levelProgress} 100`}
              initial={false}
              animate={{ strokeDasharray: `${levelProgress} 100` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-extrabold text-tom-lime-dark text-lg md:text-xl">
            {level}
          </span>
        </div>
        <span className="cartoon-text text-base md:text-lg hidden sm:block">{petName}</span>
      </motion.div>

      {/* Coin pill — cartoon gold pill */}
      <motion.div
        key={coins}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.4 }}
        className="cartoon-surface justify-self-center flex items-center gap-1.5 rounded-full pl-1.5 pr-4 py-1.5"
        style={{ ['--face' as string]: '#ffe56d', ['--edge' as string]: '#ffba3b' }}
      >
        <span className="relative z-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-b from-yellow-200 to-tom-wood-dark border-2 border-yellow-100 flex items-center justify-center text-sm">
          🪙
        </span>
        <span className="relative z-10 cartoon-text text-lg md:text-xl leading-none">{coins}</span>
      </motion.div>

      {/* Action buttons */}
      <div className="justify-self-end flex items-center gap-2">
        <KidIconButton color="#3FA9F5" ariaLabel="Cài đặt trẻ em" onClick={() => setSettingsOpen(true)}>
          🎨
        </KidIconButton>
        <Link href="/settings" className="inline-flex">
          <KidIconButton color="#F0552B" ariaLabel="Admin settings">
            ⚙️
          </KidIconButton>
        </Link>
      </div>
    </header>
  );
}
