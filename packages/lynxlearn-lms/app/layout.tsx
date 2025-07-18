'use client';

import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import { ThemeProvider } from '../components/theme/theme-provider';
import EnhancedNavigation from '../components/ui/enhanced-navigation';
import TopBar from '../components/ui/TopBar';
import { useAuth } from '../hooks/use-auth';
import '../styles/globals.css';
import { AccessibilityManager } from '../utils/accessibility';
import { prefetchCriticalResources } from '../utils/performance';

// Inner component that uses auth hooks
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Initialize accessibility and performance features
  React.useEffect(() => {
    const accessibilityManager = new AccessibilityManager();
    accessibilityManager.init();

    // Prefetch critical resources
    prefetchCriticalResources();

    // Add main content landmark
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
      mainContent.setAttribute('role', 'main');
      mainContent.setAttribute('aria-label', 'Main content');
    }
  }, []);

  // Determine if nav should be shown
  const hideNav = pathname.startsWith('/auth/') || !isAuthenticated;

  return (
    <ThemeProvider defaultTheme="system" storageKey="edulynx-theme">
      <ErrorBoundary>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>

        <div className="flex min-h-screen">
          <TopBar />
          {!hideNav && (
            <aside className="hidden md:flex md:w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 pt-12">
              <EnhancedNavigation />
            </aside>
          )}

          <div className="flex flex-col flex-1">
            <main
              id="main-content"
              role="main"
              className={`flex-1 overflow-auto pt-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 bg-slate-50 dark:bg-slate-900`}
              tabIndex={-1}
            >
              {children}
            </main>

            {/* Hide footer for authenticated users */}
            {!isAuthenticated && (
              <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-xl">L</span>
                        </div>
                        <span className="text-2xl font-bold">LYNXLearn LMS</span>
                      </div>
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        Empowering students with world-class education technology. Part of LYNX
                        Consulting South Africa's commitment to educational excellence.
                      </p>
                      <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                          <span className="text-lg">📧</span>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                          <span className="text-lg">🌐</span>
                        </div>
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                          <span className="text-lg">📱</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/courses"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Browse Courses
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/dashboard"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Student Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/calendar"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Academic Calendar
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/support"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Help & Support
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-4">Resources</h4>
                      <ul className="space-y-2">
                        <li>
                          <Link
                            href="/library"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Digital Library
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/tutorials"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Video Tutorials
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/downloads"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Downloads
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/mobile"
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            Mobile App
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                      &copy; 2025 LYNXLearn LMS. Part of LYNX Consulting South Africa (Pty) Ltd. All
                      rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

// Main Layout component
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en" className="scroll-smooth">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#9333ea" />
        </head>
        <body className="min-h-screen font-inter transition-all duration-300 antialiased bg-slate-50 dark:bg-slate-900">
          <LayoutContent>{children}</LayoutContent>
        </body>
      </html>
    </SessionProvider>
  );
}
