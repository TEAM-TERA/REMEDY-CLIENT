import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DropStack from './DropStack';
import ProfileStack from './ProfileStack';
import AuthStack from './AuthStack';
import HomeScreen from '../modules/home/pages/HomeScreen';

import GoogleMapView from '../components/map/GoogleMapView';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name = "Home" component = {HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name = "Auth" component = {AuthStack} options={{ headerShown: false }}/>
        <Stack.Screen name = "Profile" component = {ProfileStack} options={{ headerShown: false }} />
        <Stack.Screen name = "Drop" component = {DropStack} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}