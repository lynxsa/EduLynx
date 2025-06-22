'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/styles/theme';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  DollarSign,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Settings,
  Sun,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavigationItem[];
}

const adminNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  {
    label: 'Users',
    href: '/list/students',
    icon: Users,
    children: [
      { label: 'Students', href: '/list/students', icon: GraduationCap },
      { label: 'Teachers', href: '/list/teachers', icon: Users },
      { label: 'Parents', href: '/list/parents', icon: Users },
    ],
  },
  { label: 'Classes', href: '/list/classes', icon: BookOpen },
  { label: 'Subjects', href: '/list/subjects', icon: BookOpen },
  { label: 'Assignments', href: '/list/assignments', icon: FileText },
  { label: 'Results', href: '/list/results', icon: BarChart3 },
  { label: 'Attendance', href: '/list/attendance', icon: Calendar },
  { label: 'Events', href: '/list/events', icon: Calendar },
  {
    label: 'Announcements',
    href: '/list/announcements',
    icon: MessageSquare,
    badge: 3,
  },
  { label: 'Finance', href: '/list/finance', icon: DollarSign },
  { label: 'Prof. Lynx', href: '/prof-lynx', icon: Brain },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-all ${
          theme === 'light'
            ? 'bg-white shadow-sm text-yellow-600'
            : 'text-gray-600 dark:text-gray-400 hover:text-yellow-500'
        }`}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-all ${
          theme === 'dark'
            ? 'bg-gray-600 shadow-sm text-blue-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-blue-400'
        }`}
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600 dark:text-indigo-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500'
        }`}
        title="System preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
};

const SidebarItem = ({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavigationItem;
  isActive: boolean;
  isCollapsed: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
            isActive || isExpanded
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </div>
          {!isCollapsed && (
            <ChevronRight
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-8 mt-2 space-y-1">
                {item.children.map(child => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="flex items-center gap-3 p-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    <child.icon className="w-4 h-4" />
                    {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      {!isCollapsed && (
        <>
          <span className="font-medium">{item.label}</span>
          {item.badge && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
};

export default function ResponsiveNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">EduLynx</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${
          isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}
      >
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduLynx</h1>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {adminNavigation.map(item => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                isCollapsed={isSidebarCollapsed}
              />
            ))}
          </nav>
        </div>

        {/* User Profile & Theme */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {!isSidebarCollapsed && <ThemeToggle />}

          <div className={`${!isSidebarCollapsed ? 'mt-4' : ''} flex items-center gap-3`}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.[0] || 'A'}
              </span>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">EduLynx</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                  {adminNavigation.map(item => (
                    <SidebarItem
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                      isCollapsed={false}
                    />
                  ))}
                </nav>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.firstName?.[0] || 'A'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
