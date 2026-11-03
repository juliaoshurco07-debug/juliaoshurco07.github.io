import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app_theme_mode';

export async function loadTheme() {
  const saved = await AsyncStorage.getItem(THEME_KEY);
  return saved === 'dark' || saved === 'light' ? saved : 'light';
}

export async function saveTheme(mode) {
  await AsyncStorage.setItem(THEME_KEY, mode);
}