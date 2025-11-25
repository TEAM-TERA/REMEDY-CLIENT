export interface Playlist {
  id: number;
  name: string;
}

export interface PlaylistsResponse {
  playlists: Playlist[];
}