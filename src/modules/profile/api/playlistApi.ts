import { axiosInstance } from '../../auth/api/axiosInstance';
import type { PlaylistsResponse } from '../types/Playlist';

export const getMyPlaylists = async (): Promise<PlaylistsResponse> => {
  const response = await axiosInstance.get('/api/v1/playlists/my');
  return response.data;
};