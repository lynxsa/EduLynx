'use client';

import { useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  // Return authentication state based on NextAuth session
  const isAuthenticated = status === 'authenticated' && !!session;
  const isLoading = status === 'loading';

  // Extract user data from session
  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as any).role || 'student', // Cast to access role
      }
    : null;

  return {
    user,
    isAuthenticated,
    isLoading,
    session,
    status,
  };
};
