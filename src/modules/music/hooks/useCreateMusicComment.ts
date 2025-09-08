import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '../queries/commentKeys';
import { createComment } from '../api/commentApi';
import type { Comment } from '../types/comment';

export function useCreateMusicComment(droppingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment(droppingId, content),

    onMutate: async (content) => {
      await qc.cancelQueries({ queryKey: commentKeys.byDrop(droppingId) });

      const prev = qc.getQueryData<Comment[]>(commentKeys.byDrop(droppingId)) || [];

      const tempId = -Date.now();
      const optimistic: Comment = { id: tempId, content, droppingId };

      qc.setQueryData<Comment[]>(commentKeys.byDrop(droppingId), [optimistic, ...prev]);

      return { prev, tempId };
    },

    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(commentKeys.byDrop(droppingId), ctx.prev);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.byDrop(droppingId), exact: true });
    },
  });
}
