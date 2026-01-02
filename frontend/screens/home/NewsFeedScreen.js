import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';

// Dummy data structure for home news feed, fetch using fetchAPI
const SAMPLE_POSTS = [
  { id: 0, user: 'Bob', content: 'Happy new year!', likes: 15 },
  { id: 1, user: 'Ted', content: 'Just finished a tv show marathon.', likes: 42 },
];

const NewsFeedScreen = ({ navigation }) => {
  // Function to render a single post item
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postUser}>{item.user}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postFooter}>
        <Text>{item.likes} Likes</Text>
        {item.likes <= 1 && <Text>Published now</Text>}
        {item.likes > 1 && item.likes < 60 && <Text>Published {item.likes} minutes ago</Text>}
        <Button 
          title="View Details" 
          onPress={() => navigation.navigate('PostDetail', { postId: item.id })} 
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SAMPLE_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContent}
      />
      <Button 
        title="➕ New Post" 
        onPress={() => navigation.navigate('CreatePost')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  postContainer: {
    padding: 15,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default NewsFeedScreen;