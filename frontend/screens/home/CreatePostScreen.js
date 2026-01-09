import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostsContext';

const CreatePostScreen = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth(); // Get the logged-in user's ID
  const { createPost } = usePosts(); // Get the creation function

  const handleCreatePost = async () => {
    if (!postText.trim() || !user) return;

    setIsSubmitting(true);
    const success = await createPost(user.id, postText);
    setIsSubmitting(false);

    if (success) {
      navigation.goBack(); // Return to the feed
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.postButton, (postText.length === 0 || isSubmitting) && styles.disabledButton]}
          onPress={handleCreatePost}
          disabled={postText.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="What's happening?"
          placeholderTextColor="#94a3b8"
          multiline
          autoFocus
          value={postText}
          onChangeText={setPostText}
          maxLength={500}
        />
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Text style={styles.charCount}>{500 - postText.length} characters remaining</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cancelText: { color: '#64748b', fontSize: 16, fontWeight: '500' },
  postButton: { backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  disabledButton: { backgroundColor: '#e2e8f0' },
  postButtonText: { color: '#fff', fontWeight: '700' },
  inputWrapper: { flex: 1, padding: 20 },
  textInput: { fontSize: 18, color: '#1e293b', textAlignVertical: 'top', height: '100%' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  charCount: { color: '#94a3b8', textAlign: 'right', fontSize: 12 }
});

export default CreatePostScreen;
