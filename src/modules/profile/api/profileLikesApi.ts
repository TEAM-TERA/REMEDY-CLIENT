import axiosInstance from "../../auth/api/axiosInstance";

export const getMyLikedDroppingIds = async (): Promise<string[]> => {
  const res = await axiosInstance.get<string[]>("/api/v1/likes/my-like");
  return res.data;
};