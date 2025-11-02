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

export async function listSongs() {
  try {
    const res = await axiosInstance.get("/songs");
    return res.data?.songs ?? res.data?.songResponses ?? [];
  } catch (error) {
    throw error;
  }
}

export async function getDroppings({ longitude, latitude }: { longitude: number; latitude: number }) {
  const res = await axiosInstance.get("/droppings", {
    params: { longitude, latitude }
  });
  return res.data.droppings;
}

export async function getSongInfo(songId: string) {
  const res = await axiosInstance.get(`/songs/${songId}`);
  return res.data;
}

export async function getDroppingById(droppingId: string) {
  const res = await axiosInstance.get(`/droppings/${droppingId}`);
  return res.data;
}