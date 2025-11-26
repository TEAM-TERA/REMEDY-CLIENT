import axiosInstance from '../../auth/api/axiosInstance';
import type { PlaylistApiResponse } from '../types/playlist';

export const getPlaylistById = async (playlistId: string): Promise<PlaylistApiResponse> => {
  const response = await axiosInstance.get<PlaylistApiResponse>(`/playlists/${playlistId}`);
  return response.data;
};

export const createPlaylist = async (name: string): Promise<PlaylistApiResponse> => {
  const response = await axiosInstance.post<PlaylistApiResponse>('/playlists', {
    name,
  });
  return response.data;
};