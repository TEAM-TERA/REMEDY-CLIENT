// src/modules/music/hooks/useUpdateMusicComment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '../queries/commentKeys';
import { updateComment } from '../api/commentApi';
import type { Comment } from '../types/comment';

export function useUpdateMusicComment(droppingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(commentId, content),

    onMutate: async ({ commentId, content }) => {
      await qc.cancelQueries({ queryKey: commentKeys.byDrop(droppingId) });
      const prev = qc.getQueryData<Comment[]>(commentKeys.byDrop(droppingId)) || [];
      const next = prev.map((c) => (c.id === commentId ? { ...c, content } : c));
      qc.setQueryData<Comment[]>(commentKeys.byDrop(droppingId), next);
      return { prev };
    },

    onError: (_e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(commentKeys.byDrop(droppingId), ctx.prev);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: commentKeys.byDrop(droppingId), exact: true });
    },
  });
}
