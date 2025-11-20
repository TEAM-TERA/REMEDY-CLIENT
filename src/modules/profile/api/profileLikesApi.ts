import axiosInstance from "../../auth/api/axiosInstance";

export const getMyLikedDroppingIds = async (): Promise<string[]> => {
  try {
    console.log('좋아요 목록 API 호출 시작: /users/my-like');
    const res = await axiosInstance.get<string[]>("/users/my-like");
    console.log('좋아요 목록 API 응답:', res.data);
    return res.data || [];
  } catch (error) {
    console.error('좋아요 목록 API 에러:', error);
    throw error;
  }
};
