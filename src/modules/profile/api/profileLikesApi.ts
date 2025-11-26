import axiosInstance from "../../auth/api/axiosInstance";

export interface LikedDropping {
  droppingId: string;
  droppingType: "MUSIC" | "PLAYLIST" | "VOTE";
  // MUSIC type
  title?: string;
  artist?: string;
  imageUrl?: string;
  // PLAYLIST type
  playlistName?: string;
  // VOTE type
  topic?: string;
  // Common
  address: string;
}

export const getMyLikedDroppings = async (): Promise<{ droppings: LikedDropping[] }> => {
  try {
    console.log('🔥 [DEBUG] 좋아요 목록 API 호출 시작: /users/my-like');
    const res = await axiosInstance.get<{ droppings: LikedDropping[] }>("/users/my-like");
    console.log('🔥 [DEBUG] 좋아요 목록 API 응답 상태:', res.status);
    console.log('🔥 [DEBUG] 좋아요 목록 API 응답 데이터:', JSON.stringify(res.data, null, 2));
    console.log('🔥 [DEBUG] droppings 배열:', res.data?.droppings);
    console.log('🔥 [DEBUG] droppings 길이:', res.data?.droppings?.length);

    const result = res.data || { droppings: [] };
    console.log('🔥 [DEBUG] 최종 반환값:', result);
    return result;
  } catch (error) {
    console.error('🔥 [DEBUG] 좋아요 목록 API 에러:', error);
    throw error;
  }
};

// 기존 함수명 유지 (호환성)
export const getMyLikedDroppingIds = getMyLikedDroppings;
