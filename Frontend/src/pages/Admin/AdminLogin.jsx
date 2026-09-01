import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      // Try Backend API Login
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        localStorage.setItem('admin_authenticated', 'true');
        navigate('/admin/inquiries');
        return;
      } else if (response) {
        const errData = await response.json();
        setError(errData.message || 'Invalid login credentials.');
        setLoading(false);
        return;
      }

      // Offline / Local Default Fallback Credentials (admin / admin123)
      if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
        const mockUser = { username: 'admin', name: 'Rising Media Admin', role: 'superadmin' };
        localStorage.setItem('admin_token', 'local_offline_admin_token_2026');
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        localStorage.setItem('admin_authenticated', 'true');
        navigate('/admin/inquiries');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Manrope', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '1.5rem'
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Login Container Box */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#09090b',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        boxSizing: 'border-box',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        zIndex: 10,
        position: 'relative'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontWeight: '900',
            fontSize: '1.4rem',
            marginBottom: '1.25rem',
            boxShadow: '0 10px 25px rgba(255, 255, 255, 0.15)'
          }}>
            R
          </div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em',
            color: '#ffffff'
          }}>
            Admin Authentication
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0
          }}>
            Enter your credentials to access the management portal
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '0.5rem'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.85rem 1.1rem',
                backgroundColor: '#18181b',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ffffff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.78rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 3rem 0.85rem 1.1rem',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ffffff'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: 0
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontWeight: '700',
              fontSize: '0.95rem',
              borderRadius: '12px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.75rem',
              transition: 'transform 0.2s, background-color 0.2s, opacity 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#e4e4e7'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#ffffff'; }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard →'}
          </button>
        </form>

        {/* Initial Credentials Hint */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)'
        }}>
          Initial Default Credentials: <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>admin</span> / <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>admin123</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
