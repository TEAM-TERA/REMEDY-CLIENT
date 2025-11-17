import axiosInstance from '../../auth/api/axiosInstance';
import type { Profile, UpdateProfilePayload, UpdateProfileResponse } from '../types/profile';

const USERS_PATH = '/users';

export async function getMyProfile() {
  const { data } = await axiosInstance.get<Profile>(USERS_PATH);
  return data;
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  console.log('updateMyProfile API 호출:', {
    url: USERS_PATH,
    method: 'PATCH',
    payload
  });
  
  const { data } = await axiosInstance.patch<UpdateProfileResponse>(USERS_PATH, payload);
  console.log('updateMyProfile API 응답:', data);
  return data;
}
