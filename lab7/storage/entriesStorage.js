import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'journal:entries';

export async function loadEntries() {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Erore la salvarea în AsyncStorage:', error);
  }
}