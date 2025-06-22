'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/styles/theme';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  Calendar,
  ChevronDown,
  Command,
  LogOut,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import GlobalSearch from './search/GlobalSearch';
import TimeWeatherCard from './TimeWeatherCard';

interface NavbarProps {
  userName: string;
  userRole: string;
  avatarUrl?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  unread: boolean;
}

const Navbar = ({ userName, userRole, avatarUrl = '/avatar.png' }: NavbarProps) => {
  const { logout } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Student Registration',
      message: 'Sarah Johnson has been registered for Grade 10',
      time: '2 minutes ago',
      type: 'success',
      unread: true,
    },
    {
      id: '2',
      title: 'Assignment Due',
      message: 'Mathematics homework due tomorrow',
      time: '1 hour ago',
      type: 'warning',
      unread: true,
    },
    {
      id: '3',
      title: 'Parent Meeting',
      message: "Meeting with John Smith's parents at 3 PM",
      time: '3 hours ago',
      type: 'info',
      unread: false,
    },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/sign-in');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="nav-modern px-6 py-4"
      >
        <div className="flex items-center justify-between">
          {/* Left Section - Enhanced Search */}
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ width: 240 }}
              whileFocus={{ width: 320 }}
              className="search-modern"
            >
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setShowGlobalSearch(true)}
              >
                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400 flex-1">
                  Search anything...
                </span>
                <kbd className="hidden md:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  <Command className="w-3 h-3" />K
                </kbd>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost p-2"
              >
                <Calendar className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Center Section - Enhanced Weather/Time */}
          <div className="hidden lg:flex items-center">
            <TimeWeatherCard />
          </div>

          {/* Right Section - Enhanced Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(actualTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {actualTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </motion.button>

            {/* Messages */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"
              />
            </motion.button>

            {/* Enhanced Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs flex items-center justify-center font-semibold"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Enhanced Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-96 card-modern p-0 z-50 max-h-96 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <h3 className="heading-card">Notifications</h3>
                        {unreadCount > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-accent hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                          >
                            Mark all as read
                          </motion.button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-modern">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group ${
                            notification.unread ? 'bg-purple-50/50 dark:bg-purple-900/20' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                                notification.type === 'success'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                  : notification.type === 'warning'
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                    : notification.type === 'error'
                                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                            {notification.unread && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2"
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full text-sm text-accent hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium"
                      >
                        View all notifications
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced User Menu */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
              >
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {userName}
                  </span>
                  <span className="text-xs text-muted">{userRole}</span>
                </div>
                <div className="relative">
                  <Image
                    src={avatarUrl}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-xl border-2 border-white dark:border-gray-700 shadow-md group-hover:border-purple-300 dark:group-hover:border-purple-600 transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </motion.button>

              {/* Enhanced User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-64 card-modern p-0 z-50"
                  >
                    <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <Image
                          src={avatarUrl}
                          alt="User Avatar"
                          width={48}
                          height={48}
                          className="rounded-xl border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {userName}
                          </p>
                          <p className="text-sm text-muted">{userRole} • EduLynx</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        View Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 w-full p-3 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      >
                        <Zap className="w-4 h-4" />
                        Upgrade Plan
                      </motion.button>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-3 w-full p-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onResultSelect={result => {
          router.push(result.url);
          setShowGlobalSearch(false);
        }}
      />
    </>
  );
};

export default Navbar;
