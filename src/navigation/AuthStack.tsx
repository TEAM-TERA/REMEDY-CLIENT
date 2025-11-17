import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types/navigation";

import LoginScreen from "../modules/auth/pages/LoginScreen";
import SignUpScreen from "../modules/auth/pages/SignUpScreen";
import TermsScreen from "../modules/auth/pages/TermsScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name = "Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name = "Terms" component={TermsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name = "SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default AuthStack;