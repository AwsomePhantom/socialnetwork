import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../auth/AuthContext';

const menuItems = [
  { id: '1', title: 'Profile Settings', screen: 'Profile', icon: '👤' },
  { id: '2', title: 'Account and Security', screen: 'Account', icon: '🔒' },
  { id: '3', title: 'Privacy Settings', screen: 'Privacy', icon: '👀' },
  { id: '4', title: 'Notifications', screen: 'NotificationsSettings', icon: '🔔' },
  { id: '5', title: 'Help & Support', screen: 'Help', icon: '❓' },
];

const SettingsListScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handlePress = (item) => {
    if (item.screen) {
      // Navigate to the specific screen within the Settings Stack
      navigation.navigate(item.screen);
    } else {
      // Example for a direct action (like log out)
      Alert.alert('Action', `Action for ${item.title}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={styles.menuItem}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      ))}

      {/* Logout button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  icon: {
    fontSize: 20,
    marginRight: 15,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsListScreen;