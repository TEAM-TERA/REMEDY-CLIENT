import { useQuery } from "@tanstack/react-query";
import { getMyDrops } from "../api/ProfileDropsApi";

export const useMyDrop = () => {
  return useQuery({
    queryKey: ["myDrops"],
    queryFn: getMyDrops,
  });
};