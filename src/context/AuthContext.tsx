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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sadece ilk mount'ta kullanıcıyı kontrol et
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const me = await getMe();
      setUser(me);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      await refreshUser(); // login sonrası kullanıcıyı tekrar yükle
    } catch (e: any) {
      setError(e.message);
      setUser(null);
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
      await refreshUser(); // register sonrası kullanıcıyı tekrar yükle
    } catch (e: any) {
      setError(e.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
