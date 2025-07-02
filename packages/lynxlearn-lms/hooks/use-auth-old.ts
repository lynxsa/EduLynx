'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

// Mock authentication hook.
// In a real application, this would be replaced with a proper authentication context
// that checks session cookies, tokens, or interacts with an authentication provider.
// For this project, we simulate authentication based on the current route.
// The homepage ('/') is considered public (logged-out state).
// All other routes are considered protected (logged-in state).

export const useAuth = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Determine if the user should be treated as authenticated.
  // For this mock setup, any route other than the homepage is protected.
  const isAuthenticated = pathname !== '/';

  // If the user is not on a protected route, return a logged-out state.
  if (!isAuthenticated) {
    return { user: null, isAuthenticated: false };
  }

  // Determine user role based on the current path
  let role = 'student'; // default
  if (pathname.startsWith('/teacher')) {
    role = 'teacher';
  } else if (pathname.startsWith('/admin')) {
    role = 'admin';
  }

  // Return mock user data based on role
  const mockUsers = {
    student: {
      name: 'Thabo Mthembu',
      grade: 'Grade 12',
      avatar: '/avatars/student-avatar.jpg',
      streak: 7,
      points: 2450,
      role: 'student',
    },
    teacher: {
      name: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      avatar: '/avatars/teacher-avatar.jpg',
      experience: 8,
      students: 145,
      role: 'teacher',
    },
    admin: {
      name: 'Mr. John Ndlovu',
      position: 'Principal',
      avatar: '/avatars/admin-avatar.jpg',
      school: 'Johannesburg High School',
      role: 'admin',
    },
  };

  // If the user is on a protected route, return appropriate mock user data.
  return {
    user: mockUsers[role as keyof typeof mockUsers],
    isAuthenticated: true,
  };
};
