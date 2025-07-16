// src/modules/drop/navigation/DropStack.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DropSearchScreen from "../modules/drop/pages/DropSearchScreen";
import DropScreen from "../modules/drop/pages/DropScreen";

const Stack = createNativeStackNavigator();

export default function DropStack() {
  return (
    <Stack.Navigator initialRouteName="DropSearch">
      <Stack.Screen name="DropSearch" component={DropSearchScreen} />
      <Stack.Screen name="DropDetail" component={DropScreen} />
    </Stack.Navigator>
  );
}