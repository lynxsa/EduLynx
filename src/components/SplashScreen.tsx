'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '../styles/theme';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
  skipOnAuth?: boolean;
  isAuthenticated?: boolean;
}

// Animated EduLynx Logo
function AnimatedLogo({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <motion.div
      className="relative w-32 h-32 flex items-center justify-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Outer ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border-4 ${
          theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
        }`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Inner ring */}
      <motion.div
        className={`absolute inset-4 rounded-full border-2 ${
          theme === 'dark' ? 'border-purple-400' : 'border-purple-600'
        }`}
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
      />

      {/* Center icon */}
      <motion.div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-400 to-purple-400'
            : 'bg-gradient-to-br from-blue-600 to-purple-600'
        }`}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
      >
        <motion.span
          className="text-white font-bold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          E
        </motion.span>
      </motion.div>

      {/* Rotating orbits */}
      <motion.div
        className={`absolute inset-0 border border-dashed ${
          theme === 'dark' ? 'border-blue-300/30' : 'border-blue-500/30'
        } rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className={`absolute inset-2 border border-dashed ${
          theme === 'dark' ? 'border-purple-300/30' : 'border-purple-500/30'
        } rounded-full`}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}

// Fallback CSS animation for web (when Lottie is not available)
function CSSFallbackLogo({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <style jsx>{`
        @keyframes spin-clockwise {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-counter {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .outer-ring {
          animation: scale-in 1s ease-out 0.2s both;
        }

        .inner-ring {
          animation: scale-in 0.8s ease-out 0.4s both;
        }

        .center-icon {
          animation: scale-in 0.6s ease-out 0.6s both;
        }

        .orbit-1 {
          animation: spin-clockwise 8s linear infinite;
        }

        .orbit-2 {
          animation: spin-counter 6s linear infinite;
        }
      `}</style>

      <div
        className={`outer-ring absolute inset-0 rounded-full border-4 ${
          theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
        }`}
      />

      <div
        className={`inner-ring absolute inset-4 rounded-full border-2 ${
          theme === 'dark' ? 'border-purple-400' : 'border-purple-600'
        }`}
      />

      <div
        className={`center-icon w-12 h-12 rounded-lg flex items-center justify-center ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-400 to-purple-400'
            : 'bg-gradient-to-br from-blue-600 to-purple-600'
        }`}
      >
        <span className="text-white font-bold text-lg">E</span>
      </div>

      <div
        className={`orbit-1 absolute inset-0 border border-dashed ${
          theme === 'dark' ? 'border-blue-300/30' : 'border-blue-500/30'
        } rounded-full`}
      />

      <div
        className={`orbit-2 absolute inset-2 border border-dashed ${
          theme === 'dark' ? 'border-purple-300/30' : 'border-purple-500/30'
        } rounded-full`}
      />
    </div>
  );
}

// Loading text animation
function LoadingText({ theme }: { theme: 'light' | 'dark' }) {
  const text = 'EduLynx';

  return (
    <div className="flex items-center space-x-1">
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.8 + index * 0.1,
            ease: 'easeOut',
          }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

// Progress bar
function ProgressBar({ progress, theme }: { progress: number; theme: 'light' | 'dark' }) {
  return (
    <div
      className={`w-64 h-1 rounded-full overflow-hidden ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
      }`}
    >
      <motion.div
        className={`h-full rounded-full ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-400 to-purple-400'
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}

export function SplashScreen({
  onComplete,
  duration = 1500,
  skipOnAuth = true,
  isAuthenticated = false,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const { actualTheme } = useTheme();

  useEffect(() => {
    // Skip splash if user is already authenticated
    if (skipOnAuth && isAuthenticated) {
      onComplete();
      return;
    }

    // Show skip button after 500ms
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 500);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Complete splash screen
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Allow exit animation to complete
    }, duration);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete, skipOnAuth, isAuthenticated]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const backgroundClass =
    actualTheme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${backgroundClass}`}
          style={{ zIndex: 9999 }}
        >
          {/* Skip button */}
          <AnimatePresence>
            {showSkipButton && (
              <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={handleSkip}
                className={`absolute top-8 right-8 px-4 py-2 rounded-lg transition-colors ${
                  actualTheme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600'
                    : 'bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 border border-gray-200 shadow-sm'
                }`}
              >
                Skip
              </motion.button>
            )}
          </AnimatePresence>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8"
          >
            <AnimatedLogo theme={actualTheme} />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-2"
          >
            <LoadingText theme={actualTheme} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className={`text-lg mb-8 ${actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            School Management System
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col items-center space-y-2"
          >
            <ProgressBar progress={progress} theme={actualTheme} />
            <span
              className={`text-sm ${actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
            >
              Loading... {Math.round(progress)}%
            </span>
          </motion.div>

          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`absolute -top-40 -left-40 w-80 h-80 rounded-full ${
                actualTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-400/20'
              }`}
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full ${
                actualTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-400/20'
              }`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
