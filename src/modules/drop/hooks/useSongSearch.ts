import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "../api/dropApi";

export function useSongSearch(query: string) {
  return useQuery({
    queryKey: ["songSearch", query],
    queryFn: () => searchSongs(query),
    enabled: !!query, 
  });
}