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
        localStorage.setItem('admin_login_time', Date.now().toString());
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
        localStorage.setItem('admin_login_time', Date.now().toString());
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
      minHeight: '100dvh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '1.25rem',
      boxSizing: 'border-box'
    }}>
      {/* Background Architectural Grid Accent Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at 50% 50%, black 50%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 50%, transparent 85%)',
        pointerEvents: 'none'
      }} />

      {/* Soft Ambient Electric Blue Spotlight */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '550px',
        height: '550px',
        background: 'radial-gradient(circle, rgba(0, 82, 255, 0.08) 0%, rgba(124, 58, 237, 0.04) 50%, rgba(0, 0, 0, 0) 75%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Redesigned Floating White Light Theme Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '28px',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
        zIndex: 10,
        position: 'relative'
      }}>
        {/* Top Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          {/* Logo Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #0052ff 0%, #7c3aed 100%)',
            color: '#ffffff',
            fontWeight: '900',
            fontSize: '1.45rem',
            marginBottom: '1.25rem',
            boxShadow: '0 10px 25px rgba(0, 82, 255, 0.3)',
            letterSpacing: '-0.03em'
          }}>
            R
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <h1 style={{
              fontSize: '1.55rem',
              fontWeight: '800',
              margin: 0,
              letterSpacing: '-0.02em',
              color: '#0f172a'
            }}>
              Rising Admin
            </h1>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: '800',
              padding: '0.15rem 0.5rem',
              borderRadius: '8px',
              backgroundColor: '#e0e7ff',
              color: '#4338ca',
              letterSpacing: '0.06em'
            }}>
              PRO
            </span>
          </div>

          <p style={{
            fontSize: '0.83rem',
            color: '#64748b',
            margin: 0,
            lineHeight: '1.4'
          }}>
            Secure management portal authentication
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.8rem 1rem',
            borderRadius: '14px',
            fontSize: '0.82rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* USERNAME FIELD */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#475569',
              marginBottom: '0.45rem'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.8rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '14px',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0052ff';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 82, 255, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.72rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#475569',
              marginBottom: '0.45rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 3.2rem 0.85rem 2.8rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '14px',
                  color: '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0052ff';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 82, 255, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '8px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0052ff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.95rem',
              backgroundColor: '#0052ff',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '0.92rem',
              borderRadius: '14px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 10px 25px rgba(0, 82, 255, 0.25)',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#0040d0';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 82, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#0052ff';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 82, 255, 0.25)';
              }
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
