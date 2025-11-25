import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DropSearchScreen from "../modules/drop/pages/DropSearchScreen";
import DropScreen from "../modules/drop/pages/DropScreen";
import DebateDropScreen from "../modules/drop/pages/DebateDropScreen";
import { DropScreenProps } from "../modules/drop/types/DropScreen";

export type DropStackParamList = {
  DropSearch: undefined;
  DropDetail: DropScreenProps;
  DebateDrop:
    | {
        selectedSong?: {
          id: string;
          title: string;
          artist: string;
          imageUrl?: string;
        };
        slotIndex?: number;
      }
    | undefined;
};

const Stack = createNativeStackNavigator<DropStackParamList>();

function DropStack() {
  return (
    <Stack.Navigator initialRouteName="DropSearch">
      <Stack.Screen name="DropSearch" component={DropSearchScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DropDetail" component={DropScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DebateDrop" component={DebateDropScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default DropStack;
