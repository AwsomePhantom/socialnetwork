import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { useAuth } from '../../auth/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user.name + ' ' + user.lastname);
  const [username, setUsername] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  
  // Placeholder for profile picture (replace with image component logic)
  const profilePicture = null; 

  const handleSave = () => {
    // Username validation logic
    if (name.trim() === '' || username.trim() === '') {
      Alert.alert('Error', 'Name and Username cannot be empty.');
      return;
    }
    
    // API call to modify changes in the server
    console.log('Saving profile updates:', { name, username, bio, location });

    Alert.alert('Success', 'Your profile has been updated!');
    // Optionally navigate back after successful save: navigation.goBack();
  };

  const handlePictureChange = () => {
    // Logic to open camera roll or camera
    Alert.alert('Action', 'Open photo library/camera to change profile picture.');
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* Profile Picture Section */}
      <View style={styles.imageContainer}>
        <View style={styles.avatarPlaceholder}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>JD</Text>
          )}
        </View>
        <TouchableOpacity onPress={handlePictureChange} style={styles.changeButton}>
          <Text style={styles.changeButtonText}>Change Profile Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <Text style={styles.sectionHeader}>Personal Information</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Choose a unique username"
        autoCapitalize="none"
      />
      
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={bio}
        onChangeText={setBio}
        placeholder="Tell us about yourself"
        multiline
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Where are you located?"
      />

      {/* Save Button */}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeButton: {
    padding: 8,
  },
  changeButtonText: {
    color: '#007AFF', // Standard app accent color
    fontSize: 16,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 10,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#28A745', // Green Save button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;