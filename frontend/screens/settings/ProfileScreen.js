import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';

const ProfileScreen = () => {
  const [name, setName] = useState('Alex Johnson');
  const [bio, setBio] = useState('Product Designer & Developer');

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.avatarSection}>
    <View style={styles.avatarLarge} />
    <TouchableOpacity>
    <Text style={styles.changePhotoText}>Change Profile Photo</Text>
    </TouchableOpacity>
    </View>

    <View style={styles.inputGroup}>
    <Text style={styles.label}>Full Name</Text>
    <TextInput style={styles.input} value={name} onChangeText={setName} />
    </View>

    <View style={styles.inputGroup}>
    <Text style={styles.label}>Bio</Text>
    <TextInput
    style={[styles.input, styles.textArea]}
    value={bio}
    onChangeText={setBio}
    multiline
    />
    </View>

    <TouchableOpacity style={styles.saveButton}>
    <Text style={styles.saveButtonText}>Save Changes</Text>
    </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f1f5f9', marginBottom: 12 },
  changePhotoText: { color: '#4f46e5', fontWeight: '700', fontSize: 14 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 14, fontSize: 16, color: '#1e293b' },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});

export default ProfileScreen;
