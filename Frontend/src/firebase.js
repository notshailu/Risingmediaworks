import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, isSupported as isMessagingSupported, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD1YY3o7lBPS8zdIAx4n7G-dcwvHsUu50o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "risingmedia-b2d53.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "risingmedia-b2d53",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "risingmedia-b2d53.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1080343107994",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1080343107994:web:c1f807a866830f8ecc0223",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KE71XPFKSP"
};

export const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || "BNO2C5fmX2CBvxkIVUKD3uNzgxsLe2XwH9VrTtFpgmyHahKCwD0SEKFcgLFj5SaRyLk0zFI-X0bdAVm1kneXzKQ";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Safe Analytics Initialization (checks browser support / adblockers)
let analytics = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((err) => {
    console.warn("Firebase Analytics is not supported in this environment:", err);
  });
}

// Safe Messaging Instance Getter
let messaging = null;
export const getMessagingInstance = async () => {
  if (typeof window !== "undefined" && (await isMessagingSupported())) {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
};

// Request FCM Token for Push Notifications using VAPID Key
export const requestForToken = async () => {
  try {
    const msg = await getMessagingInstance();
    if (!msg) {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }
    const currentToken = await getToken(msg, { vapidKey });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving FCM token:", err);
    return null;
  }
};

// Request and store Admin Token (in localStorage and backend)
export const storeAdminToken = async () => {
  try {
    const token = await requestForToken();
    if (token) {
      localStorage.setItem('admin_fcm_token', token);
      
      // Attempt backend sync
      try {
        await fetch('http://localhost:5000/api/admin/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            deviceInfo: navigator.userAgent
          })
        });
      } catch (backendErr) {
        console.warn('Backend sync failed, stored token in localStorage:', backendErr.message);
      }
      return token;
    }
  } catch (err) {
    console.error('Failed to request and store admin token:', err);
  }
  return localStorage.getItem('admin_fcm_token') || null;
};

export { app, analytics };

export default app;
