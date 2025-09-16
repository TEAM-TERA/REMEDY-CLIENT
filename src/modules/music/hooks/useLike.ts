import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike, getDropLikeCount, getUserLikeCount } from "../api/likeApi";
import { getMyLikedDroppingIds } from "../../profile/api/profileLikesApi";

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

export const useMyLikes = () => {
  return useQuery({
    queryKey: ["myLikes"],
    queryFn: getMyLikedDroppingIds,
  });
};

export const useToggleLike = (droppingId: string, userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleLike({ userId, droppingId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropLikeCount", droppingId] });
      queryClient.invalidateQueries({ queryKey: ["userLikeCount"] });
      queryClient.invalidateQueries({ queryKey: ["myLikes"] });
    },
  });
};
