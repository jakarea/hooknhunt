'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: string;
  phone_verified_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, name?: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = api.getToken();
      console.log('🔍 [AUTH_DEBUG] Token from localStorage:', token ? 'EXISTS' : 'NOT FOUND');

      if (token) {
        console.log('🔍 [AUTH_DEBUG] Validating token with API...');
        try {
          const response = await api.getMe();
          console.log('🔍 [AUTH_DEBUG] API response status:', response.status || 'OK');
          console.log('🔍 [AUTH_DEBUG] API response data:', response);

          // Check both possible response structures: {data: {user: ...}} or {user: ...}
          const user = response.data?.user || response.user;
          if (user) {
            console.log('🔍 [AUTH_DEBUG] ✅ User authenticated:', user);
            setUser(user);
            setIsAuthenticated(true);
            // Cache user data for offline scenarios
            localStorage.setItem('cached_user', JSON.stringify(user));
          } else {
            // Token exists but is invalid, clear it
            console.log('🔍 [AUTH_DEBUG] ❌ Invalid response structure, clearing auth');
            api.clearAuth();
            localStorage.removeItem('cached_user');
          }
        } catch (error: any) {
          console.log('🔍 [AUTH_DEBUG] ❌ API Error:', error.status, error.message);

          // Always clear auth on 401 unauthorized errors
          if (error.status === 401) {
            console.log('🔍 [AUTH_DEBUG] ❌ 401 Unauthorized, clearing auth');
            api.clearAuth();
            localStorage.removeItem('cached_user');
          } else if (error.status === 0) {
            // Network error - try to use cached user data temporarily
            console.log('🔍 [AUTH_DEBUG] 🌐 Network error, trying cached user...');
            const cachedUser = localStorage.getItem('cached_user');

            if (cachedUser) {
              try {
                const userData = JSON.parse(cachedUser);
                console.log('🔍 [AUTH_DEBUG] ✅ Using cached user:', userData);
                setUser(userData);
                setIsAuthenticated(true);
              } catch (e) {
                console.log('🔍 [AUTH_DEBUG] ❌ Failed to parse cached user');
                localStorage.removeItem('cached_user');
              }
            }
          }
        }
      } else {
        console.log('🔍 [AUTH_DEBUG] ❌ No token found');
        // Clear any stale cached user data
        localStorage.removeItem('cached_user');
      }

      console.log('🔍 [AUTH_DEBUG] Auth initialization complete. isLoading = false');
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (api.isAuthenticated()) {
        const response = await api.getMe();
        const user = response.data?.user || response.user;
        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        } else {
          api.clearAuth();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      api.clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      // Clear any existing auth data before login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('cached_user');
      setUser(null);
      setIsAuthenticated(false);

      const response = await api.login(phone, password);

      // Check both response.data.user and response.user for backward compatibility
      const user = response.data?.user || response.user;

      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        // Cache user data for offline scenarios
        localStorage.setItem('cached_user', JSON.stringify(user));
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (phone: string, password: string, name?: string) => {
    try {
      await api.register(phone, password, name);
      // Registration successful, but user needs to verify OTP
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const sendOtp = async (phone: string) => {
    try {
      await api.sendOtp(phone);
    } catch (error) {
      console.error('Send OTP failed:', error);
      throw error;
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const response = await api.verifyOtp(phone, otp);
      if (response.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        // Cache user data for offline scenarios
        localStorage.setItem('cached_user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      api.clearAuth();
      // Clear cached user data
      localStorage.removeItem('cached_user');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getMe();
      const user = response.data?.user || response.user;
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        sendOtp,
        verifyOtp,
        logout,
        refreshUser,
      }}
    >
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
