// =======================================
// services/NotificationService.ts
// Day 101 — Push & local notifications
// Expo push token registration + daily
// meditation reminders via expo-notifications
// =======================================

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { app, db } from '@/lib/firebase';

/* ---------------------------------------
   SECTION A — Foreground notification behavior
---------------------------------------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* ──────────────────────────────────────
   registerForPushNotifications
   Requests permission, fetches the Expo
   push token, and saves it to
   users/{uid}.pushToken in Firestore.
────────────────────────────────────────*/
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[NotificationService] Permission not granted for push notifications');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );

    const uid = getAuth(app).currentUser?.uid;
    if (uid) {
      await setDoc(doc(db, 'users', uid), { pushToken: token }, { merge: true });
    }

    return token;
  } catch (error) {
    console.warn('[NotificationService] registerForPushNotifications failed:', error);
    return null;
  }
}

/* ──────────────────────────────────────
   scheduleMeditationReminder
   Schedules a daily local notification
   at the given hour/minute (24h clock).
────────────────────────────────────────*/
export async function scheduleMeditationReminder(hour: number, minute: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to Heal 🌟',
      body: 'Your daily healing session is ready',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
    },
  });
}

/* ──────────────────────────────────────
   cancelAllNotifications
   Cancels every scheduled local notification.
────────────────────────────────────────*/
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/* ──────────────────────────────────────
   sendLocalNotification
   Fires an immediate local notification.
────────────────────────────────────────*/
export async function sendLocalNotification(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null,
  });
}
