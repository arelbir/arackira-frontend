'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import {
  AuthUser,
  getMe,
  login,
  logout,
  register
} from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  registerUser: (
    username: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // İlk mount'ta token'ı localStorage'dan al
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (storedToken) setToken(storedToken);
    refreshUser();
    // eslint-disable-next-line
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const me = await getMe();
      setUser(me);
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      setToken(storedToken);
    } catch (e) {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      setToken(storedToken);
      await refreshUser(); // login sonrası kullanıcıyı tekrar yükle
    } catch (e: any) {
      setError(e.message);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (
    username: string,
    password: string,
    role?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await register(username, password, role);
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      setToken(storedToken);
      await refreshUser(); // register sonrası kullanıcıyı tekrar yükle
    } catch (e: any) {
      setError(e.message);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
