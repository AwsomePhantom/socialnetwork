import React, { useState, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

const SAMPLE_MESSAGES = [
  { id: 'm1', text: 'Hey, did you see the new post?', user: 'other' },
  { id: 'm2', text: 'I did! It looks great.', user: 'me' },
  { id: 'm3', text: 'When should we schedule our meeting?', user: 'other' },
];

const MessageBubble = ({ message }) => {
  const isMyMessage = message.user === 'me';
  
  return (
    <View style={[styles.messageContainer, isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer]}>
      <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.theirBubble]}>
        {!isMyMessage && <Text style={styles.senderName}>Sender Name</Text>} 
        <Text style={styles.messageText}>{message.text}</Text>
      </View>
    </View>
  );
};

const ChatRoomScreen = ({ route, navigation }) => {
  const { chatId, chatTitle, isGroup } = route.params; 
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Dynamic header
  useLayoutEffect(() => {
    navigation.setOptions({
      title: chatTitle, // Sets the header title dynamically
    });
  }, [navigation, chatTitle]);
  // -----------------------------

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      user: 'me',
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    // Call post method to store the message in the database
  };
  
  const renderItem = ({ item }) => <MessageBubble message={item} />;

  return (
    // KeyboardAvoidingView is essential for shifting the input when the keyboard appears
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust this value based on header height
    >
      {/* Message List */}
      <FlatList
        data={messages.slice().reverse()} // Reverse the array to show newest messages at the bottom
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted // Invert the FlatList to display from bottom up
        style={styles.messagesList}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline={false} 
        />
        <TouchableOpacity 
          style={[styles.sendButton, { opacity: inputText.trim().length > 0 ? 1 : 0.5 }]}
          onPress={handleSend}
          disabled={inputText.trim().length === 0}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  messagesList: {
    paddingHorizontal: 10,
  },
  
  // Message Bubble Styles
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 10,
    borderRadius: 15,
  },
  myBubble: {
    backgroundColor: '#007AFF', // Blue for messages
    borderTopRightRadius: 2, // Slight styling to make it look like a bubble tail
  },
  theirBubble: {
    backgroundColor: '#ffffff', // White/light gray for others' messages
    borderTopLeftRadius: 2,
  },
  messageText: {
    color: 'black',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#007AFF',
  },
  
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChatRoomScreen;