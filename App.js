import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CalenderScreen from "./Screens/CalenderScreen";
import EventScreen from "./Screens/EventScreen";
import "react-native-gesture-handler";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import OnboardingScreen from "./Screens/OnboardingScreen";

// import {
//   useFonts,
//   Poppins_500Medium,
//   Poppins_700Bold,
//   Poppins_600SemiBold,
// } from "@expo-google-fonts/poppins";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {

  // let [fontsLoaded] = useFonts({
  //   Poppins_500Medium,
  //   Poppins_700Bold,
  //   Poppins_600SemiBold,

  // });
  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
        keyboardDismissMode="on-drag"
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false,}}>
      <Tab.Screen
        name="Calender"
        component={CalenderScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <AntDesign
              name="calendar"
              size={24}
              color={focused ? "red" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name="calendar-plus-o"
              size={24}
              color={focused ? "red" : "black"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
