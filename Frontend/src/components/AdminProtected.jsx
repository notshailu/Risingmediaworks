import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // Strictly 7 days in milliseconds (604,800,000 ms)

const AdminProtected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Synchronous instant session check (0ms delay)
    const token = localStorage.getItem('admin_token');
    const authStatus = localStorage.getItem('admin_authenticated');
    const loginTimeStr = localStorage.getItem('admin_login_time');

    if (!token || authStatus !== 'true') return false;

    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      if (Date.now() - loginTime > SEVEN_DAYS_MS) {
        return false;
      }
    }

    return true;
  });

  const clearSession = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const authStatus = localStorage.getItem('admin_authenticated');
    const loginTimeStr = localStorage.getItem('admin_login_time');

    if (!token || authStatus !== 'true') {
      clearSession();
      return;
    }

    // Enforce 7-day expiration check
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      if (Date.now() - loginTime > SEVEN_DAYS_MS) {
        console.warn('[AUTH SESSION EXPIRED]: 7 days elapsed. Logging out automatically.');
        clearSession();
        return;
      }
    }

    // Non-blocking background verification with backend
    const verifyToken = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout max

        const response = await fetch('http://localhost:5000/api/admin/verify', {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeoutId);

        if (response && response.status === 401) {
          console.warn('[JWT EXPIRED / INVALID]: Server rejected token. Automatic logout.');
          clearSession();
        }
      } catch (err) {
        // Keep authenticated if offline
      }
    };

    verifyToken();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtected;
