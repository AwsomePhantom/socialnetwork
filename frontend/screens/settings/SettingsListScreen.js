import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { id: '1', title: 'Profile Settings', screen: 'Profile', icon: 'person-outline' },
{ id: '2', title: 'Privacy Settings', screen: 'Privacy', icon: 'lock-closed-outline' },
{ id: '3', title: 'Account Security', screen: 'Account', icon: 'shield-checkmark-outline' },
{ id: '4', title: 'Help & Support', screen: 'help-circle-outline' },
];

const SettingsListScreen = ({ navigation }) => {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
    <View style={styles.section}>
    {menuItems.map((item) => (
      <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => item.screen && navigation.navigate(item.screen)}
      >
      <View style={styles.iconBg}>
      <Ionicons name={item.icon} size={20} color="#4f46e5" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
      </TouchableOpacity>
    ))}
    </View>

    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
    <Text style={styles.logoutText}>Sign Out</Text>
    </TouchableOpacity>
    <Text style={styles.versionText}>Version 1.0.2 (2026)</Text>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  section: { backgroundColor: '#fff', marginTop: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  iconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  title: { flex: 1, fontSize: 16, fontWeight: '500', color: '#1e293b' },
  logoutButton: { marginTop: 32, marginHorizontal: 20, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#fee2e2' },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
  versionText: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 }
});

export default SettingsListScreen;
