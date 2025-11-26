export interface Playlist {
  id: string;
  name: string;
  albumImageUrl?: string;
}

export interface PlaylistsResponse {
  playlists: Playlist[];
}