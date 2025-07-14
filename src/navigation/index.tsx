import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DropSearchScreen from '../modules/drop/pages/DropSearchScreen';
import UserProfileScreen from '../modules/profile/pages/UserProfileScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Profile" component={UserProfileScreen} />
        <Stack.Screen name="Drop" component={DropSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}