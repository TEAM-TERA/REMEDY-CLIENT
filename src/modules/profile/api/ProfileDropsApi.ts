import axiosInstance from "../../auth/api/axiosInstance";

export type MyDrop = {
  droppingId: string;
  userId: number;
  songId: string;
  latitude: number;
  longitude: number;
  address: string;
};

export const getMyDrops = async (): Promise<MyDrop[]> => {
  const res = await axiosInstance.get<MyDrop[]>("/api/v1/users/my-drop");
  return res.data;
};