import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onStoryViewed?: (storyId: string) => void;
}

export default function StoryViewer({ stories, initialStoryIndex, onClose, onStoryViewed }: StoryViewerProps) {
  const [currentStoryIdx, setCurrentStoryIdx] = useState(initialStoryIndex);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const activeStory = stories[currentStoryIdx];
  const imagesCount = activeStory?.images.length || 0;

  // Mark story as viewed
  useEffect(() => {
    if (activeStory && onStoryViewed) {
      onStoryViewed(activeStory.id);
    }
  }, [currentStoryIdx, activeStory, onStoryViewed]);

  // Reset image index when story changes
  useEffect(() => {
    setCurrentImageIdx(0);
    setProgress(0);
  }, [currentStoryIdx]);

  // Main timer logic for story progress
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 40; // update progress frequently for sub-pixel accuracy
    const duration = 4000; // 4 seconds per image
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentStoryIdx, currentImageIdx, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStoryIdx, currentImageIdx]);

  const handleNext = () => {
    setProgress(0);
    if (currentImageIdx < imagesCount - 1) {
      // Next image in current user's story
      setCurrentImageIdx((prev) => prev + 1);
    } else if (currentStoryIdx < stories.length - 1) {
      // Next user's story
      setCurrentStoryIdx((prev) => prev + 1);
    } else {
      // Out of stories
      onClose();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (currentImageIdx > 0) {
      // Previous image in current user's story
      setCurrentImageIdx((prev) => prev - 1);
    } else if (currentStoryIdx > 0) {
      // Previous user's story, start at its last image
      setCurrentStoryIdx((prev) => prev - 1);
    } else {
      // Already at the first story's first image, just restart progress
      setProgress(0);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessageSent(true);
    setMessageText('');
    setTimeout(() => setMessageSent(false), 2000);
  };

  if (!activeStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex items-center justify-center select-none md:p-4">
      {/* Background blur of story image */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-35 scale-105"
        style={{ backgroundImage: `url(${activeStory.images[currentImageIdx]})` }}
      />

      {/* Main Content Area */}
      <div className="relative w-full max-w-[450px] h-full md:h-[85vh] md:max-h-[800px] bg-black md:rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl border border-neutral-900 z-10">
        
        {/* Progress Bars Indicator */}
        <div className="absolute top-3 inset-x-3 flex gap-1 z-30">
          {activeStory.images.map((_, idx) => {
            let widthPercent = 0;
            if (idx < currentImageIdx) widthPercent = 100;
            else if (idx === currentImageIdx) widthPercent = progress;

            return (
              <div key={idx} className="h-1 bg-neutral-600/60 rounded-full flex-grow overflow-hidden">
                <div 
                  className="h-full bg-white transition-all ease-linear"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Header (User Info) */}
        <div className="absolute top-7 inset-x-3 flex items-center justify-between z-30 text-white bg-gradient-to-b from-black/50 to-transparent p-2">
          <div className="flex items-center gap-2.5">
            <img 
              src={activeStory.userAvatar} 
              alt={activeStory.username} 
              className="w-8 h-8 rounded-full border border-neutral-800 object-cover"
            />
            <span className="font-semibold text-xs text-shadow">{activeStory.username}</span>
            <span className="text-[10px] text-neutral-300 text-shadow">now</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPaused(!isPaused)} 
              className="hover:opacity-80 transition-opacity p-1"
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
            </button>
            <button 
              onClick={onClose} 
              className="hover:opacity-80 transition-opacity p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side Navigation Buttons (Desktop only) */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-800/40 hover:bg-neutral-800/80 rounded-full items-center justify-center text-white hidden md:flex z-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-neutral-800/40 hover:bg-neutral-800/80 rounded-full items-center justify-center text-white hidden md:flex z-30 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Interactive Tap Zones (Mobile/Direct Interaction) */}
        <div className="absolute inset-0 flex z-20">
          <div className="w-[30%] h-[85%] cursor-pointer" onClick={handlePrev} />
          <div className="w-[40%] h-[85%] cursor-pointer" onClick={() => setIsPaused(!isPaused)} />
          <div className="w-[30%] h-[85%] cursor-pointer" onClick={handleNext} />
        </div>

        {/* Main Image Stage */}
        <div className="w-full flex-grow flex items-center justify-center bg-zinc-950 relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentStoryIdx}-${currentImageIdx}`}
              src={activeStory.images[currentImageIdx]}
              alt="Story Content"
              className="w-full h-full object-contain max-h-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        </div>

        {/* Bottom Story Interaction Row */}
        <div className="p-4 z-30 bg-gradient-to-t from-black/80 to-transparent w-full flex items-center gap-3">
          <form onSubmit={handleSendMessage} className="flex-grow flex items-center gap-2 relative">
            <input 
              type="text"
              placeholder={`Reply to ${activeStory.username}...`}
              className="w-full bg-transparent text-xs text-white border border-neutral-700/80 rounded-full px-4 py-2.5 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-400 pr-10"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
            />
            <button 
              type="submit"
              className="absolute right-3 text-white hover:text-neutral-300 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Micro Animation indicator for sent reply */}
          <AnimatePresence>
            {messageSent && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-neutral-900/90 text-white text-xs px-4 py-2 rounded-full border border-neutral-800"
              >
                Reply sent to {activeStory.username}!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
