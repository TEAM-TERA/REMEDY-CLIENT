// 드랍핑 기본 타입
interface BaseDropping {
  droppingId: string;
  userId: number;
  content: string;
  latitude: number;
  longitude: number;
  address: string;
  isMyDropping: boolean;
}

// 음악 드랍핑
export interface MusicDropping extends BaseDropping {
  type: "MUSIC";
  songId: string;
  title: string;
  artist: string;
  albumImageUrl: string;
}

// 투표 드랍핑
export interface VoteDropping extends BaseDropping {
  type: "VOTE";
  topic: string;
  options: string[];
  firstAlbumImageUrl: string;
}

// 플레이리스트 드랍핑
export interface PlaylistDropping extends BaseDropping {
  type: "PLAYLIST";
  playlistName: string;
  songIds: string[];
  firstAlbumImageUrl: string;
}

// 드랍핑 유니온 타입
export type Dropping = MusicDropping | VoteDropping | PlaylistDropping;

// 드랍핑 목록 응답
export interface DroppingsResponse {
  droppings: Dropping[];
}