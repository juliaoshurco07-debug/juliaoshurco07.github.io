import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation, user, noteCount, onLogout }) {
  return (
    <View style={styles.container}>
      {user.image ? (
        <Image source={{ uri: user.image }} style={styles.avatar} />
      ) : null}

      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>
      <Text style={styles.email}>{user.email}</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Notes')}>
        <Text style={styles.buttonText}>Notițe ({noteCount})</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.logout]} onPress={onLogout}>
        <Text style={styles.buttonText}>Ieșire din cont</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#555', marginBottom: 32 },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  logout: { backgroundColor: '#c62828' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});