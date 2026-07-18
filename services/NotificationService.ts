// =======================================
// services/NotificationService.ts
// Day 101 — Push & local notifications
// Expo push token registration + daily
// meditation reminders via expo-notifications
// =======================================

// Temporarily disabled: expo-notifications crashes in Expo Go on Android.
// Re-enable this import (and remove the stubs below) before an EAS native build.
// import * as Notifications from 'expo-notifications';

import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { app, db } from '@/lib/firebase';

/* ──────────────────────────────────────
   registerForPushNotifications
   Requests permission, fetches the Expo
   push token, and saves it to
   users/{uid}.pushToken in Firestore.
────────────────────────────────────────*/
export async function registerForPushNotifications(): Promise<string | null> {
  return null;
}

/* ──────────────────────────────────────
   scheduleMeditationReminder
   Schedules a daily local notification
   at the given hour/minute (24h clock).
────────────────────────────────────────*/
export async function scheduleMeditationReminder(hour: number, minute: number): Promise<void> {
  return;
}

/* ──────────────────────────────────────
   cancelAllNotifications
   Cancels every scheduled local notification.
────────────────────────────────────────*/
export async function cancelAllNotifications(): Promise<void> {
  return;
}

/* ──────────────────────────────────────
   sendLocalNotification
   Fires an immediate local notification.
────────────────────────────────────────*/
export async function sendLocalNotification(title: string, body: string): Promise<void> {
  return;
}
