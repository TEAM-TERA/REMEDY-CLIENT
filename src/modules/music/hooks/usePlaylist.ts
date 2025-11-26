import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlaylistById } from '../api/playlistApi';
import { addSongToPlaylist } from '../../profile/api/playlistApi';

export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getPlaylistById(playlistId),
    enabled: !!playlistId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
};

export const useAddSongToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: string; songId: string }) =>
      addSongToPlaylist(playlistId, [songId]), // songId를 배열로 감쌈
    onSuccess: (_, variables) => {
      // Invalidate and refetch playlist data
      queryClient.invalidateQueries({
        queryKey: ['playlist', variables.playlistId],
      });

      // Also invalidate my playlists if it exists
      queryClient.invalidateQueries({
        queryKey: ['playlists', 'my'],
      });
    },
  });
};