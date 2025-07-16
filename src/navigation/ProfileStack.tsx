import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../types/navigation";

import UserProfileScreen from "../modules/profile/pages/UserProfileScreen";
import NameEditScreen from "../modules/profile/pages/NameEditScreen";
import SettingScreen from "../modules/profile/pages/SettingScreen";
import InfoEditScreen from "../modules/profile/pages/InfoEditScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="UserProfile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name = "UserProfile" component={UserProfileScreen} />
      <Stack.Screen name = "NameEdit" component={NameEditScreen} />
      <Stack.Screen name = "Setting" component={SettingScreen} />
      <Stack.Screen name = "InfoEdit" component={InfoEditScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;