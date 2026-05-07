import { initializeApp, getApps } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

export async function getMessagingInstance(): Promise<Messaging | null> {
  if (messaging) return messaging;
  const supported = await isSupported();
  if (!supported) return null;
  messaging = getMessaging(app);
  return messaging;
}

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    const m = await getMessagingInstance();
    if (!m) return null;

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('VITE_FIREBASE_VAPID_KEY is not set');
      return null;
    }

    const token = await getToken(m, {
      vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      ),
    });

    return token;
  } catch (err) {
    console.error('Failed to get FCM token:', err);
    return null;
  }
}

export async function onForegroundMessage(
  callback: (payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
  }) => void,
): Promise<(() => void) | null> {
  const m = await getMessagingInstance();
  if (!m) return null;

  const unsubscribe = onMessage(m, (payload) => {
    callback({
      title: payload.notification?.title ?? 'Tohdah',
      body: payload.notification?.body ?? '',
      data: payload.data as Record<string, string> | undefined,
    });
  });

  return unsubscribe;
}
