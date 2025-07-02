'use client';

import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import ProfLynx from '@/components/ProfLynx';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <StandardLoadingScreen message="Loading your dashboard..." />;
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  const userName = `${user.firstName} ${user.lastName}`;
  const userRole = user.role;
  const avatarUrl = '/avatar.png';

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Enhanced Sidebar with Modern Glassmorphism */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-20 md:w-24 lg:w-64 xl:w-72'
        } flex-shrink-0 flex flex-col py-6 px-4 min-h-screen transition-all duration-300 ease-out sidebar-modern`}
      >
        {/* Logo Section with Enhanced Animation */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 px-2 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Image
              src="/logo.png"
              alt="EduLynx"
              width={44}
              height={44}
              className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="hidden lg:block font-bold text-2xl gradient-text-primary tracking-tight"
              >
                EduLynx
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Enhanced Menu with Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-modern">
          <Menu collapsed={sidebarCollapsed} />
        </div>

        {/* Sidebar Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 mt-4"
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.div>
        </motion.button>
      </motion.aside>

      {/* Main Content Area with Enhanced Layout */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Enhanced Navbar with Glassmorphism */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          <Navbar userName={userName} userRole={userRole} avatarUrl={avatarUrl} />
        </motion.div>

        {/* Page Content with Enhanced Container */}
        <div className="flex-1 overflow-y-auto scrollbar-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="container-modern py-6"
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Enhanced Prof Lynx AI Assistant */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ProfLynx userRole={userRole} userName={userName} />
      </motion.div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/5 to-indigo-400/5 rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full animate-float [animation-delay:2s]"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full animate-float [animation-delay:4s]"></div>
      </div>
    </div>
  );
}
