import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike, getDropLikeCount, getUserLikeCount } from "../api/likeApi";

export const useDropLikeCount = (droppingId: string) => {
  return useQuery({
    queryKey: ["dropLikeCount", droppingId],
    queryFn: () => getDropLikeCount(droppingId),
  });
};

export const useUserLikeCount = () => {
  return useQuery({
    queryKey: ["userLikeCount"],
    queryFn: getUserLikeCount,
  });
};

// 중복된 useMyLikes 제거 - profile/hooks/useMyLike.ts 사용

export const useToggleLike = (droppingId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLike({ droppingId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropLikeCount", droppingId] });
      queryClient.invalidateQueries({ queryKey: ["userLikeCount"] });
      queryClient.invalidateQueries({ queryKey: ["myLikes"] });
    },
  });
};
