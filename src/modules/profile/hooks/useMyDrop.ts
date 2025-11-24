import { useQuery } from "@tanstack/react-query";
import { getMyDrops, type MyDrop } from "../api/ProfileDropsApi";

export const useMyDrop = () => {
  return useQuery<MyDrop[]>({
    queryKey: ["myDrops"],
    queryFn: getMyDrops,
  });
};