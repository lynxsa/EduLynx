'use client';

import ModernTimetable from '@/components/ModernTimetable';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TeacherTimetablePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'TEACHER')) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <StandardLoadingScreen message="Loading timetable..." />;
  }

  // Redirect if not authorized
  if (!user || user.role !== 'TEACHER') {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Timetable</h1>
          <p className="text-gray-600 dark:text-gray-400">View your schedule and lessons</p>
        </div>
      </div>

      <ModernTimetable teacherId={user.id} />
    </div>
  );
}
