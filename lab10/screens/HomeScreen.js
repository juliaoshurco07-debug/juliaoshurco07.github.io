import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const { notes } = useNotes();
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {user?.image && <Image source={{ uri: user.image }} style={styles.avatar} />}
        <Text style={[styles.name, { color: colors.text }]}>{user?.firstName} {user?.lastName}</Text>
        <Text style={[styles.email, { color: colors.subtext }]}>@{user?.username}</Text>
        <Text style={[styles.info, { color: colors.text }]}>Notițe salvate: {notes.length}</Text>
      </View>

      <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('Notes')}>
        <Text style={styles.btnText}>Gestionează Notițele</Text>
      </Pressable>

      <Pressable style={[styles.btnOutline, { borderColor: colors.border }]} onPress={toggleTheme}>
        <Text style={[styles.btnOutlineText, { color: colors.text }]}>
          Schimbă tema ({mode === 'light' ? '🌙 Dark' : '☀️ Light'})
        </Text>
      </Pressable>

      <Pressable style={styles.btnLogout} onPress={signOut}>
        <Text style={styles.btnLogoutText}>Deconectare</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { padding: 20, borderRadius: 12, borderWidth: 1, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, marginBottom: 10 },
  info: { fontSize: 16, fontWeight: '600' },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnOutline: { borderWidth: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  btnOutlineText: { fontWeight: 'bold', fontSize: 16 },
  btnLogout: { padding: 12, alignItems: 'center' },
  btnLogoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
});