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
import ChallengeScreen from '../modules/challenge/pages/ChallengeScreen';

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
        <Stack.Screen name="Challenge" component={ChallengeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
