import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DropStack from './DropStack';
import ProfileStack from './ProfileStack';
import AuthStack from './AuthStack';
import HomeScreen from '../modules/home/pages/HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name = "Home" component = {HomeScreen}/>
        <Stack.Screen name = "Auth" component = {AuthStack} options={{ headerShown: false }}/>
        <Stack.Screen name = "Profile" component = {ProfileStack} />
        <Stack.Screen name = "Drop" component = {DropStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}