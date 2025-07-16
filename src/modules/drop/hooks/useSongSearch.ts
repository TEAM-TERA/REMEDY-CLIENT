import { useQuery } from "@tanstack/react-query";
import { searchSongs } from "../api/dropApi";

export interface SongSearchItem {
    id: string;
    title: string;
    artist: string;
    duration: number;
}

export function useSongSearch(query : string) {
  return useQuery<SongSearchItem[]>({
    queryKey: ["songSearch", query],
    queryFn: () => searchSongs(query),
    enabled: !!query, 
  });
}