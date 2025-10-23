import axiosInstance from "../../auth/api/axiosInstance";

export const getMyLikedDroppingIds = async (): Promise<string[]> => {
  const res = await axiosInstance.get<string[]>("/users/my-like");
  return res.data;
};