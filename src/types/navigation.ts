export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  Profile: undefined;
  Drop: undefined;
  Challenge: undefined;
  Customize: undefined;
  Tutorial: undefined;
  DebateDrop:
    | {
        selectedSong?: {
          id: string;
          title: string;
          artist: string;
          imageUrl?: string;
        };
        slotIndex?: number;
      }
    | undefined;
  DebateMusicSearch: {
    slotIndex: number;
    parentKey?: string;
  };

  Music: {
    droppingId: string;
    songId: string;
    title: string;
    artist: string;
    location: string;
    message?: string;
  };

  Playlist: {
    playlistId: string;
  };

  PlaylistMusicSearch: {
    playlistId: string;
    playlistName?: string;
  };

  DebateScreen: {
    droppingId: string;
    content?: string;
    location?: string;
  };

  MusicDetail: {
    songId: string;
  };

  MusicPlayer: {
    songId: string;
    songInfo?: {
      title: string;
      artist: string;
      albumImagePath: string;
    };
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Terms: undefined;
  SignUp: {
    requiredServiceTerms: boolean;
    requiredPrivacyTerms: boolean;
    locationConsent?: boolean;
    marketingConsent?: boolean;
  } | undefined;
};

export type ProfileStackParamList = {
  UserProfile: undefined;
  NameEdit: undefined;
  Setting: undefined;
  InfoEdit: undefined;
  Logout: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
