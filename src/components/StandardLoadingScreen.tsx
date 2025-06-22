'use client';

import EduLynxLogo from '@/components/EduLynxLogo';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface StandardLoadingScreenProps {
  message?: string;
  showText?: boolean;
}

const StandardLoadingScreen = memo(function StandardLoadingScreen({
  message = 'Loading EduLynx...',
  showText = true,
}: StandardLoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="text-center max-w-sm mx-auto">
        {/* Spinning container with logo in center - slightly wider */}
        <div className="relative mb-6">
          <motion.div
            className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 dark:border-slate-600 dark:border-t-indigo-400 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <EduLynxLogo width={28} height={28} />
          </div>
        </div>

        {/* Loading text */}
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-slate-600 dark:text-slate-300 font-medium">{message}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
});

export default StandardLoadingScreen;
