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
      minHeight: '100dvh',
      backgroundColor: '#050508',
      color: '#ffffff',
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
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 80%)',
        pointerEvents: 'none'
      }} />

      {/* Soft Ambient Electric Blue & Violet Spotlights */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 82, 255, 0.18) 0%, rgba(124, 58, 237, 0.08) 50%, rgba(0, 0, 0, 0) 75%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Redesigned Floating Glassmorphism Container */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'rgba(15, 15, 20, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '28px',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box',
        boxShadow: '0 30px 70px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
            boxShadow: '0 10px 30px rgba(0, 82, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
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
              color: '#ffffff'
            }}>
              Rising Admin
            </h1>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: '800',
              padding: '0.15rem 0.5rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 82, 255, 0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(0, 82, 255, 0.3)',
              letterSpacing: '0.06em'
            }}>
              PRO
            </span>
          </div>

          <p style={{
            fontSize: '0.83rem',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
            lineHeight: '1.4'
          }}>
            Secure management portal authentication
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '0.8rem 1rem',
            borderRadius: '14px',
            fontSize: '0.82rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.3s ease'
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
              color: 'rgba(255, 255, 255, 0.55)',
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
                color: 'rgba(255, 255, 255, 0.35)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0052ff';
                  e.target.style.backgroundColor = 'rgba(0, 82, 255, 0.08)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 82, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
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
              color: 'rgba(255, 255, 255, 0.55)',
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
                color: 'rgba(255, 255, 255, 0.35)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0052ff';
                  e.target.style.backgroundColor = 'rgba(0, 82, 255, 0.08)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(0, 82, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
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
                  color: 'rgba(255, 255, 255, 0.45)',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '8px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)'}
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
              backgroundColor: '#ffffff',
              color: '#000000',
              fontWeight: '800',
              fontSize: '0.92rem',
              borderRadius: '14px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 10px 25px rgba(255, 255, 255, 0.15)',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#0052ff';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 82, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 255, 255, 0.15)';
              }
            }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>

        {/* Initial Credentials Hint Box */}
        <div style={{
          marginTop: '2rem',
          padding: '0.85rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '14px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          flexWrap: 'wrap'
        }}>
          <span>Default Access:</span>
          <span style={{ color: '#ffffff', fontWeight: '700', fontFamily: 'monospace', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>admin</span>
          <span>/</span>
          <span style={{ color: '#ffffff', fontWeight: '700', fontFamily: 'monospace', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>admin123</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
