import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../api/authApi';
import { getMyProfile } from '../../profile/api/profileApi';
import { profileKeys } from '../../../queries/keys/profile';
import axiosInstance from '../api/axiosInstance';

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: async (accessToken) => {
      await AsyncStorage.setItem('userToken', accessToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      await qc.prefetchQuery({
        queryKey: profileKeys.me(),
        queryFn: getMyProfile,
      });
    },
  });
}