import PersonalizedDashboard from '@/components/dashboard/PersonalizedDashboard';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Fallback data for when API calls fail
const fallbackData = {
  mySubjects: 8,
  assignmentsDue: 4,
  currentAverage: 82,
  attendanceRate: 96,
};

export default function StudentPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<StandardLoadingScreen message="Loading Student Dashboard..." />}>
        <PersonalizedDashboard fallbackData={fallbackData} />
      </Suspense>
    </div>
  );
}
