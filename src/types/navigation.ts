export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  Profile: undefined;
  Drop: undefined;
};

export type ProfileStackParamList = {
  UserProfile: undefined;
  NameEdit: undefined;
  Setting: undefined;
  InfoEdit: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}