import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../contexts/PostsContext';

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const { user } = useAuth();
  const { fetchPostById, deletePost, addComment, deleteComment, fetchCommentsByPost } = usePosts(); 

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isMyPost = Number(post?.user_id) === Number(user?.id);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [postData, commentData] = await Promise.all([
        fetchPostById(postId),
        fetchCommentsByPost(postId)
      ]);

      setPost(postData);
      setComments(commentData || []);
      setLoading(false);
    };
    loadData();
  }, [postId]);

const handleAddComment = async () => {
  if (!commentText.trim()) return;
  setIsSubmitting(true);

  const newComment = await addComment(postId, user.id, commentText);
  
  if (newComment) {
    const commentWithAuthor = { 
      ...newComment, 
      userName: user.name,
      user_id: user.id,
      content: commentText, 
      created: new Date().toISOString()
    };
    
    setComments(prev => [commentWithAuthor, ...prev]);
    setCommentText('');
  }
  setIsSubmitting(false);
};

  const handleDeleteComment = async (commentId) => {
    const originalComments = [...comments];
    setComments(prev => prev.filter(c => c.id !== commentId));

    const success = await deleteComment(commentId, user.id);
    if (!success) {
      setComments(originalComments);
    }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#4f46e5" /></View>;
  if (!post) return <View style={styles.centered}><Text>Post not found.</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.scrollContainer}>
          {/* Post Header */}
          <View style={styles.postSection}>
            <View style={styles.headerRow}>
              <View style={styles.userInfo}>
                <View style={styles.avatarSmall} />
                <View>
                  <Text style={styles.userName}>{post.user}</Text>
                  <Text style={styles.time}>{new Date(post.time).toLocaleString()}</Text>
                </View>
              </View>
              {isMyPost && (
                <TouchableOpacity onPress={() => deletePost(postId).then(() => navigation.goBack())}>
                  <Text style={styles.deleteLink}>Delete Post</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.postText}>{post.content}</Text>
          </View>

          <View style={styles.divider} />

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
            
            {comments.length > 0 ? (
              comments.map((item) => (
                <View key={item.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View>
                      {/* FIX: Access the name from TypeORM joined user object OR userName from context mapping */}
                      <Text style={styles.commentUser}>
                        {item.userName || item.user?.name || 'Anonymous'}
                      </Text>
                      {/* NEW: Displaying the publishing date and time */}
                      <Text style={styles.commentTime}>
                        {new Date(item.created || item.time).toLocaleString([], { 
                          dateStyle: 'short', 
                          timeStyle: 'short' 
                        })}
                      </Text>
                    </View>
                    
                    {Number(item.user_id) === Number(user?.id) && (
                      <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                        <Text style={styles.commentDeleteText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.commentText}>{item.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noComments}>No comments yet. Be the first!</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={isSubmitting || !commentText.trim()}
            style={[styles.sendButton, (!commentText.trim() || isSubmitting) && styles.disabledButton]}
          >
            {isSubmitting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.sendButtonText}>Post</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { flex: 1 },
  postSection: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', marginRight: 12 },
  userName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  time: { fontSize: 13, color: '#94a3b8' },
  deleteLink: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  postText: { fontSize: 17, color: '#334155', lineHeight: 24 },
  divider: { height: 8, backgroundColor: '#f8fafc' },
  commentSection: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 15 },
  commentCard: { marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  commentUser: { fontWeight: '700', fontSize: 14, color: '#1e293b' },
  commentTime: { fontSize: 11, color: '#94a3b8', marginTop: 2 }, // Styling for the date
  commentDeleteText: { fontSize: 12, color: '#94a3b8' },
  commentText: { fontSize: 14, color: '#475569', marginTop: 4 },
  noComments: { color: '#94a3b8', textAlign: 'center', marginTop: 20 },
  inputBar: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10, maxHeight: 100, fontSize: 15 },
  sendButton: { backgroundColor: '#4f46e5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8 },
  disabledButton: { backgroundColor: '#94a3b8' },
  sendButtonText: { color: '#fff', fontWeight: '700' }
});

export default PostDetailScreen;