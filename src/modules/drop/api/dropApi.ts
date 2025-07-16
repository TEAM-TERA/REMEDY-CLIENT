import axiosInstance from "../../auth/api/axiosInstance";

export async function createDropping({
  songId,
  content,
  latitude,
  longitude,
  address,
}: {
  songId: string;
  content: string;
  latitude: number;
  longitude: number;
  address: string;
}) {
  const res = await axiosInstance.post("/droppings", {
    songId,
    content,
    latitude,
    longitude,
    address,
  });
  return res.data;
}