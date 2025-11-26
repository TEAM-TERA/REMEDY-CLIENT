export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  albumImagePath: string;
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
}

export interface PlaylistApiResponse {
  id: number;
  name: string;
  songs: Song[];
}