import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "../api/dropApi";
import { searchTracks } from '../../../services/spotify/api';

export interface SongSearchItem {
    id: string;
    title: string;
    artist: string;
    duration: number;
}

export function useSongSearch(query : string) {

  const q = (query ?? '').trim();

  return useQuery({
    queryKey: ['songSearch', q],
    queryFn: ({ signal }) => searchTracks(q, signal),
    enabled: q.length > 0,
    staleTime: 60 * 1000,
    retry: 1,
  });
}
