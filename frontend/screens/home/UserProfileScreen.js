import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const UserProfileScreen = ({ route }) => {
  // Extracting username from the route parameters (or userId)
  const { username } = route.params || { username: 'Guest User' }; 

  // In a real app, you would fetch profile data using the username/userId
  const profileData = {
    username: username,
    bio: `A passionate developer and social network enthusiast. Follow me for updates!`,
    postsCount: 12,
    followers: 550,
    following: 120,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Picture Placeholder */}
      <View style={styles.avatarPlaceholder} /> 
      
      <Text style={styles.username}>{profileData.username}</Text>
      <Text style={styles.bio}>{profileData.bio}</Text>
      
      <View style={styles.statsContainer}>
        <Text style={styles.statItem}>
          <Text style={styles.statCount}>{profileData.postsCount}</Text> Posts
        </Text>
        <Text style={styles.statItem}>
          <Text style={styles.statCount}>{profileData.followers}</Text> Followers
        </Text>
        <Text style={styles.statItem}>
          <Text style={styles.statCount}>{profileData.following}</Text> Following
        </Text>
      </View>
      
      {/* Section for the user's past posts */}
      <Text style={styles.sectionHeader}>User's Posts</Text>
      {/* A FlatList or Grid of the user's content would go here */}
      <Text style={{ textAlign: 'center', marginTop: 10 }}>[Placeholder for user's post grid]</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 15,
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
  },
  statItem: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  statCount: {
    fontWeight: 'bold',
    fontSize: 18,
    display: 'flex',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default UserProfileScreen;