'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize

    if (!isAuthenticated) {
      router.replace('/sign-in');
      return;
    }

    let dashboardPath = '/dashboard';
    switch (user?.role) {
      case 'ADMIN':
        dashboardPath = '/admin';
        break;
      case 'TEACHER':
        dashboardPath = '/teacher';
        break;
      case 'PARENT':
        dashboardPath = '/parent';
        break;
      case 'STUDENT':
        dashboardPath = '/student';
        break;
      default:
        dashboardPath = '/dashboard';
    }
    router.replace(dashboardPath);
  }, [user, isAuthenticated, isLoading, router]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-lg text-gray-600">Redirecting to your dashboard...</span>
    </div>
  );
}
