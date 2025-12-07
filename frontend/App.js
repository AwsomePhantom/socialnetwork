// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./Screens/HomeScreen";
import SettingsStack from "./Navigation/SettingsStack";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NotificationsScreen from "./Screens/NotificationScree";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {

            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Chats") {
              iconName = "comments";
            } else if(route.name === "Notifications") {
              iconName = "bell";
            } else if (route.name === "Settings") {
              iconName = "cog";
            }

            return <FontAwesome name={iconName} size={22} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chats" component={SettingsStack} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Settings" component={SettingsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
