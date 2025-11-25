import axiosInstance from '../../auth/api/axiosInstance';
import type { PlaylistApiResponse } from '../types/playlist';

export const getPlaylistById = async (playlistId: string): Promise<PlaylistApiResponse> => {
  const response = await axiosInstance.get<PlaylistApiResponse>(`/api/v1/playlists/${playlistId}`);
  return response.data;
};

export const createPlaylist = async (name: string): Promise<PlaylistApiResponse> => {
  const response = await axiosInstance.post<PlaylistApiResponse>('/api/v1/playlists', {
    name,
  });
  return response.data;
};