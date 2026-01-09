import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

const UserProfileScreen = ({ route }) => {
  const { username } = route.params || { username: 'Alex Johnson' };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.header}>
    <View style={styles.avatarLarge} />
    <Text style={styles.username}>{username}</Text>
    <Text style={styles.bio}>Product Designer & Coffee Enthusiast. Building the future of mobile interfaces.</Text>

    <TouchableOpacity style={styles.editButton}>
    <Text style={styles.editButtonText}>Edit Profile</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.statsRow}>
    <View style={styles.statBox}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>Posts</Text></View>
    <View style={[styles.statBox, styles.statBorder]}><Text style={styles.statNum}>550</Text><Text style={styles.statLabel}>Followers</Text></View>
    <View style={styles.statBox}><Text style={styles.statNum}>120</Text><Text style={styles.statLabel}>Following</Text></View>
    </View>

    <Text style={styles.sectionTitle}>Recent Activity</Text>
    <View style={styles.activityCard}>
    <Text style={styles.emptyText}>No recent posts to show.</Text>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', padding: 32, backgroundColor: '#fff', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f1f5f9', marginBottom: 16 },
  username: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  bio: { fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20, marginBottom: 20 },
  editButton: { backgroundColor: '#f1f5f9', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12 },
  editButtonText: { color: '#475569', fontWeight: '700', fontSize: 14 },
  statsRow: { flexDirection: 'row', marginTop: 24, paddingVertical: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#e2e8f0' },
  statNum: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', margin: 24 },
  activityCard: { marginHorizontal: 24, padding: 40, backgroundColor: '#fff', borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  emptyText: { color: '#94a3b8' }
});

export default UserProfileScreen;
