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
  try {
    console.log(`getSongInfo 호출: ${songId}`);
    const res = await axiosInstance.get(`/songs/${songId}`);
    console.log(`getSongInfo 응답:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`getSongInfo 에러 (ID: ${songId}):`, error);
    if (error?.response?.status === 404) {
      console.warn(`곡 ${songId}를 찾을 수 없습니다 (404)`);
    }
    throw error;
  }
}

export async function getDroppingById(droppingId: string) {
  try {
    console.log(`getDroppingById 호출: ${droppingId}`);
    const res = await axiosInstance.get(`/droppings/${droppingId}`);
    console.log(`getDroppingById 응답:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`getDroppingById 에러 (ID: ${droppingId}):`, error);
    if (error?.response?.status === 404) {
      console.warn(`드랍핑 ${droppingId}를 찾을 수 없습니다 (404)`);
    }
    throw error;
  }
}