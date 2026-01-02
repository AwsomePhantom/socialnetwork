import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';

const CreatePostScreen = ({ navigation }) => {
  const [postText, setPostText] = useState('');

  const handlePost = () => {
    if (postText.trim() === '') {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }
    //
    //
    // Logic to submit the post
    //
    //
    console.log('New Post Content:', postText);
    
    // After successful post, close the modal
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        multiline
        value={postText}
        onChangeText={setPostText}
        maxLength={500}
        autoFocus={true}
      />
      <Text style={styles.charCount}>{500 - postText.length} characters left</Text>
      <View style={styles.buttons}> 
        <Button onPress={handlePost} title="Post" disabled={postText.trim() === ''} />
        <Button onPress={() => navigation.goBack()} title="Cancel" />
      </View>
      {/* Option to add photo/video would go here*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  textInput: {
    fontSize: 18,
    padding: 10,
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  charCount: {
    textAlign: 'right',
    color: '#999',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', //fills rows left to right
  }
});

export default CreatePostScreen;