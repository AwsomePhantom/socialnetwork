import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PostDetailScreen = ({ route }) => {
  // Extracting postId from the route parameters
  const { postId } = route.params;

  // Fetch post data using the postId
  const postData = {
    id: postId,
    user: 'User name',
    content: `This is the content for post ID ${postId}. Post ID is sent though route param. It can be much longer and includes a full comment section.`,
    comments: [
      { id: 'c1', user: 'Bob', text: 'Great photo!' },
      { id: 'c2', user: 'Ted', text: 'Where was this?' },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postHeader}>
        <Text style={styles.postUser}>{postData.user}</Text>
      </View>
      <Text style={styles.postContent}>{postData.content}</Text>
      
      <Text style={styles.commentsHeader}>Comments ({postData.comments.length})</Text>
      {postData.comments.map(comment => (
        <View key={comment.id} style={styles.commentItem}>
          <Text style={styles.commentUser}>{comment.user}:</Text>
          <Text style={styles.commentText}>{comment.text}</Text>
        </View>
      ))}
      {/* Input field for adding a new comment would go here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  postHeader: {
    marginBottom: 10,
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    borderTopWidth: 1,
    paddingTop: 10,
    borderTopColor: '#eee',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentUser: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  commentText: {
    flexShrink: 1,
  },
});

export default PostDetailScreen;