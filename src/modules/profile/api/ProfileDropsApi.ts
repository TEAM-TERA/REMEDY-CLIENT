import axiosInstance from "../../auth/api/axiosInstance";

export type MyDrop = {
  type: string;
  droppingId: string;
  userId: number;
  songId: string;
  latitude: number;
  longitude: number;
  address: string;
  albumImageUrl?: string;
};

export const getMyDrops = async (): Promise<MyDrop[]> => {
  const res = await axiosInstance.get<{droppings: MyDrop[]}>("/users/my-drop");
  return res.data.droppings;
};
