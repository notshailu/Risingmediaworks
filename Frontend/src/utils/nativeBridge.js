/**
 * React Native WebView & Mobile App Integration Bridge Utility
 * Provides bidirectional communication between Rising Admin Web App and React Native shell.
 */

export const isReactNative = () => {
  return typeof window !== 'undefined' && !!(window.ReactNativeWebView || window.webkit?.messageHandlers?.reactNative);
};

/**
 * Send structured JSON event message to React Native container
 * @param {string} type - Message type (e.g. 'NEW_INQUIRY', 'HAPTIC_FEEDBACK', 'TOKEN_SYNC', 'NAVIGATE')
 * @param {object} payload - Associated data object
 */
export const sendToNative = (type, payload = {}) => {
  if (typeof window === 'undefined') return;

  const message = JSON.stringify({
    type,
    payload,
    timestamp: Date.now(),
    source: 'RMW_ADMIN_WEB'
  });

  try {
    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
      window.ReactNativeWebView.postMessage(message);
    } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.reactNative) {
      window.webkit.messageHandlers.reactNative.postMessage(message);
    }
  } catch (err) {
    console.warn('Failed to send message to React Native WebView:', err);
  }
};

/**
 * Trigger native mobile device haptic feedback
 * @param {'light'|'medium'|'heavy'|'success'|'warning'|'error'} style 
 */
export const triggerNativeHaptic = (style = 'light') => {
  if (isReactNative()) {
    sendToNative('HAPTIC_FEEDBACK', { style });
  } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      const patterns = {
        light: [15],
        medium: [30],
        heavy: [50],
        success: [15, 30, 20],
        warning: [30, 40, 30],
        error: [50, 50, 50]
      };
      navigator.vibrate(patterns[style] || [20]);
    } catch (e) {}
  }
};

/**
 * Send inquiry notification event to React Native push/toast system
 * @param {object} inquiry 
 */
export const notifyNativeNewInquiry = (inquiry) => {
  sendToNative('NEW_INQUIRY', {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    projectType: inquiry.projectType,
    details: inquiry.details,
    createdAt: inquiry.createdAt
  });
  triggerNativeHaptic('success');
};

/**
 * Subscribe to messages sent FROM React Native TO WebView
 * @param {function} callback 
 * @returns {function} unsubscribe function
 */
export const listenForNativeMessages = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event) => {
    try {
      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return;
        }
      }

      if (data && (data.source === 'REACT_NATIVE' || data.type)) {
        callback(data);
      }
    } catch (err) {
      console.warn('Error parsing message from React Native:', err);
    }
  };

  window.addEventListener('message', handleMessage);
  document.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
    document.removeEventListener('message', handleMessage);
  };
};
