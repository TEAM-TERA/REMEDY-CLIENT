// src/navigation/RootNavigation.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../modules/auth/auth-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

import DropStack from './DropStack';
import ProfileStack from './ProfileStack';
import AuthStack from './AuthStack';
import HomeScreen from '../modules/home/pages/HomeScreen';
import MusicScreen from '../modules/music/pages/MusicScreen';
import PlaylistScreen from '../modules/music/pages/PlaylistScreen';
import ChallengeScreen from '../modules/challenge/pages/ChallengeScreen';
import TutorialScreenPage from '../modules/tutorial/pages/TutorialScreen';
import DebateDropScreen from '../modules/drop/pages/DebateDropScreen';
import PlaylistMusicSearchScreen from '../modules/music/pages/PlaylistMusicSearchScreen';
import DebateMusicSearchScreen from '../modules/drop/pages/DebateMusicSearchScreen';
import DebateScreen from '../modules/music/pages/DebateScreen';
import MusicDetailScreen from '../modules/music/pages/MusicDetailScreen';
import MusicPlayerScreen from '../modules/music/pages/MusicPlayerScreen';
import PlaylistSelectionScreen from '../modules/drop/pages/PlaylistSelectionScreen';
import PlaylistDropModal from '../modules/drop/pages/PlaylistDropModal';
import PlaylistDetailScreen from '../modules/playlist/pages/PlaylistDetailScreen';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export function navigate<Screen extends keyof RootStackParamList>(
  screen: Screen
): void;
export function navigate<Screen extends keyof RootStackParamList>(
  screen: Screen,
  params: RootStackParamList[Screen]
): void;
export function navigate(screen: any, params?: any) {
  if (navigationRef.isReady()) {
    if (params === undefined) {
      navigationRef.navigate(screen);
    } else {
      navigationRef.navigate(screen, params);
    }
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigation() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={userToken ? 'Home' : 'Auth'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
        <Stack.Screen name="Drop" component={DropStack} options={{ headerShown: false }} />
        <Stack.Screen name="Music" component={MusicScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Playlist" component={PlaylistScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Challenge" component={ChallengeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tutorial" component={TutorialScreenPage} options={{ headerShown: false }} />
        <Stack.Screen name="DebateDrop" component={DebateDropScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DebateMusicSearch" component={DebateMusicSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PlaylistMusicSearch" component={PlaylistMusicSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DebateScreen" component={DebateScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MusicDetail" component={MusicDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MusicPlayer" component={MusicPlayerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PlaylistSelection" component={PlaylistSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="PlaylistDropModal"
          component={PlaylistDropModal}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
