import axiosInstance from "../../auth/api/axiosInstance";

export interface LikeRequest {
  userId: number;
  droppingId: string;
}

export interface LikeResponse {
  liked: boolean;
}

export interface LikeCountResponse {
  likeCount: number;
}

// /api/v1/likes
export const toggleLike = async (data: LikeRequest): Promise<LikeResponse> => {
  const res = await axiosInstance.post<LikeResponse>("/api/v1/likes", data);
  return res.data;
};
