/* eslint-disable no-undef */
// Firebase service worker for background push notifications.
// Service workers cannot read Vite env — replace REPLACE_WITH_* with your
// Web app config from Firebase Console (same values as VITE_FIREBASE_*).
importScripts(
  'https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: "AIzaSyDrhXm2OLudfcN_nQBqT8UPYyEMQ7y4DgQ",
  authDomain: "tohdah-a5c81.firebaseapp.com",
  projectId: "tohdah-a5c81",
  storageBucket: "tohdah-a5c81.firebasestorage.app",
  messagingSenderId: "925321583697",
  appId: "1:925321583697:web:8b8c462dfbe89511016c70"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'Tohdah';
  const body = payload.notification?.body ?? '';

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: payload.data,
  });
});
