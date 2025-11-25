export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  Profile: undefined;
  Drop: undefined;
  Challenge: undefined;
  Customize: undefined;
  Tutorial: undefined;

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