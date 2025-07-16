import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DropStack from './DropStack';
import ProfileStack from './ProfileStack';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Profile" component={ProfileStack} />
        <Stack.Screen name="Drop" component={DropStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}