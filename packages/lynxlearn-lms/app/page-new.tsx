'use client';

import { useEffect } from 'react';
import ModernLandingPage from '../components/landing/ModernLandingPage';
import { useAuth } from '../hooks/use-auth';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  // Auto-redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  // Don't render landing page if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return <ModernLandingPage />;
}
