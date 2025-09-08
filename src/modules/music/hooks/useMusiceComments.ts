import { useQuery } from '@tanstack/react-query';
import { commentKeys } from '../queries/commentKeys';
import { getCommentsByDroppingId } from '../api/commentApi';

export function useMusicComments(droppingId?: string) {
  return useQuery({
    queryKey: droppingId ? commentKeys.byDrop(droppingId) : commentKeys.byDrop(''),
    queryFn: ({ signal }) => getCommentsByDroppingId(droppingId as string, signal),
    enabled: !!droppingId, 
    staleTime: 30 * 1000,
    retry: 1,
  });
}