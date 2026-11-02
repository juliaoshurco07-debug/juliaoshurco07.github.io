import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function NotesScreen({ notes, loaded, onAdd, onDelete }) {
  const [text, setText] = useState('');

  // Cât timp notițele nu au fost citite, lista goală nu înseamnă "nicio notiță"
  if (!loaded) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Se încarcă notițele...</Text>
      </View>
    );
  }

  const handleAdd = () => {
    if (text.trim() === '') return; // notiță goală sau doar spații: nu adăugăm
    onAdd(text.trim());
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Scrie o notiță..."
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addText}>Adaugă</Text>
        </Pressable>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.muted}>Nu ai nicio notiță.</Text>}
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteText}>{item.text}</Text>
            <Pressable onPress={() => onDelete(item.id)}>
              <Text style={styles.delete}>Șterge</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { color: '#777', textAlign: 'center', marginTop: 16 },
  row: { flexDirection: 'row', marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addText: { color: '#fff', fontWeight: '600' },
  note: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteText: { flex: 1, fontSize: 16, marginRight: 12 },
  delete: { color: '#c62828', fontWeight: '600' },
});