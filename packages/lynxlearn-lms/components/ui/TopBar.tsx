'use client';

import { Bell, CloudSun, Search } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { ThemeToggle } from '../theme/theme-toggle';

export default function TopBar() {
  const { user, isAuthenticated } = useAuth();
  const [date, setDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDate(
      new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    );
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 md:left-64 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 placeholder-gray-500"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>
        <button className="relative p-2">
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            5
          </span>
        </button>
        {/* Weather & Date */}
        {isClient && (
          <div className="hidden sm:flex items-center space-x-2 ml-4">
            <CloudSun className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">22°C Sunny</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{date}</span>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        {isAuthenticated ? (
          <>
            <span className="text-gray-700 dark:text-gray-300">{user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
