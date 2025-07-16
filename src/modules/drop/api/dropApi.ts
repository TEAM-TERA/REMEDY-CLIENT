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

export async function searchSongs(query: string) {
  const res = await axiosInstance.get("/api/v1/songs/search", {
    params: { query }
  });
  return res.data.songSearchResponse;
}

export async function getDroppings({ longitude, latitude }: { longitude: number; latitude: number }) {
  const res = await axiosInstance.get("/droppings", {
    params: { longitude, latitude }
  });
  return res.data.droppings;
}