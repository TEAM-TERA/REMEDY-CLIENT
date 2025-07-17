import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DropSearchScreen from "../modules/drop/pages/DropSearchScreen";
import DropScreen from "../modules/drop/pages/DropScreen";
import { DropScreenProps } from "../modules/drop/types/DropScreen";

export type DropStackParamList = {
  DropSearch: undefined;
  DropDetail: DropScreenProps;
};

const Stack = createNativeStackNavigator<DropStackParamList>();

function DropStack() {
  return (
    <Stack.Navigator initialRouteName="DropSearch">
      <Stack.Screen name="DropSearch" component={DropSearchScreen}options={{ headerShown: false }}/>
      <Stack.Screen name="DropDetail" component={DropScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default DropStack;