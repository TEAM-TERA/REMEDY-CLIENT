import axiosInstance from "./axiosInstance";

export async function loginApi(email: string, password: string) {
  const res = await axiosInstance.post("/api/v1/auth/login", { email, password });
  return res.data.accessToken;
}