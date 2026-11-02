import { Platform } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system/next';

const isWeb = Platform.OS === 'web';

// Folderul permanent al aplicației (nu este șters de sistem)
function photosDirectory() {
  const dir = new Directory(Paths.document, 'photos');
  dir.create({ idempotent: true, intermediates: true });
  return dir;
}

function extensionOf(uri) {
  const match = /\.([a-zA-Z0-9]+)(?:\?.*)?$/.exec(uri);
  return match ? match[1] : 'jpg';
}

// Copiază fotografia din temporar în folderul permanent și returnează doar numele fișierului
export function persistPhoto(tempUri) {
  if (isWeb) return tempUri;
  const fileName = `${Date.now()}.${extensionOf(tempUri)}`;
  const destFile = new File(photosDirectory(), fileName);
  new File(tempUri).copy(destFile);
  return fileName;
}

// Reconstruiește URI-ul de afișare din numele salvat
export function resolvePhotoUri(stored) {
  if (isWeb) return stored;
  return new File(photosDirectory(), stored).uri;
}

// Șterge fișierul fizic din stocare
export function removePhoto(stored) {
  if (isWeb) return;
  try {
    const file = new File(photosDirectory(), stored);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // Fișierul nu există sau a fost deja șters
  }
}