'use client';

import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect authenticated users to their respective dashboards
        switch (user.role) {
          case 'ADMIN':
            router.replace('/admin');
            break;
          case 'TEACHER':
            router.replace('/teacher');
            break;
          case 'PARENT':
            router.replace('/parent');
            break;
          case 'STUDENT':
            router.replace('/student');
            break;
          default:
            setShowWelcome(true);
        }
      } else {
        // Show welcome page for unauthenticated users
        setShowWelcome(true);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <StandardLoadingScreen message="Loading..." />;
  }

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold text-slate-800 dark:text-white mb-6">
              Welcome to EduLynx
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
              Modern school management platform by LYNX Consulting South Africa (Pty) Ltd
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Link
                href="/admin"
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  Admin Portal
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  School administration and management
                </p>
              </Link>

              <Link
                href="/teacher"
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  Teacher Portal
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Classroom management and grading
                </p>
              </Link>

              <Link
                href="/parent"
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  Parent Portal
                </h3>
                <p className="text-slate-600 dark:text-slate-300">Track your child's progress</p>
              </Link>

              <Link
                href="/student"
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                  Student Portal
                </h3>
                <p className="text-slate-600 dark:text-slate-300">Access assignments and grades</p>
              </Link>
            </div>

            <div className="space-x-4">
              <Link
                href="/sign-in"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while determining redirect
  return <StandardLoadingScreen message="Redirecting..." />;
}
