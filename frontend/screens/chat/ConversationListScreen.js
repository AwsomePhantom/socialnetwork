import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const SAMPLE_CHATS = [
  { id: 'c1', title: 'Bob White', lastMessage: 'See you there tomorrow!', time: '10m ago', unreadCount: 2, isGroup: false },
  { id: 'c2', title: 'Ted Ross', lastMessage: 'Did everyone review the deck?', time: '2h ago', unreadCount: 0, isGroup: true },
  { id: 'c3', title: 'Marc Barn', lastMessage: 'Sounds good!', time: '1d ago', unreadCount: 0, isGroup: false },
  { id: 'c4', title: 'Shakil Iqbal', lastMessage: 'Happy Holidays!', time: '3d ago', unreadCount: 5, isGroup: true },
];

const ConversationListScreen = ({ navigation }) => {
  const renderChat = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      // Navigate to the ChatRoom, passing necessary conversation details
      onPress={() => 
        navigation.navigate('ChatRoom', { 
          chatId: item.id, 
          chatTitle: item.title,
          isGroup: item.isGroup
        })
      }
    >
      <View style={styles.avatarPlaceholder} />
      
      <View style={styles.chatContent}>
        <Text style={styles.chatTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      
      <View style={styles.chatInfo}>
        <Text style={styles.chatTime}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chatInfo: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    marginLeft: 80, // Start the separator after the avatar
  },
});

export default ConversationListScreen;