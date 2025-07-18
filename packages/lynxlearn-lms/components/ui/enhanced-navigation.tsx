'use client';

import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Layers,
  Menu,
  MessageSquare,
  Settings,
  Sparkles,
  Target,
  Trophy,
  User,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { ThemeToggle } from '../theme/theme-toggle';

// Navigation items by role
const getNavigationItems = (userRole: string) => {
  const baseItems = [
    {
      name: 'Dashboard',
      href: userRole === 'student' ? '/dashboard' : `/${userRole}/dashboard`,
      icon: Home,
      description: 'Your overview',
      badge: null,
      category: 'primary',
    },
  ];

  const studentItems = [
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpen,
      description: 'All NSC subjects',
      badge: 'New',
      category: 'primary',
    },
    {
      name: 'ProfLynx AI',
      href: '/ai-tutor',
      icon: Brain,
      description: 'AI-powered learning assistant',
      badge: 'AI',
      special: true,
      category: 'primary',
    },
    {
      name: 'NSC Prep',
      href: '/nsc-prep',
      icon: GraduationCap,
      description: 'Exam preparation hub',
      badge: null,
      category: 'primary',
    },
    {
      name: 'Assignments',
      href: '/assignments',
      icon: FileText,
      description: 'Tasks and submissions',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Study Groups',
      href: '/study-groups',
      icon: MessageSquare,
      description: 'Collaborate with peers',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      description: 'Schedule and deadlines',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Goals',
      href: '/goals',
      icon: Target,
      description: 'Track your progress',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
      icon: Trophy,
      description: 'Rankings and competition',
      badge: 'HOT',
      special: true,
      category: 'secondary',
    },
    {
      name: 'Achievements',
      href: '/achievements',
      icon: Award,
      description: 'Badges and rewards',
      badge: null,
      category: 'secondary',
    },
  ];

  const teacherItems = [
    {
      name: 'Course Builder',
      href: '/course-builder',
      icon: Layers,
      description: 'Create educational content',
      badge: 'NEW',
      special: true,
      category: 'primary',
    },
    {
      name: 'Classes',
      href: '/teacher/classes',
      icon: BookOpen,
      description: 'Your classes',
      badge: null,
      category: 'primary',
    },
    {
      name: 'Students',
      href: '/teacher/students',
      icon: Users,
      description: 'Student management',
      badge: null,
      category: 'primary',
    },
    {
      name: 'Assignments',
      href: '/teacher/assignments',
      icon: FileText,
      description: 'Create and grade',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Analytics',
      href: '/teacher/analytics',
      icon: BarChart3,
      description: 'Performance insights',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Calendar',
      href: '/teacher/calendar',
      icon: Calendar,
      description: 'Schedule lessons',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Resources',
      href: '/teacher/resources',
      icon: BookOpen,
      description: 'Teaching materials',
      badge: null,
      category: 'secondary',
    },
  ];

  const adminItems = [
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'School performance',
      badge: null,
      category: 'primary',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      description: 'Manage users',
      badge: null,
      category: 'primary',
    },
    {
      name: 'Subjects',
      href: '/admin/subjects',
      icon: BookOpen,
      description: 'Curriculum management',
      badge: null,
      category: 'primary',
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: FileText,
      description: 'Generate reports',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'System configuration',
      badge: null,
      category: 'secondary',
    },
    {
      name: 'Alerts',
      href: '/admin/alerts',
      icon: AlertTriangle,
      description: 'System alerts',
      badge: null,
      category: 'secondary',
    },
  ];

  const commonItems = [
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      description: 'Support and guides',
      badge: null,
      category: 'utility',
    },
  ];

  switch (userRole) {
    case 'teacher':
      return [...baseItems, ...teacherItems, ...commonItems];
    case 'admin':
      return [...baseItems, ...adminItems, ...commonItems];
    default:
      return [...baseItems, ...studentItems, ...commonItems];
  }
};

const navCategories = [
  { key: 'primary', label: 'Main' },
  { key: 'secondary', label: 'Features' },
  { key: 'utility', label: 'More' },
];

const quickActions = [
  {
    name: 'Study Boost',
    icon: Zap,
    action: 'study-boost',
    color: 'from-yellow-400 to-orange-500',
    tooltip: 'Start focused study session',
  },
  {
    name: 'Quick Quiz',
    icon: Brain,
    action: 'quick-quiz',
    color: 'from-purple-500 to-pink-500',
    tooltip: 'Test your knowledge',
  },
  {
    name: 'AI Help',
    icon: Sparkles,
    action: 'ai-help',
    color: 'from-indigo-500 to-purple-500',
    tooltip: 'Ask ProfLynx anything',
  },
];

const userMenuItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help Center', href: '/help', icon: HelpCircle },
];

export default function EnhancedNavigation() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get user role and navigation items
  const userRole = user?.role || 'student';
  const navigationItems = getNavigationItems(userRole);

  // Breadcrumb generation
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs = [
      { name: 'Home', href: userRole === 'student' ? '/dashboard' : `/${userRole}/dashboard` },
    ];

    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const navItem = navigationItems.find(item => item.href === currentPath);
      if (navItem) {
        breadcrumbs.push({ name: navItem.name, href: currentPath });
      } else {
        // Format segment for display
        const name = segment
          .split('-')
          .map(word =>
            word && word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : ''
          )
          .filter(word => word.length > 0)
          .join(' ');
        breadcrumbs.push({ name, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  // Helper functions for user display
  const getUserSubtitle = (user: any) => {
    if (!user) return 'Unknown';
    switch (user.role) {
      case 'teacher':
        return user.subject || 'Teacher';
      case 'admin':
        return user.position || 'Administrator';
      default:
        return user.grade || 'Student';
    }
  };

  const getUserStats = (user: any) => {
    switch (user.role) {
      case 'teacher':
        return [
          { label: 'Students', value: user.students || 0 },
          { label: 'Experience', value: `${user.experience || 0}y` },
        ];
      case 'admin':
        return [
          { label: 'School', value: user.school?.split(' ')[0] || 'Admin' },
          { label: 'Role', value: user.position || 'Admin' },
        ];
      default:
        return [
          { label: 'Day Streak', value: user.streak || 0 },
          { label: 'Points', value: user.points || 0 },
        ];
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simulate search results
      const mockResults = [
        { type: 'course', name: 'Mathematics - Calculus', href: '/courses/mathematics' },
        { type: 'assignment', name: 'Physics Lab Report', href: '/assignments/physics-lab' },
        {
          type: 'ai',
          name: 'Ask ProfLynx about ' + searchQuery,
          href: '/ai-tutor?q=' + searchQuery,
        },
      ].filter(result => result.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(mockResults);
      setShowSearchResults(true);

      // Navigate to search results or AI if no specific results
      if (mockResults.length === 0) {
        window.location.href = `/ai-tutor?q=${encodeURIComponent(searchQuery)}`;
      }
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 2) {
      // Show live search suggestions
      const suggestions = navigationItems
        .filter(
          item =>
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.description.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3)
        .map(item => ({ type: 'navigation', name: item.name, href: item.href }));

      setSearchResults(suggestions);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleQuickAction = (action: string) => {
    // Provide immediate feedback and navigation
    switch (action) {
      case 'study-boost':
        // Show toast notification and navigate to study session
        console.log('Starting study boost session...');
        window.location.href = '/study-session/boost';
        break;
      case 'quick-quiz':
        // Navigate to quick quiz with current subject context
        console.log('Starting quick quiz...');
        window.location.href = '/quiz/quick';
        break;
      case 'ai-help':
        // Open AI assistant
        console.log('Opening ProfLynx AI...');
        window.location.href = '/ai-tutor';
        break;
      default:
        console.log('Quick action:', action);
    }
  };

  // Don't render navigation if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6 text-gray-800 dark:text-gray-100" />
          </button>
          <Link href="/dashboard" className="text-xl font-bold text-gray-800 dark:text-gray-100">
            LYNX
          </Link>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <button onClick={() => setIsUserMenuOpen(open => !open)} className="p-2">
              <User className="w-6 h-6 text-gray-800 dark:text-gray-100" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-20" onClick={() => setIsSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 z-30 p-4 overflow-y-auto">
            {/* Mobile nav items same as desktop */}
            <Link href="/dashboard" className="flex items-center space-x-2 p-3 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center text-white font-bold">
                L
              </div>
              <span className="text-lg font-semibold">LYNX</span>
            </Link>

            <nav className="mt-6">
              {navigationItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1 font-medium">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`inline-flex items-center justify-center w-3 h-3 rounded-full text-xs font-bold ${
                        item.badge === 'AI'
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                          : item.badge === 'New'
                            ? 'bg-green-500 text-white'
                            : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{user?.name || 'Unknown User'}</div>
                    <div className="text-xs text-gray-500">{getUserSubtitle(user)}</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle user menu"
                >
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              </div>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 py-2">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getUserSubtitle(user)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      {getUserStats(user).map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-lg font-bold text-purple-600">{stat.value}</div>
                          <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {userMenuItems.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </>
      )}
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700">
        {/* Desktop nav content... */}
        <aside className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="text-lg font-semibold">LYNX</span>
          </Link>

          {/* Navigation */}
          <nav className="mt-6 space-y-6">
            {navCategories.map(cat => (
              <div key={cat.key}>
                <h4 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {cat.label}
                </h4>
                <div className="space-y-1">
                  {navigationItems
                    .filter(item => item.category === cat.key)
                    .map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-LYNXPurple to-LYNXLight text-white'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="flex-1 font-medium">{item.name}</span>
                        {item.badge && (
                          <span className="inline-block ml-2 text-xs font-bold bg-LYNXMauve text-gray-800 rounded-full px-2">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || '?'}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{user?.name || 'Unknown User'}</div>
                  <div className="text-xs text-gray-500">{getUserSubtitle(user)}</div>
                </div>
              </div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle user menu"
              >
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 py-2">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {user?.name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getUserSubtitle(user)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    {getUserStats(user).map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-lg font-bold text-purple-600">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {userMenuItems.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
