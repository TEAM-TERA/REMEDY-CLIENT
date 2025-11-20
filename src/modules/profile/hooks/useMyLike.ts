import { useQuery } from "@tanstack/react-query";
import { getMyLikedDroppingIds } from "../api/profileLikesApi";

export const useMyLikes = () => {
  return useQuery({
    queryKey: ["myLikes"],
    queryFn: getMyLikedDroppingIds,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      console.log(`좋아요 목록 조회 재시도 ${failureCount}번째:`, error);
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};