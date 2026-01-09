import React, { useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SAMPLE_USERS = [
  { id: 'u1', name: 'Alice Freeman' },
  { id: 'u2', name: 'Charlie Day' },
  { id: 'u3', name: 'Diana Prince' },
];

const ConversationListScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // Add "+" button to top right of header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 15 }}>
          <Ionicons name="add-circle-outline" size={28} color="#4f46e5" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const startNewChat = (user) => {
    setModalVisible(false);
    navigation.navigate('ChatRoom', { 
      chatId: Date.now().toString(), 
      chatTitle: user.name 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ... (Your existing FlatList for chats goes here) ... */}

      {/* New Chat Selection Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={SAMPLE_USERS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.userRow} onPress={() => startNewChat(item)}>
                  <View style={styles.userAvatar} />
                  <Text style={styles.userName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '70%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  closeText: { color: '#4f46e5', fontWeight: '600' },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', marginRight: 12 },
  userName: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
});

export default ConversationListScreen;