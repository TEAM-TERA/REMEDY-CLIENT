import { useQuery } from "@tanstack/react-query";
import { getMyLikedDroppingIds } from "../api/profileLikesApi";

export const useMyLikes = () => {
  return useQuery({
    queryKey: ["myLikes"],
    queryFn: getMyLikedDroppingIds,
  });
};