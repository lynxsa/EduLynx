import PersonalizedDashboard from '@/components/dashboard/PersonalizedDashboard';
import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { Suspense } from 'react';

// Fallback data for when API calls fail
const fallbackData = {
  myChildren: 2,
  upcomingEvents: 3,
  feeBalance: '2,450',
  unreadMessages: 5,
};

export default function ParentPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<StandardLoadingScreen message="Loading Parent Dashboard..." />}>
        <PersonalizedDashboard fallbackData={fallbackData} />
      </Suspense>
    </div>
  );
}
