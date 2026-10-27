import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLocked: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  lock: () => void;
  unlock: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CORRECT_PASSWORD = 'tdc2026@';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cockpit-auth') === 'true';
  });

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem('cockpit-locked') === 'true';
  });

  const login = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setIsLocked(false);
      localStorage.setItem('cockpit-auth', 'true');
      localStorage.removeItem('cockpit-locked');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLocked(false);
    localStorage.removeItem('cockpit-auth');
    localStorage.removeItem('cockpit-locked');
  };

  const lock = () => {
    if (isAuthenticated) {
      setIsLocked(true);
      localStorage.setItem('cockpit-locked', 'true');
    }
  };

  const unlock = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      setIsLocked(false);
      localStorage.removeItem('cockpit-locked');
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLocked, login, logout, lock, unlock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
