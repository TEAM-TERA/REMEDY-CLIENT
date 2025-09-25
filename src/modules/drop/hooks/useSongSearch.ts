import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "../api/dropApi";

export interface SongSearchItem {
    id: string;
    title: string;
    artist: string;
    duration: number;
}

export function useSongSearch(query : string) {

  const q = (query ?? '').trim();

  return useQuery({
    queryKey: ['songSearch'],
    queryFn: () => searchSongs(),
    enabled: true,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
