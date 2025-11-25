import { useQuery } from '@tanstack/react-query';
import { getPlaylistById } from '../api/playlistApi';

export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getPlaylistById(playlistId),
    enabled: !!playlistId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
};