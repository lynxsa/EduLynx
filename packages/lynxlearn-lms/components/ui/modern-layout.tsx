'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/use-auth';

interface ModernLayoutProps {
  children: React.ReactNode;
}

// Mock logout function for now
const mockLogout = () => {
  window.location.href = '/';
};

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    gradient: 'from-blue-500 to-purple-600',
    description: 'Your learning overview',
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: BookOpen,
    gradient: 'from-emerald-500 to-teal-600',
    description: 'NSC Subjects & Lessons',
  },
  {
    name: 'Achievements',
    href: '/achievements',
    icon: Trophy,
    gradient: 'from-yellow-500 to-orange-600',
    description: 'Badges & Rewards',
  },
  {
    name: 'Study Groups',
    href: '/study-groups',
    icon: Users,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Collaborate with peers',
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Schedule & Deadlines',
  },
  {
    name: 'AI Tutor',
    href: '/ai-tutor',
    icon: Brain,
    gradient: 'from-violet-500 to-purple-600',
    description: 'Smart Learning Assistant',
  },
];

export function ModernLayout({ children }: ModernLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  // Extract user initials from name
  const getUserInitials = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : name[0] || 'U';
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        className="fixed left-0 top-0 z-50 h-full w-80 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl lg:translate-x-0 lg:static lg:inset-0 dark:bg-slate-900/80 dark:border-slate-700/50"
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LYNXLearn
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Smart LMS</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user?.name ? getUserInitials(user.name) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {(user as any)?.grade || 'Grade 12 Student'}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">85%</div>
                <div className="text-xs text-blue-500 dark:text-blue-400">Average</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">12</div>
                <div className="text-xs text-emerald-500 dark:text-emerald-400">Streak</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">2.8k</div>
                <div className="text-xs text-purple-500 dark:text-purple-400">Points</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-700/50'
                      : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} ${isActive ? 'shadow-lg' : 'opacity-70 group-hover:opacity-100'}`}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'}`}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-2">
            <Link
              href="/settings"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-500" />
              <span className="text-slate-700 dark:text-slate-300">Settings</span>
            </Link>
            <button
              onClick={mockLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="lg:ml-80">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 dark:bg-slate-900/80 dark:border-slate-700/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search Bar */}
              <div className="relative">
                <div className="flex items-center space-x-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl px-4 py-2 min-w-0 w-64 lg:w-96">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search courses, topics, or ask AI..."
                    className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-500"
                    onFocus={() => setSearchOpen(true)}
                  />
                  <kbd className="hidden lg:block px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 rounded">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* AI Assistant Quick Access */}
              <button className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all">
                <Brain className="w-5 h-5" />
              </button>

              {/* Profile Dropdown */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name ? getUserInitials(user.name) : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Search className="w-6 h-6 text-slate-400" />
                  <input
                    type="text"
                    placeholder="What do you want to learn today?"
                    className="flex-1 text-lg bg-transparent border-0 focus:outline-none text-slate-900 dark:text-slate-100"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      Recent Searches
                    </h3>
                    <div className="space-y-2">
                      {['Calculus derivatives', 'NSC Mathematics Paper 1', 'Physics momentum'].map(
                        item => (
                          <div
                            key={item}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                          >
                            <p className="text-slate-700 dark:text-slate-300">{item}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
