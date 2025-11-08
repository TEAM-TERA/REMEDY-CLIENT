import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomShopScreen from "../modules/customize/pages/CustomShopScreen";
import CustomScreen from "../modules/customize/pages/CustomScreen";

export type CustomStackParamList = {
  CustomShop: undefined;
  CustomDetail: undefined;
};

const Stack = createNativeStackNavigator<CustomStackParamList>();

function CustomStack() {
  return (
    <Stack.Navigator initialRouteName="CustomShop">
      <Stack.Screen name="CustomShop" component={CustomShopScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="CustomDetail" component={CustomScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default CustomStack;
