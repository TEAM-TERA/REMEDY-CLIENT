import axiosInstance from "../../auth/api/axiosInstance";

export interface LikeRequest {
  droppingId: string;
}

export interface LikeResponse {
  liked: boolean;
}

export interface LikeCountResponse {
  likeCount: number;
}

// /likes
export const toggleLike = async (data: LikeRequest): Promise<LikeResponse> => {
  const res = await axiosInstance.post<LikeResponse>("/likes", data);
  return res.data;
};

// /likes/count/dropping/{droppingId}
export const getDropLikeCount = async (droppingId: string): Promise<LikeCountResponse> => {
    const res = await axiosInstance.get<LikeCountResponse>(
      `/likes/count/dropping/${droppingId}`
    );
    return res.data;
};

// /likes/count/user
export const getUserLikeCount = async (): Promise<LikeCountResponse> => {
    const res = await axiosInstance.get<LikeCountResponse>(
      "/likes/count/user"
    );
    return res.data;
};