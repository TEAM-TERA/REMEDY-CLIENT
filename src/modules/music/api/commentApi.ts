import axiosInstance from '../../auth/api/axiosInstance';
import type { Comment } from '../types/comment';

const BASE = '/comments';

// GET
export async function getCommentsByDroppingId(droppingId: string, signal?: AbortSignal) {
  const { data } = await axiosInstance.get<Comment[]>(
    `${BASE}/droppings/${droppingId}`,
    { signal }
  );
  return data;
}

// POST
export async function createComment(droppingId: string, content: string) {
  const { data } = await axiosInstance.post<{ id?: number; message?: string }>(
    BASE,
    { content, droppingId }
  );
  return data;
}

// PUT
export async function updateComment(commentId: number, content: string) {
  const { data } = await axiosInstance.put<{ message?: string }>(
    `${BASE}/${commentId}`,
    { content }
  );
  return data;
}
