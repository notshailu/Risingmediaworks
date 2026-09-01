import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // Strictly 7 days in milliseconds (604,800,000 ms)

const AdminProtected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

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

    // Check if 7 days have passed since login
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      const now = Date.now();
      if (now - loginTime > SEVEN_DAYS_MS) {
        console.warn('[AUTH SESSION EXPIRED]: 7 days elapsed. Logging out automatically.');
        clearSession();
        return;
      }
    }

    // Attempt online JWT verification with backend
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null);

        if (response && response.ok) {
          setIsAuthenticated(true);
        } else if (response && response.status === 401) {
          console.warn('[JWT EXPIRED / INVALID]: Server rejected token. Automatic logout.');
          clearSession();
        } else {
          // If offline or local dev token, allow access based on valid 7-day timestamp
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(true);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        color: '#64748b'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0f172a' }}>
            Verifying 7-Day Admin JWT Session...
          </div>
          <div style={{ fontSize: '0.85rem' }}>Securing management portal</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtected;
