import axiosInstance from './axiosInstance';

type LoginResponse = {
  accessToken?: string;
  token?: string;
};

export async function loginApi(email: string, password: string) {
  const res = await axiosInstance.post<LoginResponse>('/auth/login', { email, password });

  const fromBody = res.data?.accessToken ?? res.data?.token;
  const fromHeader = (res.headers?.authorization || res.headers?.Authorization)?.replace(/^Bearer\s+/,'');
  const token = fromBody ?? fromHeader;

  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('NO_TOKEN_IN_RESPONSE');
  }
  return token;
}

type SignUpRequest = {
  username: string;
  password: string;
  email: string;
  birthDate: string;
  gender: boolean;
};

export async function signUpApi(payload: SignUpRequest) {
  const res = await axiosInstance.post('/auth/signup', payload);
  return res.data;
}