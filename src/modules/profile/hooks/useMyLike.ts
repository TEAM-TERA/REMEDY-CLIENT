import { useQuery } from "@tanstack/react-query";
import { getMyLikedDroppings, type LikedDropping } from "../api/profileLikesApi";

export const useMyLikes = () => {
  return useQuery<{ droppings: LikedDropping[] }>({
    queryKey: ["myLikes"],
    queryFn: async () => {
      console.log("🔥 [DEBUG] useMyLikes - queryFn 실행 시작");
      try {
        const result = await getMyLikedDroppings();
        console.log("🔥 [DEBUG] useMyLikes - queryFn 성공:", result);
        return result;
      } catch (error) {
        console.log("🔥 [DEBUG] useMyLikes - queryFn 에러:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount) => {
      console.log("🔥 [DEBUG] useMyLikes - retry attempt:", failureCount);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};