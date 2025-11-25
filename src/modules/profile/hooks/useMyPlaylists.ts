import { useQuery } from '@tanstack/react-query';
import { getMyPlaylists } from '../api/playlistApi';
import type { PlaylistsResponse } from '../types/Playlist';

export const useMyPlaylists = () => {
  return useQuery<PlaylistsResponse>({
    queryKey: ['playlists', 'my'],
    queryFn: getMyPlaylists,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
};