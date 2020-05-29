// Navigation

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../Views/Home";
import Settings from "../Views/Settings";
import Sessions from "../Views/Sessions";
import SessionDetails from "../Views/SessionDetails";
import SetSessionName from "../Views/SetSessionName";
import SetPeriod from "../Views/SetPeriod";

const Stack = createStackNavigator();

function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ title: null, headerLeft: null , headerStyle: { height: 40, elevation: 0, backgroundColor: "#61867e" } }}>
        <Stack.Screen name="Home" component={ Home } />
        <Stack.Screen name="Settings" component={ Settings } />
        <Stack.Screen name="Sessions" component={ Sessions } />
        <Stack.Screen name="SessionDetails" component={ SessionDetails } />
        <Stack.Screen name="SetSessionName" component={ SetSessionName } />
        <Stack.Screen name="SetPeriod" component={ SetPeriod } />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default Navigator;