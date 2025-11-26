import axiosInstance from "../../auth/api/axiosInstance";
import { AxiosError } from "axios";
import { handleApiError } from "../../../utils/errorHandler";

export async function createDropping({
  songId,
  playlistId,
  type = "MUSIC",
  content,
  latitude,
  longitude,
  address,
}: {
  songId?: string;
  playlistId?: string;
  type?: "MUSIC" | "PLAYLIST";
  content: string;
  latitude: number;
  longitude: number;
  address: string;
}) {
  try {
    const payload: any = {
      type,
      content,
      latitude,
      longitude,
      address,
    };

    if (type === "MUSIC" && songId) {
      payload.songId = songId;
    } else if (type === "PLAYLIST" && playlistId) {
      payload.playlistId = playlistId;
    }

    const res = await axiosInstance.post("/droppings", payload);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function listSongs() {
  try {
    const res = await axiosInstance.get("/songs");
    return res.data?.songs ?? res.data?.songResponses ?? [];
  } catch (error) {
    handleApiError(error);
  }
}

export async function toggleLike(droppingId: string) {
  try {
    const res = await axiosInstance.post("/likes", {
      droppingId
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getLikeCount(droppingId: string) {
  try {
    const res = await axiosInstance.get(`/likes/count/dropping/${droppingId}`);
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getDroppings({
  longitude,
  latitude,
  distance = 1000
}: {
  longitude: number;
  latitude: number;
  distance?: number;
}) {
  try {
    console.log('🔍 getDroppings 호출:', { longitude, latitude, distance });
    const res = await axiosInstance.get("/droppings", {
      params: { longitude, latitude, distance }
    });
    console.log('🔍 getDroppings 응답:', res.data);
    return res.data.droppings;
  } catch (error) {
    console.error('🔍 getDroppings 에러:', error);
    handleApiError(error);
  }
}

export async function getSongInfo(songId: string) {
  try {
    console.log(`getSongInfo 호출: ${songId}`);
    const res = await axiosInstance.get(`/songs/${songId}`);
    console.log(`getSongInfo 응답:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`getSongInfo 에러 (ID: ${songId}):`, error);
    if ((error as AxiosError)?.response?.status === 404) {
      console.warn(`곡 ${songId}를 찾을 수 없습니다 (404)`);
    }
    handleApiError(error);
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
    if ((error as AxiosError)?.response?.status === 404) {
      console.warn(`드랍핑 ${droppingId}를 찾을 수 없습니다 (404)`);
    }
    handleApiError(error);
  }
}

export async function createVoteDropping(payload: {
  topic: string;
  options: string[];
  content: string;
  latitude: number;
  longitude: number;
  address: string;
}) {
  try {
    const res = await axiosInstance.post("/droppings", {
      type: "VOTE",
      ...payload,
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function voteOnDropping(droppingId: string, songId: string) {
  try {
    console.log(`voteOnDropping 호출: droppingId=${droppingId}, songId=${songId}`);
    const res = await axiosInstance.post(`/droppings/${droppingId}/vote`, {
      songId,
    });
    console.log(`voteOnDropping 응답:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`voteOnDropping 에러:`, error);
    handleApiError(error);
  }
}

export async function deleteVoteOnDropping(droppingId: string) {
  try {
    console.log(`deleteVoteOnDropping 호출: droppingId=${droppingId}`);
    const res = await axiosInstance.delete(`/droppings/${droppingId}/vote`);
    console.log(`deleteVoteOnDropping 응답:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`deleteVoteOnDropping 에러:`, error);
    handleApiError(error);
  }
}

export async function getComments(droppingId: string) {
  try {
    console.log(`getComments 호출: droppingId=${droppingId}`);
    const res = await axiosInstance.get(`/comments/droppings/${droppingId}`);
    console.log(`getComments 응답:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`getComments 에러:`, error);
    handleApiError(error);
  }
}

export async function addComment(droppingId: string, content: string) {
  try {
    console.log(`addComment 호출: droppingId=${droppingId}, content=${content}`);
    const res = await axiosInstance.post(`/comments`, {
      content,
      droppingId,
    });
    console.log(`addComment 응답:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`addComment 에러:`, error);
    handleApiError(error);
  }
}
