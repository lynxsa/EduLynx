"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT' | null;

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored role on mount
    if (typeof window !== 'undefined') {
      const storedRole = sessionStorage.getItem('role') as Role;
      if (storedRole) {
        setRoleState(storedRole);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setIsAuthenticated(!!newRole);
    if (typeof window !== 'undefined') {
      if (newRole) {
        sessionStorage.setItem('role', newRole);
      } else {
        sessionStorage.removeItem('role');
      }
    }
  };

  const logout = () => {
    setRole(null);
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
