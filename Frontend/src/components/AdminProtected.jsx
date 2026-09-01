import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const authStatus = localStorage.getItem('admin_authenticated');

    if (!token || authStatus !== 'true') {
      setIsAuthenticated(false);
      return;
    }

    // Attempt online verification with backend (fallback gracefully if offline)
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null);

        if (response && response.ok) {
          setIsAuthenticated(true);
        } else if (response && response.status === 401) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
        } else {
          // If offline or local dev token, allow access based on local auth state
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
            Verifying Admin Access...
          </div>
          <div style={{ fontSize: '0.85rem' }}>Securing session</div>
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
