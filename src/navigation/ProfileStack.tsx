import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UserProfileScreen from "../modules/profile/pages/UserProfileScreen";
import NameEditScreen from "../modules/profile/pages/NameEditScreen";
import SettingScreen from "../modules/profile/pages/SettingScreen";
import InfoEditScreen from "../modules/profile/pages/InfoEditScreen";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="UserProfile">
      <Stack.Screen name = "UserProfile" component={UserProfileScreen} />
      <Stack.Screen name = "NameEdit" component={NameEditScreen} />
      <Stack.Screen name = "Setting" component={SettingScreen} />
      <Stack.Screen name = "InfoEdit" component={InfoEditScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;