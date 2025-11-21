import axiosInstance from "../../auth/api/axiosInstance";

export interface LikedDropping {
  droppingId: string;
  songId: string;
  songTitle: string;
  albumImageUrl: string;
  address: string;
}

export const getMyLikedDroppings = async (): Promise<LikedDropping[]> => {
  try {
    console.log('좋아요 목록 API 호출 시작: /users/my-like');
    const res = await axiosInstance.get<LikedDropping[]>("/users/my-like");
    console.log('좋아요 목록 API 응답:', res.data);
    return res.data || [];
  } catch (error) {
    console.error('좋아요 목록 API 에러:', error);
    throw error;
  }
};

// 기존 함수명 유지 (호환성)
export const getMyLikedDroppingIds = getMyLikedDroppings;
