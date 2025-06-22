import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Teacher dashboard component
function TeacherDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Classes</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your classes and student enrollment.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Grading</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Grade assignments and manage student progress.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Lesson Plans</h2>
          <p className="text-gray-600 dark:text-gray-300">Create and manage your lesson plans.</p>
        </div>
      </div>
    </div>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<StandardLoadingScreen message="Loading Teacher Dashboard..." />}>
      <TeacherDashboard />
    </Suspense>
  );
}
