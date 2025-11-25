import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPlaylist } from '../api/playlistApi';

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      // 플레이리스트 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['myPlaylists'] });
    },
    onError: (error) => {
      console.error('플레이리스트 생성 실패:', error);
    },
  });
};