import PersonalizedDashboard from '@/components/dashboard/PersonalizedDashboard';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Fallback data for when API calls fail
const fallbackData = {
  totalStudents: 1250,
  totalTeachers: 45,
  activeClasses: 28,
  systemHealth: '99.9%',
};

export default function AdminPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<StandardLoadingScreen message="Loading Admin Dashboard..." />}>
        <PersonalizedDashboard fallbackData={fallbackData} />
      </Suspense>
    </div>
  );
}
