import axiosInstance from '../../auth/api/axiosInstance';
import type { PlaylistsResponse } from '../types/Playlist';

export const getMyPlaylists = async (): Promise<PlaylistsResponse> => {
  const response = await axiosInstance.get('/playlists/my');
  return response.data;
};

export const renamePlaylist = async (playlistId: string | number, name: string) => {
  const response = await axiosInstance.put(`/playlists/${playlistId}`, { name });
  return response.data;
};

export const deletePlaylist = async (playlistId: string | number) => {
  const response = await axiosInstance.delete(`/playlists/${playlistId}`);
  return response.data;
};

export const addSongToPlaylist = async (playlistId: string | number, songId: string) => {
  const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
  return response.data;
};
