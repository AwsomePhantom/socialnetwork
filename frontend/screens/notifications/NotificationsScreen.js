import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

const dummyNotifications = [
  { id: 'n1', text: 'Alex liked your recent photo.', time: '5m ago', type: 'like', read: false },
{ id: 'n2', text: 'Sarah commented on your post: "Looks great!"', time: '1h ago', type: 'comment', read: false },
{ id: 'n3', text: 'You have a new friend request from Mark.', time: '1d ago', type: 'request', read: true },
];

const NotificationsScreen = () => {
  const renderNotification = ({ item }) => (
    <TouchableOpacity
    style={[styles.notificationItem, !item.read && styles.unreadItem]}
    activeOpacity={0.7}
    >
    <View style={styles.iconContainer}>
    <View style={[styles.statusIndicator, !item.read && styles.unreadDot]} />
    <View style={styles.avatarPlaceholder} />
    </View>
    <View style={styles.contentContainer}>
    <Text style={[styles.notificationText, !item.read && styles.unreadText]} numberOfLines={2}>
    {item.text}
    </Text>
    <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    <FlatList
    data={dummyNotifications}
    keyExtractor={(item) => item.id}
    renderItem={renderNotification}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  notificationItem: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  unreadItem: { backgroundColor: '#f8faff' },
  iconContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  unreadDot: { backgroundColor: '#4f46e5' },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f1f5f9' },
  contentContainer: { flex: 1 },
  notificationText: { fontSize: 15, color: '#475569', lineHeight: 20 },
  unreadText: { color: '#1e293b', fontWeight: '600' },
  notificationTime: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  separator: { height: 1, backgroundColor: '#f1f5f9' },
});

export default NotificationsScreen;
