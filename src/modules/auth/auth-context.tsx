// src/modules/auth/auth-context.tsx
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './api/axiosInstance';
import { getMyProfile } from '../profile/api/profileApi';

type AuthContextType = {
  userToken: string | null;
  isLoading: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setIsLoading(false);
          return;
        }
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await getMyProfile();

        setUserToken(token);
      } catch (err) {
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
