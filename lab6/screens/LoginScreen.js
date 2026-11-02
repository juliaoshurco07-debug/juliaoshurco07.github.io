import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = username.trim() !== '' && password !== '' && !loading;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onLogin(username.trim(), password); // dacă reușește, App schimbă ecranul
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    // la succes nu mai apelăm setLoading: LoginScreen dispare din arbore
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intră în cont</Text>

      <TextInput
        style={styles.input}
        placeholder="Utilizator"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Parolă"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Intră în cont</Text>
        )}
      </Pressable>

      <Text style={styles.hint}>Cont de test: emilys / emilyspass</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  error: { color: '#c62828', marginBottom: 12, textAlign: 'center' },
  button: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonDisabled: { backgroundColor: '#9bbbe0' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hint: { marginTop: 16, textAlign: 'center', color: '#777' },
});