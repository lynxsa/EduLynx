import PersonalizedDashboard from '@/components/dashboard/PersonalizedDashboard';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Fallback data for when API calls fail
const fallbackData = {
  myClasses: 6,
  myStudents: 143,
  pendingGrades: 28,
  classAverage: 76,
};

export default function TeacherPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<StandardLoadingScreen message="Loading Teacher Dashboard..." />}>
        <PersonalizedDashboard fallbackData={fallbackData} />
      </Suspense>
    </div>
  );
}
