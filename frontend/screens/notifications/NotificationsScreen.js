import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const dummyNotifications = [
  { id: 'n1', text: 'Alex liked your recent photo.', time: '5m ago', type: 'like', read: false },
  { id: 'n2', text: 'Sarah commented on your post: "Looks great!"', time: '1h ago', type: 'comment', read: false },
  { id: 'n3', text: 'You have a new friend request from Mark.', time: '1d ago', type: 'request', read: true },
];

const NotificationsScreen = () => {
  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !item.read && styles.unreadItem]} 
      // Add logic here to navigate based on notification type
    >
      {!item.read && <View style={styles.unreadDot} />}
      <Text style={styles.notificationText} numberOfLines={2}>
        {item.text}
      </Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: '#f0f8ff', // Light background for unread
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007aff', // Blue dot indicator
    marginRight: 10,
  },
  notificationText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
    // Ensure the time doesn't wrap oddly
    minWidth: 50, 
    textAlign: 'right',
  },
});

export default NotificationsScreen;