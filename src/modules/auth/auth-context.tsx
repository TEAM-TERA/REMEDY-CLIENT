// src/modules/auth/auth-context.tsx
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './api/axiosInstance';
import { getMyProfile } from '../profile/api/profileApi';

type AuthContextType = {
  userToken: string | null;
  isLoading: boolean;
  user: any;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setIsLoading(false);
          return;
        }
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const userProfile = await getMyProfile();

        setUserToken(token);
        setUser(userProfile);
      } catch (err) {
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    const userProfile = await getMyProfile();
    
    setUserToken(token);
    setUser(userProfile);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
