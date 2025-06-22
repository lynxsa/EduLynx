'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // For demo purposes, set a mock user if not authenticated
          // In production, you might want to redirect to login
          setUser({
            id: 'demo',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@lynxacademy.co.za',
            role: 'ADMIN',
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Set demo user as fallback
        setUser({
          id: 'demo',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@lynxacademy.co.za',
          role: 'ADMIN',
        });
      }
    };

    checkAuth();
  }, []);

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`${isMobile ? 'absolute inset-y-0 left-0 z-50' : 'relative'} ${isMobile && isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          userRole={user.role}
          isCollapsed={!isMobile && isSidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Mobile overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleSidebar} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav user={user} onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
