import axiosInstance from "./axiosInstance";

export async function loginApi(email: string, password: string) {
  const res = await axiosInstance.post("/auth/login", { email, password });
  return res.data.accessToken;
}