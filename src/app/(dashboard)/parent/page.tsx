import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Parent dashboard component
function ParentDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Parent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Children Overview</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View your children's academic progress and performance.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Track attendance records and schedules.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Communications</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Messages from teachers and school announcements.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ParentPage() {
  return (
    <Suspense fallback={<StandardLoadingScreen message="Loading Parent Dashboard..." />}>
      <ParentDashboard />
    </Suspense>
  );
}
