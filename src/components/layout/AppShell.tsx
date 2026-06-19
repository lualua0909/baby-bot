'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomMenu from '@/components/layout/BottomMenu';
import PetCanvas from '@/components/three/PetCanvas';
import AIStateBadge from '@/components/ui/AIStateBadge';
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
import { CartoonDialog } from '@/components/cartoon';
import { AppIcon } from '@/components/ui/AppIcon';
import { cartoonBackground } from '@/styles/cartoon-tokens';
import { cn } from '@/lib/utils';
import EmotionBar from '@/components/ui/EmotionBar';
import EmotionParticles from '@/components/EmotionParticles';

export default function AppShell() {
  const appMode = useAppStore((s) => s.appMode);
  const setAppMode = useAppStore((s) => s.setAppMode);
  const activeGame = useAppStore((s) => s.activeGame);
  const setActiveGame = useAppStore((s) => s.setActiveGame);
  const emotionBurst = useAppStore((s) => s.emotionBurst);
  const clearEmotionBurst = useAppStore((s) => s.clearEmotionBurst);

  const lipSyncRef = useRef<LipSyncManager | null>(null);
  const { isSpeaking, isListening, toggleListening, startListening, stopListening, speakText, speakChunk } =
    useVoiceChat(lipSyncRef);
  const { startStory } = useStoryMode(speakText, speakChunk);

  const [storyOpen, setStoryOpen] = useState(false);
  const [gamePickerOpen, setGamePickerOpen] = useState(false);
  const [loadingBgVisible, setLoadingBgVisible] = useState(true);

  const handleSceneReady = useCallback(() => {
    setLoadingBgVisible(false);
    document.body.classList.remove('scene-loading');
  }, []);

  useEffect(() => {
    if (appMode === 'story') setStoryOpen(true);
    if (appMode === 'game' && !activeGame) setGamePickerOpen(true);
  }, [appMode, activeGame]);

  // Particle khi chạm vào nhân vật chỉ là hiệu ứng thoáng qua → tự tắt sau ~2s.
  useEffect(() => {
    if (!emotionBurst) return;
    const timer = setTimeout(clearEmotionBurst, 2000);
    return () => clearTimeout(timer);
  }, [emotionBurst, clearEmotionBurst]);

  const prevAppModeRef = useRef(appMode);

  useEffect(() => {
    const enteredVoice = appMode === 'voice' && prevAppModeRef.current !== 'voice';
    const leftVoice = appMode !== 'voice' && prevAppModeRef.current === 'voice';
    prevAppModeRef.current = appMode;

    if (enteredVoice) {
      void startListening();
    } else if (leftVoice) {
      stopListening();
    }
  }, [appMode, startListening, stopListening]);

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
    <div
      className={cn(
        'relative h-dvh w-full overflow-hidden flex flex-col',
        loadingBgVisible ? 'bg-transparent' : cartoonBackground.page
      )}
    >
      {/* Nền: gradient mặc định + ảnh loading phía sau (không che UI). */}
      <div className="fixed inset-0 -z-10" aria-hidden>
        <div className="scene-backdrop absolute inset-0" />
        <div
          id="backdrop-asset"
          data-slot="backdrop-asset"
          className={cn(
            'absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500',
            !loadingBgVisible && 'opacity-0'
          )}
          style={{ backgroundImage: "url('/loading.png')" }}
        />
      </div>

      {/* Sân khấu 3D trải full màn hình (phía sau UI) để nhân vật có đủ
          khoảng dọc, tránh bị cụt đầu khi nhảy. */}
      <div className="fixed inset-0 z-0">
        <PetCanvas
          isSpeaking={isSpeaking}
          lipSyncRef={lipSyncRef}
          onSceneReady={handleSceneReady}
        />
      </div>

      {/* Hiệu ứng particle thoáng qua khi chạm vào nhân vật (phủ trên sân khấu). */}
      {emotionBurst && (
        <div className="fixed inset-0 z-[5] pointer-events-none">
          <EmotionParticles emotion={emotionBurst} />
        </div>
      )}

      <TopBar />

      <EmotionBar speakText={speakText} />

      <main className="relative z-10 flex-1 min-h-0 overflow-hidden pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pointer-events-none">
        <AnimatePresence mode="wait">
          {appMode === 'voice' && (
            <motion.div
              key="voice"
              className="pointer-events-none flex w-full max-w-xl justify-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <VoiceChatPanel isListening={isListening} onToggleListening={() => void toggleListening()} />
            </motion.div>
          )}
          {appMode === 'english' && <EnglishModePanel speakText={speakText} />}
          {appMode === 'singing' && <SingingModePanel speakText={speakText} />}
        </AnimatePresence>

        <div className="pointer-events-none flex w-full justify-center">
          <BottomMenu isListening={isListening} />
        </div>
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

      <CartoonDialog
        open={activeGame !== null}
        onClose={handleGameComplete}
        title={
          <span className="inline-flex items-center gap-2">
            <AppIcon name="game" className="h-6 w-6" />
            Trò chơi
          </span>
        }
      >
        {activeGame === 'guess-animal' && (
          <GuessAnimalGame speakText={speakText} onComplete={handleGameComplete} />
        )}
        {activeGame === 'guess-color' && (
          <GuessColorGame speakText={speakText} onComplete={handleGameComplete} />
        )}
        {activeGame === 'number-quiz' && (
          <NumberQuizGame speakText={speakText} onComplete={handleGameComplete} />
        )}
      </CartoonDialog>

      <SettingsModal />

      <AIStateBadge />
    </div>
  );
}
