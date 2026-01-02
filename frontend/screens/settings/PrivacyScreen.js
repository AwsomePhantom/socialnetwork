import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';

// Component for a single setting toggle
const SettingToggle = ({ title, description, initialValue }) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.settingRow}>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#2196F3" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};


const PrivacyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Visibility Controls</Text>
      
      <SettingToggle 
        title="Who Can See My Profile?"
        description="Control access to your full profile details (e.g., Public, Friends Only)."
        initialValue={true}
      />
      
      <SettingToggle 
        title="Show Online Status"
        description="Allow friends to see when you are currently active or online."
        initialValue={false}
      />
      
      <SettingToggle 
        title="Allow Message Requests"
        description="Filter who can send you the first message request."
        initialValue={true}
      />
      
      <Text style={styles.header}>Data Permissions</Text>

      <SettingToggle 
        title="Location Services"
        description="Share your approximate location with posts and events."
        initialValue={false}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#777',
  },
});

export default PrivacyScreen;