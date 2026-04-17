import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const setupNotifications = async () => {
  if (!Device.isDevice) {
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

export const scheduleReminder = async (predictionDate: Date) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger = new Date(predictionDate);
  // Remind 1 day before at 9 AM
  trigger.setDate(trigger.getDate() - 1);
  trigger.setHours(9, 0, 0, 0);

  if (trigger < new Date()) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Cycle Tracker Reminder",
      body: "Your next period is expected tomorrow.",
      data: { data: 'reminder' },
    },
    trigger,
  });
};
