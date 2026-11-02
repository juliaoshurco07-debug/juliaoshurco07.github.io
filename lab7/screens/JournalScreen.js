import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  FlatList,
  Modal,
  Alert,
  Platform,
  useWindowDimensions,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { persistPhoto, resolvePhotoUri, removePhoto } from '../storage/photoStore';
import { loadEntries, saveEntries } from '../storage/entriesStorage';

const COLUMNS = 3;
const GAP = 8;

export default function JournalScreen() {
  const { width } = useWindowDimensions();
  const tileSize = (width - 32 - GAP * (COLUMNS - 1)) / COLUMNS;

  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [caption, setCaption] = useState('');
  const [selected, setSelected] = useState(null);

  // Citire la pornire
  useEffect(() => {
    loadEntries().then((list) => {
      setEntries(list);
      setLoaded(true);
    });
  }, []);

  // Salvare la fiecare modificare (doar după ce s-a citit starea inițială)
  useEffect(() => {
    if (loaded) {
      saveEntries(entries);
    }
  }, [entries, loaded]);

  const addEntry = (result) => {
    if (result.canceled) return;
    let file;
    try {
      file = persistPhoto(result.assets[0].uri);
    } catch (err) {
      Alert.alert('Nu am putut salva fotografia', err.message);
      return;
    }

    setEntries((prev) => [
      {
        id: String(Date.now()),
        file,
        caption: caption.trim() || 'Fără legendă',
        createdAt: new Date().toLocaleString('ro-RO'),
      },
      ...prev,
    ]);
    setCaption('');
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    addEntry(result);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permisiune necesară',
        'Aplicația are nevoie de cameră pentru a face fotografii.',
        permission.canAskAgain
          ? [{ text: 'Am înțeles' }]
          : [
              { text: 'Anulează', style: 'cancel' },
              { text: 'Deschide setările', onPress: () => Linking.openSettings() },
            ]
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    addEntry(result);
  };

  const confirmDelete = (entry) => {
    const remove = () => {
      removePhoto(entry.file);
      setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    };
    if (Platform.OS === 'web') {
      remove();
      return;
    }
    Alert.alert('Ștergi fotografia?', entry.caption, [
      { text: 'Nu', style: 'cancel' },
      { text: 'Da', style: 'destructive', onPress: remove },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Jurnal Foto</Text>

      <TextInput
        style={styles.input}
        placeholder="Legendă opțională..."
        placeholderTextColor="#888"
        value={caption}
        onChangeText={setCaption}
      />

      <View style={styles.row}>
        <Pressable style={styles.button} onPress={pickFromLibrary}>
          <Text style={styles.buttonText}>📁 Galerie</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.btnCamera]} onPress={takePhoto}>
          <Text style={styles.buttonText}>📷 Cameră</Text>
        </Pressable>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, marginTop: 16 }}
        ListEmptyComponent={
          <Text style={styles.muted}>Nicio fotografie încă. Adaugă prima!</Text>
        }
        renderItem={({ item }) => {
          const uri = resolvePhotoUri(item.file);
          return (
            <Pressable
              onPress={() => setSelected({ ...item, uri })}
              onLongPress={() => confirmDelete(item)}
            >
              <Image source={{ uri }} style={{ width: tileSize, height: tileSize, borderRadius: 6 }} />
            </Pressable>
          );
        }}
      />

      {/* Modal vizualizare mărită */}
      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          {selected && (
            <View style={styles.modalContent} pointerEvents="box-none">
              <Image source={{ uri: selected.uri }} style={styles.modalImage} resizeMode="contain" />
              <Text style={styles.modalCaption}>{selected.caption}</Text>
              <Text style={styles.modalDate}>{selected.createdAt}</Text>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
  row: { flexDirection: 'row', gap: 10 },
  button: { flex: 1, backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnCamera: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  muted: { textAlign: 'center', color: '#888', marginTop: 40 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { alignItems: 'center', width: '100%' },
  modalImage: { width: '100%', height: 350, marginBottom: 15 },
  modalCaption: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  modalDate: { color: '#aaa', fontSize: 14, textAlign: 'center' },
});