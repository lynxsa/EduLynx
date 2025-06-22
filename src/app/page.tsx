'use client';

import StandardLoadingScreen from '@/components/StandardLoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

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
            router.replace('/sign-in');
        }
      } else {
        // Redirect unauthenticated users to sign-in
        router.replace('/sign-in');
      }
    }
  }, [user, isLoading, router]);

  // Show loading while determining redirect
  return <StandardLoadingScreen message="Redirecting..." />;
}
