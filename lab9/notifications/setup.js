import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const CHANNEL_ID = 'reminders-channel';

// 1. Handler-ul pentru prim-plan (cum se comportă notificarea când aplicația este deschisă)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const isAllowed = (settings) =>
  settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

// 2. Canalul se creează ÎNAINTE de cererea permisiunii (esențial pentru Android 13+)
export async function ensureNotificationPermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Remindere',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  let settings = await Notifications.getPermissionsAsync();
  if (!isAllowed(settings)) {
    settings = await Notifications.requestPermissionsAsync();
  }
  return isAllowed(settings);
}