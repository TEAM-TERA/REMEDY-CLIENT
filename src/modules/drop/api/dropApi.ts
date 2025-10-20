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

export async function searchSongs() {
  console.log('searchSongs API 호출 시작');
  try {
    const res = await axiosInstance.get("/songs");
    console.log('searchSongs API 응답:', res.data);
    return res.data.songResponses;
  } catch (error) {
    console.error('searchSongs API 에러:', error);
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