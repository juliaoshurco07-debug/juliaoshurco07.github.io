import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, FlatList } from 'react-native';
import { useNotes, useNotesActions } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';

export default function NotesScreen() {
  const [text, setText] = useState('');
  const { notes, loaded } = useNotes();
  const { addNote, deleteNote } = useNotesActions();
  const { colors } = useTheme();

  const handleAdd = () => {
    if (!text.trim()) return;
    addNote(text.trim());
    setText('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Notiță nouă..."
          placeholderTextColor={colors.subtext}
          value={text}
          onChangeText={setText}
        />
        <Pressable style={[styles.btnAdd, { backgroundColor: colors.primary }]} onPress={handleAdd}>
          <Text style={styles.btnAddText}>Adaugă</Text>
        </Pressable>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.noteText, { color: colors.text }]}>{item.text}</Text>
            <Pressable onPress={() => deleteNote(item.id)}>
              <Text style={styles.deleteText}>Șterge</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          loaded ? <Text style={[styles.empty, { color: colors.subtext }]}>Nicio notiță încă.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16 },
  btnAdd: { justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8 },
  btnAddText: { color: '#fff', fontWeight: 'bold' },
  noteCard: { padding: 14, borderRadius: 8, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  noteText: { fontSize: 16, flex: 1 },
  deleteText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 10 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});