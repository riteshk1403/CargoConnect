import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Sliders, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  isNotificationSoundEnabled,
  setNotificationSoundEnabled,
  getNotificationSoundVolume,
  setNotificationSoundVolume,
  playTestNotificationSound
} from '../utils/notificationSound';

const NotificationSoundControl = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(60);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const popoverRef = useRef(null);

  // Load preferences on mount
  useEffect(() => {
    setSoundEnabled(isNotificationSoundEnabled());
    setVolume(getNotificationSoundVolume());
  }, []);

  // Handle outside click to close popover
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    setNotificationSoundEnabled(nextState);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    setNotificationSoundVolume(newVol);
  };

  const handleTestSound = () => {
    setIsPlayingTest(true);
    playTestNotificationSound();
    setTimeout(() => {
      setIsPlayingTest(false);
    }, 1200);
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Sound Toggle / Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all relative ${
          soundEnabled
            ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
            : 'bg-slate-800/40 hover:bg-slate-800 text-slate-500 hover:text-slate-400'
        }`}
        aria-label={soundEnabled ? 'Notification sound enabled. Click for sound settings.' : 'Notification sound muted. Click for sound settings.'}
        title={`Notification Sound: ${soundEnabled ? `${volume}%` : 'Muted'}`}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-brand-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Sound Settings Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-200 text-xs"
          >
            {/* Header */}
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-brand-400" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Sound Settings
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="p-3.5 space-y-4">
              {/* Sound Toggle Switch */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Notification Chime</span>
                  <span className="text-[10px] text-slate-400">Ringtone for urgent events</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    soundEnabled ? 'bg-brand-600' : 'bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={soundEnabled}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">Alert Volume</span>
                  <span className="font-mono font-bold text-brand-400">{soundEnabled ? `${volume}%` : 'Muted'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={!soundEnabled}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-brand-500 ${
                    soundEnabled ? 'bg-slate-800' : 'bg-slate-800/50 opacity-40 cursor-not-allowed'
                  }`}
                  aria-label="Alert Volume"
                />
              </div>

              {/* Test Sound Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestSound}
                  disabled={isPlayingTest}
                  className="w-full py-2 px-3 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 hover:border-brand-500/50 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isPlayingTest ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Playing Chime...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Test Sound</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subtle Footer Note */}
            <div className="p-2 bg-slate-950/40 border-t border-slate-800/60 text-center">
              <span className="text-[10px] text-slate-500">
                Plays for shipment offers, delays & urgent alerts
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSoundControl;
