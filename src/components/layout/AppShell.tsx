'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomMenu from '@/components/layout/BottomMenu';
import PetCanvas from '@/components/three/PetCanvas';
import VoiceChatPanel from '@/components/modes/VoiceChatPanel';
import StoryModeModal from '@/components/modes/StoryModeModal';
import { useStoryMode } from '@/hooks/useStoryMode';
import EnglishModePanel from '@/components/modes/EnglishModePanel';
import SingingModePanel from '@/components/modes/SingingModePanel';
import GameModeModal from '@/components/modes/GameModeModal';
import GuessAnimalGame from '@/components/games/GuessAnimalGame';
import GuessColorGame from '@/components/games/GuessColorGame';
import NumberQuizGame from '@/components/games/NumberQuizGame';
import SettingsModal from '@/components/settings/SettingsModal';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useAppStore } from '@/store/appStore';
import { LipSyncManager } from '@/lib/lipSync/LipSyncManager';
import type { GameType, StoryTheme } from '@/types/ai';
import KidModal from '@/components/ui/KidModal';
import FloatingDecor from '@/components/ui/FloatingDecor';

export default function AppShell() {
  const appMode = useAppStore((s) => s.appMode);
  const setAppMode = useAppStore((s) => s.setAppMode);
  const activeGame = useAppStore((s) => s.activeGame);
  const setActiveGame = useAppStore((s) => s.setActiveGame);

  const lipSyncRef = useRef<LipSyncManager | null>(null);
  const { isSpeaking, isListening, toggleListening, speakText, speakChunk } = useVoiceChat(lipSyncRef);
  const { startStory } = useStoryMode(speakText, speakChunk);

  const [storyOpen, setStoryOpen] = useState(false);
  const [gamePickerOpen, setGamePickerOpen] = useState(false);

  useEffect(() => {
    if (appMode === 'story') setStoryOpen(true);
    if (appMode === 'game' && !activeGame) setGamePickerOpen(true);
  }, [appMode, activeGame]);

  const handleStorySelect = useCallback(
    (theme: StoryTheme) => {
      void startStory(theme);
    },
    [startStory]
  );

  const handleGameSelect = useCallback(
    (game: GameType) => {
      setActiveGame(game);
      setGamePickerOpen(false);
    },
    [setActiveGame]
  );

  const handleGameComplete = useCallback(() => {
    setActiveGame(null);
    setAppMode('home');
  }, [setActiveGame, setAppMode]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* ---- Unified backdrop (single colour). PLACEHOLDER: drop a 2D image
           or 3D scene into #backdrop-asset later to replace the gradient. ---- */}
      <div className="fixed inset-0 -z-10 scene-backdrop" aria-hidden>
        <div id="backdrop-asset" data-slot="backdrop-asset" className="absolute inset-0" />
      </div>

      <FloatingDecor />
      <TopBar />

      <main className="relative z-10 flex-1 flex flex-col px-2 md:px-6 py-2 min-h-0">
        {/* Pet stage — ~70% of the screen on mobile portrait */}
        <div className="relative flex-1 min-h-[70vh] max-h-[74vh] md:min-h-[440px] md:max-h-none">
          <PetCanvas isSpeaking={isSpeaking} lipSyncRef={lipSyncRef} />
        </div>

        <AnimatePresence mode="wait">
          {appMode === 'voice' && (
            <motion.div key="voice" className="w-full max-w-xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <VoiceChatPanel isListening={isListening} onToggleListening={() => void toggleListening()} />
            </motion.div>
          )}
          {appMode === 'english' && (
            <motion.div key="english" className="w-full max-w-xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EnglishModePanel speakText={speakText} />
            </motion.div>
          )}
          {appMode === 'singing' && (
            <motion.div key="singing" className="w-full max-w-xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SingingModePanel speakText={speakText} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="relative z-20">
        <BottomMenu />
      </div>

      <StoryModeModal
        open={storyOpen && appMode === 'story'}
        onClose={() => {
          setStoryOpen(false);
          setAppMode('home');
        }}
        onSelect={handleStorySelect}
      />

      <GameModeModal
        open={gamePickerOpen && appMode === 'game' && !activeGame}
        onClose={() => {
          setGamePickerOpen(false);
          setAppMode('home');
        }}
        onSelect={handleGameSelect}
      />

      <KidModal open={activeGame !== null} onClose={handleGameComplete} title="🎮 Trò chơi">
        {activeGame === 'guess-animal' && (
          <GuessAnimalGame speakText={speakText} onComplete={handleGameComplete} />
        )}
        {activeGame === 'guess-color' && (
          <GuessColorGame speakText={speakText} onComplete={handleGameComplete} />
        )}
        {activeGame === 'number-quiz' && (
          <NumberQuizGame speakText={speakText} onComplete={handleGameComplete} />
        )}
      </KidModal>

      <SettingsModal />
    </div>
  );
}
