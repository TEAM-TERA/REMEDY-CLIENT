export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  Profile: undefined;
  Drop: undefined;

  Music: {
    droppingId: string;
    songId: string;
    title: string;
    artist: string;
    location: string;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
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