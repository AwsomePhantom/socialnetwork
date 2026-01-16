import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ensure this is installed

import LoginScreen from './screens/login/LoginScreen';
import HomeStack from './screens/home/HomeStack';
import ChatStack from './screens/chat/ChatStack';
import EventsScreen from './screens/events/EventsScreen';
import NotificationsScreen from './screens/notifications/NotificationsScreen';
import SettingsStack from './screens/settings/SettingsStack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostsContext';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function NavigationRoot() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <PostProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {user == null ? (
            <RootStack.Screen name="Login" component={LoginScreen} />
          ) : (
            <RootStack.Screen name="Main" component={AppTabs} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </PostProvider>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4f46e5', // Indigo
        tabBarInactiveTintColor: '#94a3b8', // Slate
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatStack} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Events" 
        component={EventsScreen} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStack} 
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  tabBar: {
    height: 60,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1e293b',
    fontSize: 17,
  },
});

export default function App() {
  return (
    <AuthProvider>
      <NavigationRoot />
    </AuthProvider>
  );
}