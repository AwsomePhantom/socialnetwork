import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, SafeAreaView, RefreshControl, Alert
} from 'react-native';
import { usePosts } from '../../contexts/PostsContext';
import { useAuth } from '../../contexts/AuthContext'; 

const NewsFeedScreen = ({ navigation }) => {
  const { posts, loading, fetchPosts, toggleLike, deletePost } = usePosts();
  const { user } = useAuth(); // Get current logged-in user

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeletePress = (postId) => {
    /*
    console.log("HandleDeletePress called for postId:", postId);
    console.log(typeof deletePost);
    Alert.alert(
      "Delete Post",
      "Are you sure you want to remove this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deletePost(postId);
            if (success) {
              Alert.alert("Success", "Post deleted successfully");
            } else {
              Alert.alert("Error", "Failed to delete post");
            }
          }
        }
      ]
    );*/
    deletePost(postId).then(success => {
      if (success) {
        Alert.alert("Success", "Post deleted successfully");
      } else {
        Alert.alert("Error", "Failed to delete post");
      }
    });
}

  const renderPost = ({ item }) => {
    // IMPORTANT: Check for user_id (underscore) from your SQL Alias
    const isMyPost = Number(item.user_id) === Number(user?.id);
    const isLiked = item.isLiked === 1 || item.isLiked === true;

    return (
      <View style={styles.postCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={styles.userName}>{item.user}</Text>
              <Text style={styles.timeText}>{new Date(item.time).toLocaleString()}</Text>
            </View>
          </View>

          {isMyPost && (
            <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.divider} />

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(item.id)}
          >
            <Text style={[styles.likeIcon, isLiked && styles.likedText]}>
    {isLiked ? '❤️' : '🤍'} 
    <Text style={styles.actionText}> {item.likes} Likes</Text>
  </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
          >
            <Text style={styles.detailLinkText}>💬 View Discussion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Fetching latest posts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.listPadding}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchPosts} color="#4f46e5" />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listPadding: { padding: 16, paddingBottom: 100 },
  loadingText: { marginTop: 10, color: '#64748b' },

  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Push delete button to the right
    marginBottom: 12
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e2e8f0', marginRight: 12
  },
  userName: { fontWeight: '700', fontSize: 16, color: '#1e293b' },
  timeText: { fontSize: 12, color: '#94a3b8' },
  deleteButton: { padding: 5 },
  deleteIcon: { fontSize: 18 },

  postContent: { fontSize: 15, color: '#334155', lineHeight: 22 },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  likeIcon: { fontSize: 16 },
  likedText: { color: '#ef4444' },
  detailLinkText: { color: '#4f46e5', fontWeight: '600', fontSize: 14 },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4f46e5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: { color: '#fff', fontSize: 32, marginBottom: 4 }
});

export default NewsFeedScreen;