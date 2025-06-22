'use client';
import EduLynxLogo from '@/components/EduLynxLogo';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingPageProps {
  message?: string;
  showProgress?: boolean;
}

export default function LoadingPage({
  message = 'Loading EduLynx...',
  showProgress = false,
}: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    '📚 Track student progress in real-time',
    '👨‍🏫 Manage classes and assignments effortlessly',
    '📊 Generate insightful analytics with Prof Lynx AI',
    '📱 Access from any device, anywhere',
    '🎯 Streamline your educational workflow',
  ];

  useEffect(() => {
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 12 + 3;
        });
      }, 180);

      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % tips.length);
      }, 2500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(tipInterval);
      };
    }
  }, [showProgress, tips.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Horizon UI Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700 bg-[size:40px_40px] opacity-30 dark:opacity-10"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Floating Orb */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-500 dark:to-indigo-700 rounded-full filter blur-2xl opacity-20"
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.3, 0.9, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary Floating Orb */}
        <motion.div
          className="absolute top-3/4 right-1/4 w-36 h-36 bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 rounded-full filter blur-2xl opacity-15"
          animate={{
            x: [0, -90, 30, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />

        {/* Tertiary Floating Orb */}
        <motion.div
          className="absolute bottom-1/4 left-3/4 w-32 h-32 bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-700 rounded-full filter blur-2xl opacity-10"
          animate={{
            x: [0, -70, 50, 0],
            y: [0, -60, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 6,
          }}
        />

        {/* Floating Icons */}
        <motion.div
          className="absolute top-1/3 right-1/3"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <BookOpen className="w-8 h-8 text-indigo-400 dark:text-indigo-300 opacity-30" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/3"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        >
          <Users className="w-6 h-6 text-purple-400 dark:text-purple-300 opacity-25" />
        </motion.div>
      </div>

      {/* Main Loading Content */}
      <div className="relative text-center max-w-lg mx-auto px-6">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="relative">
            {/* Horizon UI Inspired Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-indigo-500 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ padding: '24px' }}
            />

            {/* Logo Container with Glass Effect */}
            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                <div className="relative">
                  <EduLynxLogo width={64} height={64} className="relative z-10" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-20"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-500 bg-clip-text text-transparent">
              EduLynx
            </h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="ml-2"
            >
              <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            </motion.div>
          </div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">{message}</p>

          {/* Animated Tips */}
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="h-6"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{tips[currentTip]}</p>
          </motion.div>
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(Math.min(progress, 100))}% Complete
            </p>
          </motion.div>
        )}

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Horizon UI Inspired Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12"
        >
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LYNX Consulting
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
