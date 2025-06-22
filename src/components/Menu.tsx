'use client';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CalendarDays,
  ChartBar,
  ChevronRight,
  ClipboardCheck,
  DollarSign,
  FileText,
  GraduationCap,
  Heart,
  Home,
  LogOut,
  Megaphone,
  MessageCircle,
  School,
  Settings,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  visible: string[];
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  collapsible?: boolean;
}

interface MenuProps {
  collapsed?: boolean;
}

const menuItems: MenuSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        icon: <Home className="w-5 h-5" />,
        label: 'Dashboard',
        href: '/admin',
        visible: ['admin', 'teacher', 'student', 'parent'],
        badge: 'New',
      },
    ],
  },
  {
    title: 'PEOPLE',
    collapsible: true,
    items: [
      {
        icon: <Users className="w-5 h-5" />,
        label: 'Teachers',
        href: '/list/teachers',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <GraduationCap className="w-5 h-5" />,
        label: 'Students',
        href: '/list/students',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <UserCheck className="w-5 h-5" />,
        label: 'Parents',
        href: '/list/parents',
        visible: ['admin', 'teacher'],
      },
    ],
  },
  {
    title: 'STUDENT SERVICES',
    collapsible: true,
    items: [
      {
        icon: <Heart className="w-5 h-5" />,
        label: 'Student Health',
        href: '/list/health',
        visible: ['admin', 'teacher'],
      },
    ],
  },
  {
    title: 'ACADEMICS',
    collapsible: true,
    items: [
      {
        icon: <BookOpen className="w-5 h-5" />,
        label: 'Subjects',
        href: '/list/subjects',
        visible: ['admin'],
      },
      {
        icon: <School className="w-5 h-5" />,
        label: 'Classes',
        href: '/list/classes',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        label: 'Lessons',
        href: '/list/lessons',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <ClipboardCheck className="w-5 h-5" />,
        label: 'Exams',
        href: '/list/exams',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <FileText className="w-5 h-5" />,
        label: 'Assignments',
        href: '/list/assignments',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <BarChart3 className="w-5 h-5" />,
        label: 'Results',
        href: '/list/results',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <ChartBar className="w-5 h-5" />,
        label: 'Attendance',
        href: '/list/attendance',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      {
        icon: <DollarSign className="w-5 h-5" />,
        label: 'Finance',
        href: '/dashboard/finance',
        visible: ['admin'],
      },
    ],
  },
  {
    title: 'INSIGHTS',
    collapsible: true,
    items: [
      {
        icon: <TrendingUp className="w-5 h-5" />,
        label: 'Performance Insights',
        href: '/dashboard/performance',
        visible: ['admin', 'teacher'],
      },
      {
        icon: <Brain className="w-5 h-5" />,
        label: 'ProfLynx AI',
        href: '/dashboard/proflynx',
        visible: ['admin', 'teacher', 'parent', 'student'],
      },
      {
        icon: <Zap className="w-5 h-5" />,
        label: 'Next-Level Analytics',
        href: '/next-level',
        visible: ['admin', 'teacher'],
        badge: '🚀',
      },
    ],
  },
  {
    title: 'COMMUNICATION',
    collapsible: true,
    items: [
      {
        icon: <CalendarDays className="w-5 h-5" />,
        label: 'Events',
        href: '/list/events',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <MessageCircle className="w-5 h-5" />,
        label: 'Messages',
        href: '/list/messages',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <Megaphone className="w-5 h-5" />,
        label: 'Announcements',
        href: '/list/announcements',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
  {
    title: 'ACCOUNT',
    collapsible: true,
    items: [
      {
        icon: <User className="w-5 h-5" />,
        label: 'Profile',
        href: '/dashboard/profile',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <Settings className="w-5 h-5" />,
        label: 'Settings',
        href: '/dashboard/settings',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
      {
        icon: <LogOut className="w-5 h-5" />,
        label: 'Logout',
        href: '/logout',
        visible: ['admin', 'teacher', 'student', 'parent'],
      },
    ],
  },
];

const Menu = ({ collapsed = false }: MenuProps) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Convert role to lowercase for comparison
  const currentRole = user?.role?.toLowerCase();

  if (!currentRole) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  const toggleSection = (sectionTitle: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionTitle)) {
      newCollapsed.delete(sectionTitle);
    } else {
      newCollapsed.add(sectionTitle);
    }
    setCollapsedSections(newCollapsed);
  };

  const isCurrentPath = (href: string) => {
    if (href === '/admin' || href === '/teacher' || href === '/student' || href === '/parent') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="space-y-2">
      {menuItems.map((section, index) => {
        const hasVisibleItems = section.items.some(item => item.visible.includes(currentRole));
        if (!hasVisibleItems) return null;

        const isCollapsed = collapsedSections.has(section.title);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-6 last:mb-0"
          >
            <div className="flex items-center justify-between mb-3">
              <AnimatePresence>
                {!collapsed && (
                  <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {section.title}
                  </motion.h2>
                )}
              </AnimatePresence>
              {section.collapsible && !collapsed && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleSection(section.title)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </motion.button>
              )}
            </div>

            <AnimatePresence>
              {(!isCollapsed || collapsed) && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-1 overflow-hidden"
                >
                  {section.items.map(
                    (item, idx) =>
                      item.visible.includes(currentRole) && (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          {item.label === 'Logout' ? (
                            <button
                              onClick={handleLogout}
                              className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-out relative overflow-hidden w-full text-left sidebar-item hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-900/30 hover:shadow-md`}
                            >
                              {/* Hover Gradient Background */}
                              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-600/5 transition-all duration-300"></div>

                              <motion.span
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="relative z-10 transition-all duration-200 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300"
                              >
                                {item.icon}
                              </motion.span>

                              <AnimatePresence>
                                {!collapsed && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center justify-between flex-1 relative z-10"
                                  >
                                    <span className="text-sm font-medium transition-colors duration-200 text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300">
                                      {item.label}
                                    </span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>
                          ) : (
                            <Link
                              href={item.href}
                              className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ease-out relative overflow-hidden ${
                                isCurrentPath(item.href)
                                  ? 'sidebar-item-active shadow-lg'
                                  : 'sidebar-item hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 hover:shadow-md'
                              }`}
                            >
                              {/* Hover Gradient Background */}
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-indigo-600/0 group-hover:from-purple-600/5 group-hover:to-indigo-600/5 transition-all duration-300"></div>

                              <motion.span
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`relative z-10 transition-all duration-200 ${
                                  isCurrentPath(item.href)
                                    ? 'text-white'
                                    : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                                }`}
                              >
                                {item.icon}
                              </motion.span>

                              <AnimatePresence>
                                {!collapsed && (
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center justify-between flex-1 relative z-10"
                                  >
                                    <span
                                      className={`text-sm font-medium transition-colors duration-200 ${
                                        isCurrentPath(item.href)
                                          ? 'text-white'
                                          : 'text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-300'
                                      }`}
                                    >
                                      {item.label}
                                    </span>

                                    {/* Badge */}
                                    {item.badge && (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-sm"
                                      >
                                        {item.badge}
                                      </motion.span>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Active Indicator */}
                              {isCurrentPath(item.href) && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                  transition={{
                                    type: 'spring',
                                    bounce: 0.2,
                                    duration: 0.6,
                                  }}
                                />
                              )}
                            </Link>
                          )}
                        </motion.li>
                      )
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </nav>
  );
};

export default Menu;
