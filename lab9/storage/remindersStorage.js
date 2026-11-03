import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'reminders:list';

export async function loadReminders() {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveReminders(reminders) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Erore la salvarea în AsyncStorage:', error);
  }
}