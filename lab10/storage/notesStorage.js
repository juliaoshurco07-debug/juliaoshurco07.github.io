import AsyncStorage from '@react-native-async-storage/async-storage';

const keyFor = (userId) => `notes:${userId}`;

export async function loadNotes(userId) {
  try {
    const json = await AsyncStorage.getItem(keyFor(userId));
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveNotes(userId, notes) {
  try {
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(notes));
  } catch (error) {
    console.error('Erore la salvarea notițelor:', error);
  }
}