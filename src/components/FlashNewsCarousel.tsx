import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Zap, ArrowUpRight } from 'lucide-react';
import { FlashNewsItem } from '../types';

interface FlashNewsCarouselProps {
  items: FlashNewsItem[];
  onSelectArticleById?: (articleId: string) => void;
}

export const FlashNewsCarousel: React.FC<FlashNewsCarouselProps> = ({
  items,
  onSelectArticleById,
}) => {
  const activeItems = items.filter((item) => item.active);
  const displayItems = activeItems.length > 0 ? activeItems : items;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep index in valid bounds if items length changes
  useEffect(() => {
    if (currentIndex >= displayItems.length) {
      setCurrentIndex(0);
    }
  }, [displayItems.length, currentIndex]);

  // Auto-advance interval (5 seconds)
  useEffect(() => {
    if (isPaused || displayItems.length <= 1) return;

    timerRef.current = setInterval(() => {
      setDirection('next');
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, displayItems.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const handleTogglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused((prev) => !prev);
  };

  if (displayItems.length === 0) {
    return (
      <div className="flex items-center gap-2 text-stone-400 text-[11px] font-sans">
        <span className="font-bold tracking-widest text-red-400 uppercase shrink-0">FLASH</span>
        <span>|</span>
        <span className="text-stone-400">All bureau desks reporting standard operations.</span>
      </div>
    );
  }

  const currentItem = displayItems[currentIndex];

  const slideVariants = {
    initial: (dir: 'next' | 'prev') => ({
      opacity: 0,
      y: dir === 'next' ? 6 : -6,
    }),
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: 'easeOut' },
    },
    exit: (dir: 'next' | 'prev') => ({
      opacity: 0,
      y: dir === 'next' ? -6 : 6,
      transition: { duration: 0.18, ease: 'easeIn' },
    }),
  };

  return (
    <div
      className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 font-sans"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* FLASH BADGE with pulsing beacon */}
      <div className="flex items-center gap-1.5 shrink-0 bg-red-950/70 border border-red-800/80 text-red-300 px-2 py-0.5 rounded-xs select-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="font-bold tracking-widest text-[10px] text-red-200 uppercase flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5 text-red-400" />
          <span>FLASH</span>
        </span>
      </div>

      <span className="text-stone-700 hidden sm:inline select-none">|</span>

      {/* CAROUSEL TICKER BODY */}
      <div className="relative flex-1 min-w-0 h-5 overflow-hidden flex items-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentItem.id}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex items-center gap-2 truncate"
          >
            {/* Category / Urgency Tag */}
            {currentItem.urgent && (
              <span className="shrink-0 text-[9px] uppercase tracking-wider font-bold bg-red-900/80 text-red-200 border border-red-700 px-1 rounded-xs">
                Breaking
              </span>
            )}
            {currentItem.category && (
              <span className="shrink-0 text-[9px] uppercase tracking-wider font-mono text-stone-400 bg-stone-800/80 px-1 rounded-xs">
                {currentItem.category}
              </span>
            )}

            {/* Flash Text (clickable if linked to article) */}
            <span
              onClick={() => {
                if (currentItem.articleId && onSelectArticleById) {
                  onSelectArticleById(currentItem.articleId);
                }
              }}
              title={currentItem.articleId ? 'Click to open related article' : undefined}
              className={`truncate text-stone-200 text-xs sm:text-[11px] transition-colors ${
                currentItem.articleId
                  ? 'cursor-pointer hover:text-white hover:underline decoration-stone-500 underline-offset-2 flex items-center gap-1'
                  : ''
              }`}
            >
              <span>{currentItem.text}</span>
              {currentItem.articleId && (
                <ArrowUpRight className="w-3 h-3 text-stone-400 shrink-0 inline opacity-70" />
              )}
            </span>

            {/* Timestamp tag */}
            {currentItem.timestamp && (
              <span className="hidden md:inline shrink-0 text-[10px] text-stone-400 font-mono">
                ({currentItem.timestamp})
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CAROUSEL CONTROLS */}
      {displayItems.length > 1 && (
        <div className="flex items-center gap-1 shrink-0 select-none pl-1">
          {/* Item Counter */}
          <span className="text-[10px] font-mono text-stone-400 px-1 hidden sm:inline">
            {currentIndex + 1}/{displayItems.length}
          </span>

          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 rounded-xs transition-colors"
            title="Previous flash dispatch"
            aria-label="Previous flash dispatch"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Pause / Play Toggle */}
          <button
            onClick={handleTogglePlayPause}
            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 rounded-xs transition-colors"
            title={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
            aria-label={isPaused ? 'Resume auto-cycle' : 'Pause auto-cycle'}
          >
            {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-1 hover:bg-stone-800 text-stone-400 hover:text-stone-100 rounded-xs transition-colors"
            title="Next flash dispatch"
            aria-label="Next flash dispatch"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
