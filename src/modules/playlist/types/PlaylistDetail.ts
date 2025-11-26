export interface PlaylistDetailSong {
  songId: string;
  title: string;
  artist: string;
  albumImagePath: string;
}

export interface PlaylistDropDetail {
  droppingId: string;
  userId: number;
  playlistName: string;
  songs: PlaylistDetailSong[];
  content: string;
  latitude: number;
  longitude: number;
  address: string;
  expiryDate: string;
  createdAt: string;
  likeCount?: number;
}