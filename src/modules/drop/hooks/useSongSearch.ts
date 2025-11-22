import { useQuery } from "@tanstack/react-query";
import { listSongs } from "../api/dropApi";

export interface SongSearchItem {
    id: string;
    title: string;
    artist: string;
    duration: number;
    albumImagePath: string;
}

export function useSongSearch(query : string) {

  const q = (query ?? '').trim();

  return useQuery({
    queryKey: ['songs', 'all'],
    queryFn: () => listSongs(),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    select: (songs: SongSearchItem[]) => {
      const keyword = q.toLowerCase();
      if (!keyword) return songs;
      return songs.filter((s) =>
        [s.title, s.artist].some((v) => v?.toLowerCase().includes(keyword))
      );
    },
  });
}
