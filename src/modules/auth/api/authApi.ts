import axiosInstance from './axiosInstance';
import { handleApiError } from '../../../utils/errorHandler';

type LoginResponse = {
  accessToken?: string;
  token?: string;
};

export async function loginApi(email: string, password: string) {
  try {
    const res = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });

    const fromBody = res.data?.accessToken ?? res.data?.token;
    const fromHeader = (res.headers?.authorization || res.headers?.Authorization)?.replace(/^Bearer\s+/,'');
    const token = fromBody ?? fromHeader;

    if (typeof token !== 'string' || token.length === 0) {
      throw new Error('NO_TOKEN_IN_RESPONSE');
    }
    return token;
  } catch (error) {
    handleApiError(error);
  }
}

type SignUpRequest = {
  username: string;
  password: string;
  email: string;
  birthDate: string;
  gender: boolean;
};

export async function signUpApi(payload: SignUpRequest) {
  const res = await axiosInstance.post('/auth/register', payload);
  return res.data;
}

// Profile image upload API
export async function updateProfileImageApi(imageFile: any) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const res = await axiosInstance.put('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

// Get my likes API
export async function getMyLikesApi() {
  try {
    const res = await axiosInstance.get('/users/my-like');
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}