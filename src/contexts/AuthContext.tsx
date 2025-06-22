'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  schoolId?: number;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: number;
}

// Auto logout time constant
const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem('auth-token');
        const savedUser = localStorage.getItem('auth-user');
        const savedLastActivity = localStorage.getItem('last-activity');

        if (savedToken && savedUser && savedLastActivity) {
          const timeSinceLastActivity = Date.now() - parseInt(savedLastActivity);

          if (timeSinceLastActivity < AUTO_LOGOUT_TIME) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setLastActivity(parseInt(savedLastActivity));
          } else {
            // Auto logout due to inactivity
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-user');
            localStorage.removeItem('last-activity');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
        localStorage.removeItem('last-activity');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Track user activity and auto logout
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      const now = Date.now();
      setLastActivity(now);
      localStorage.setItem('last-activity', now.toString());
    };

    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivity > AUTO_LOGOUT_TIME) {
        logout();
      }
    };

    // Update activity on user interactions
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check inactivity every minute
    const inactivityCheck = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [isAuthenticated, lastActivity]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { user: userData, token: userToken } = data.data;

        setUser(userData);
        setToken(userToken);

        // Store in localStorage
        localStorage.setItem('auth-token', userToken);
        localStorage.setItem('auth-user', JSON.stringify(userData));
        localStorage.setItem('last-activity', Date.now().toString());

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const { user: newUser, token: userToken } = data.data;

        setUser(newUser);
        setToken(userToken);

        // Store in localStorage
        localStorage.setItem('auth-token', userToken);
        localStorage.setItem('auth-user', JSON.stringify(newUser));
        localStorage.setItem('last-activity', Date.now().toString());

        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear state regardless of API call success
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
      localStorage.removeItem('last-activity');

      // Redirect to sign-in page
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('auth-user', JSON.stringify(data.data));
        }
      } else if (response.status === 401) {
        // Token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
