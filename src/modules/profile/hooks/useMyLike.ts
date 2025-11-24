import { useQuery } from "@tanstack/react-query";
import { getMyLikedDroppings, type LikedDropping } from "../api/profileLikesApi";

export const useMyLikes = () => {
  return useQuery<LikedDropping[]>({
    queryKey: ["myLikes"],
    queryFn: getMyLikedDroppings,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount) => {
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};