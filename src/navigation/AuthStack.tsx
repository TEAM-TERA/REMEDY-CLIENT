// src/modules/drop/navigation/DropStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../modules/auth/pages/LoginScreen";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name = "Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;