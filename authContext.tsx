import React, { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session persistence
    const session = localStorage.getItem('msf_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (u: string, p: string): Promise<boolean> => {
    // Mock secure login check
    if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
      localStorage.setItem('msf_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('msf_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};