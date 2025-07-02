'use client';

import {
  Award,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Target,
  Trophy,
  User,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Your learning overview',
    badge: null,
  },
  {
    name: 'Courses',
    href: '/courses',
    icon: BookOpen,
    description: 'All NSC subjects',
    badge: 'New',
  },
  {
    name: 'ProfLynx AI',
    href: '/ai-tutor',
    icon: Brain,
    description: 'AI-powered learning assistant',
    badge: 'AI',
    special: true,
  },
  {
    name: 'Assignments',
    href: '/assignments',
    icon: FileText,
    description: 'Tasks and homework',
    badge: '3',
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    description: 'Schedule and events',
    badge: null,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    description: 'Chat with teachers',
    badge: '2',
  },
  {
    name: 'Grades',
    href: '/grades',
    icon: Trophy,
    description: 'Performance tracking',
    badge: null,
  },
  {
    name: 'Resources',
    href: '/resources',
    icon: Target,
    description: 'Study materials',
    badge: null,
  },
  {
    name: 'Forum',
    href: '/forum',
    icon: MessageSquare,
    description: 'Community discussions',
    badge: null,
  },
  {
    name: 'Search',
    href: '/search',
    icon: Search,
    description: 'Find courses & topics',
    badge: null,
  },
  {
    name: 'Certificates',
    href: '/certificates',
    icon: Award,
    description: 'Your achievements',
    badge: null,
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: Settings,
    description: 'Content management',
    badge: null,
    adminOnly: true,
  },
];

const quickActions = [
  {
    name: 'Ask ProfLynx',
    icon: Sparkles,
    action: 'ai-chat',
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Quick Quiz',
    icon: Zap,
    action: 'quiz',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Study Goal',
    icon: Target,
    action: 'goal',
    color: 'from-green-500 to-emerald-600',
  },
];

const userMenuItems = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help Center', href: '/help', icon: HelpCircle },
  { name: 'Sign Out', href: '/auth/logout', icon: LogOut },
];

export default function EnhancedNavigation() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const { user, isAuthenticated } = useAuth();

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'ai-chat':
        window.location.href = '/ai-tutor';
        break;
      case 'quiz':
        // Implement quick quiz functionality
        break;
      case 'goal':
        // Implement study goal functionality
        break;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="nav-modern fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              {/* Mobile Sidebar Toggle */}
              {isAuthenticated && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              )}

              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <img
                    src="/edulynx-logo.png"
                    alt="EduLynx Logo"
                    className="w-full h-full object-contain"
                    onError={e => {
                      // Fallback to gradient icon if image fails to load
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector(
                        '.fallback-logo'
                      ) as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="fallback-logo w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl items-center justify-center hidden">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    LYNXLearn
                  </div>
                  <div className="text-xs text-gray-500 -mt-1">South African High School</div>
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            {isAuthenticated && (
              <div className="flex-1 max-w-2xl mx-8 relative">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, assignments, or ask ProfLynx..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </form>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Quick Actions */}
                  <div className="hidden md:flex items-center space-x-2">
                    {quickActions.map(action => (
                      <button
                        key={action.name}
                        onClick={() => handleQuickAction(action.action)}
                        className={`p-2 rounded-xl bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-transform duration-200 shadow-lg`}
                        title={action.name}
                      >
                        <action.icon className="w-5 h-5" />
                      </button>
                    ))}
                  </div>

                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Bell className="w-6 h-6" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {'grade' in user ? user.grade : 'role' in user ? user.role : ''}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">
                                {'grade' in user ? user.grade : 'role' in user ? user.role : ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">
                                {'streak' in user ? user.streak : 0}
                              </div>
                              <div className="text-xs text-gray-500">Day Streak</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {'points' in user ? user.points : 0}
                              </div>
                              <div className="text-xs text-gray-500">Points</div>
                            </div>
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
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/api/auth/signin"
                    className="px-4 py-2 text-gray-700 font-semibold hover:text-purple-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/api/auth/signin"
                    className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation - Conditionally rendered */}
      {isAuthenticated && (
        <>
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-39 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed left-0 top-16 bottom-0 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl z-40 sidebar-modern transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
          >
            <div className="flex flex-col h-full">
              {/* Navigation Items - Scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 max-h-[calc(100vh-200px)]">
                {navigationItems.map(item => {
                  const isActiveItem = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                    group flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                    ${
                      isActiveItem
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                    }
                    ${item.special ? 'bg-gradient-to-r from-violet-50 to-purple-50 border border-purple-200' : ''}
                  `}
                    >
                      {item.special && !isActiveItem && (
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl" />
                      )}

                      <item.icon
                        className={`
                    w-6 h-6 mr-3 transition-transform group-hover:scale-110
                    ${isActiveItem ? 'text-white' : item.special ? 'text-purple-600' : 'text-gray-500'}
                  `}
                      />

                      <div className="flex-1">
                        <div className={`font-semibold ${isActiveItem ? 'text-white' : ''}`}>
                          {item.name}
                        </div>
                        <div
                          className={`text-xs ${isActiveItem ? 'text-white/80' : 'text-gray-500'}`}
                        >
                          {item.description}
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`
                      px-2 py-1 text-xs font-bold rounded-full
                      ${
                        item.badge === 'AI'
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'
                          : item.badge === 'New'
                            ? 'bg-green-500 text-white'
                            : isActiveItem
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-100 text-purple-600'
                      }
                    `}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Section - Study Stats & EduLynx Link */}
              <div className="p-4 border-t border-gray-200 space-y-4">
                {/* Study Stats */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Your Progress
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Daily Goal</span>
                      <span className="font-semibold text-purple-600">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2">
                      <div className="text-lg font-bold text-green-600">94%</div>
                      <div className="text-xs text-gray-500">Avg Score</div>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <div className="text-lg font-bold text-blue-600">12</div>
                      <div className="text-xs text-gray-500">Subjects</div>
                    </div>
                  </div>
                </div>

                {/* EduLynx Home Link */}
                <div className="text-center">
                  <a
                    href="https://edulynx.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    aria-label="Visit EduLynx main website"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Visit EduLynx Home
                  </a>
                </div>

                {/* User Settings Links */}
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/auth/logout"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Click overlay to close user menu */}
      {isUserMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
      )}
    </>
  );
}
