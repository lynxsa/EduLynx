import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Student dashboard component
function StudentDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Grades</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View your academic performance and grades.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Assignments</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track upcoming assignments and deadlines.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Schedule</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View your class schedule and timetable.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={<StandardLoadingScreen message="Loading Student Dashboard..." />}>
      <StudentDashboard />
    </Suspense>
  );
}
