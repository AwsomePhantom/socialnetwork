import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, SafeAreaView } from 'react-native';

const PrivacyScreen = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.flex}>
    <Text style={styles.sectionTitle}>Account Visibility</Text>
    <View style={styles.card}>
    <View style={styles.row}>
    <View style={styles.textContainer}>
    <Text style={styles.settingTitle}>Public Profile</Text>
    <Text style={styles.description}>Allow anyone to see your posts and activity.</Text>
    </View>
    <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ true: '#4f46e5' }} />
    </View>

    <View style={[styles.row, styles.noBorder]}>
    <View style={styles.textContainer}>
    <Text style={styles.settingTitle}>Online Status</Text>
    <Text style={styles.description}>Show when you are active to your friends.</Text>
    </View>
    <Switch value={showStatus} onValueChange={setShowStatus} trackColor={{ true: '#4f46e5' }} />
    </View>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  flex: { flex: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', margin: 20, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  noBorder: { borderBottomWidth: 0 },
  textContainer: { flex: 1, paddingRight: 16 },
  settingTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  description: { fontSize: 13, color: '#94a3b8', lineHeight: 18 }
});

export default PrivacyScreen;
