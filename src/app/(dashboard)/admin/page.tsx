import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Simple admin dashboard component
function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor system performance and usage statistics.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage users, roles, and permissions.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Configure system settings and preferences.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<StandardLoadingScreen message="Loading Admin Dashboard..." />}>
      <AdminDashboard />
    </Suspense>
  );
}
