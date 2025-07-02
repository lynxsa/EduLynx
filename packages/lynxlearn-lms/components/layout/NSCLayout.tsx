'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface NSCLayoutProps {
  children: React.ReactNode;
  bgGradient?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * NSCLayout - A consistent layout component that matches the NSC Prep page positioning
 * Used across all LMS pages for uniform positioning and styling
 */
export default function NSCLayout({
  children,
  bgGradient = 'from-slate-50 via-purple-50/30 to-violet-50/20 dark:from-slate-900 dark:via-purple-900/10 dark:to-violet-900/5',
}: NSCLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient}`}>
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export { containerVariants };
