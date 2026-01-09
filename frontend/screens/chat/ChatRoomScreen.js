import React, { useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatRoomScreen = ({ route, navigation }) => {
  const { chatTitle } = route.params;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hey, did you see the new post?', user: 'other' },
    { id: '2', text: 'I did! It looks great.', user: 'me' },
  ]);

  // Add "Add User" button to the Chat Header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: chatTitle,
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => Alert.alert("Add to Chat", "Search for users to add to this conversation...")}
          style={{ marginRight: 10 }}
        >
          <Ionicons name="person-add-outline" size={22} color="#4f46e5" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, chatTitle]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([{ id: Date.now().toString(), text: inputText, user: 'me' }, ...messages]);
    setInputText('');
  };

  const renderItem = ({ item }) => {
    const isMe = item.user === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.myRow : styles.theirRow]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.listContent}
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  flex: { flex: 1 },
  listContent: { padding: 20 },
  messageRow: { marginBottom: 12, flexDirection: 'row' },
  myRow: { justifyContent: 'flex-end' },
  theirRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 18 },
  myBubble: { backgroundColor: '#4f46e5', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
  myText: { color: '#fff' },
  theirText: { color: '#1e293b' },
  messageText: { fontSize: 15, lineHeight: 20 },
  inputBar: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 16, height: 40, color: '#1e293b', marginRight: 10 },
  sendBtn: { backgroundColor: '#4f46e5', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#cbd5e1' },
});

export default ChatRoomScreen;