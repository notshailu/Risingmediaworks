importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyD1YY3o7lBPS8zdIAx4n7G-dcwvHsUu50o",
  authDomain: "risingmedia-b2d53.firebaseapp.com",
  projectId: "risingmedia-b2d53",
  storageBucket: "risingmedia-b2d53.firebasestorage.app",
  messagingSenderId: "1080343107994",
  appId: "1:1080343107994:web:c1f807a866830f8ecc0223",
  measurementId: "G-KE71XPFKSP"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
