import { Outlet, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { storeAdminToken } from '../../firebase';
import { listenForNativeMessages, triggerNativeHaptic } from '../../utils/nativeBridge';

const AdminLayout = () => {
  const location = useLocation();
  const [fcmToken, setFcmToken] = useState(localStorage.getItem('admin_fcm_token') || '');
  const [tokenStatus, setTokenStatus] = useState(localStorage.getItem('admin_fcm_token') ? 'Saved' : 'Not Saved');
  const [copied, setCopied] = useState(false);

  // Website Previewer Modal State
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'

  // Mobile FCM Token Modal State
  const [showMobileTokenModal, setShowMobileTokenModal] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);

  // User Notification Toggle State
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('rmw_notifications_enabled') !== 'false'
  );

  const isNotificationsOn = notificationsEnabled && (tokenStatus === 'Saved' || tokenStatus === 'Saved via Native' || tokenStatus === 'Saving...');

  const handleToggleNotifications = async (nextState) => {
    try {
      triggerNativeHaptic('medium');
    } catch (e) {}

    if (nextState) {
      setNotificationsEnabled(true);
      localStorage.setItem('rmw_notifications_enabled', 'true');
      await handleSaveToken(true);
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('rmw_notifications_enabled', 'false');
      setTokenStatus('Disabled');
    }
  };

  // Real-time Inquiry Notification State
  const [activeToastNotification, setActiveToastNotification] = useState(null);

  const isInquiriesActive = location.pathname.includes('/admin/inquiries');
  const isWorksActive = location.pathname.includes('/admin/works');
  const isCaseStudiesActive = location.pathname.includes('/admin/case-studies');
  const isBooksActive = location.pathname.includes('/admin/books');

  // Count unread new real inquiries for notification badge
  let unreadCount = 0;
  try {
    const stored = JSON.parse(localStorage.getItem('rmw_inquiries') || '[]');
    const realStored = stored.filter(i => i.id !== 'inq-101' && i.id !== 'inq-102' && i.id !== 'inq-103');
    unreadCount = realStored.filter(i => i.status === 'New').length;
  } catch (e) {}

  const playNotificationChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio chime failed:', e);
    }
  };

  const handleTestAlert = () => {
    playNotificationChime();
    triggerNativeHaptic('success');
    setActiveToastNotification({
      id: 'test-' + Date.now(),
      name: 'System Test Alert',
      projectType: 'Notifications Active',
      details: 'Push notification system is working perfectly!'
    });
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 Notification System Active', {
        body: 'You will receive real-time alerts when new inquiries arrive.',
        icon: '/favicon.svg'
      });
    }
  };

  const handleSaveToken = async (userInitiated = false) => {
    setTokenStatus('Saving...');
    try {
      const token = await storeAdminToken(userInitiated);
      if (token) {
        setFcmToken(token);
        localStorage.setItem('admin_fcm_token', token);
        localStorage.setItem('rmw_admin_fcm_token', token);
        setTokenStatus('Saved');
      } else {
        setTokenStatus(typeof window !== 'undefined' && window.Notification?.permission === 'denied' ? 'Blocked' : 'Not Saved');
      }
    } catch (err) {
      console.error(err);
      setTokenStatus('Failed');
    }
  };

  useEffect(() => {
    // Ensure body background is light gray while in admin layout so no black gap shows
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#f8fafc';

    // Store Admin FCM Token ONLY when user opens the Admin Route (/admin/*)
    handleSaveToken(true);

    // 2. Real-time BroadcastChannel Listener for Inquiries
    let channel = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('rmw_inquiries_channel');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_INQUIRY') {
          const inq = event.data.inquiry;
          playNotificationChime();
          setActiveToastNotification(inq);

          // Native Browser Push Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('📩 New Project Inquiry Received!', {
              body: `${inq.name} requested ${inq.projectType}`,
              icon: '/favicon.svg'
            });
          }
        }
      };
    }

    // 3. Listen for Messages FROM React Native Mobile Shell
    const unsubscribeNative = listenForNativeMessages((data) => {
      if (data.type === 'NEW_INQUIRY') {
        playNotificationChime();
        triggerNativeHaptic('success');
        if (data.payload) setActiveToastNotification(data.payload);
      } else if (data.type === 'SET_FCM_TOKEN' && data.payload?.token) {
        setFcmToken(data.payload.token);
        localStorage.setItem('admin_fcm_token', data.payload.token);
        setTokenStatus('Saved via Native');
      }
    });

    return () => {
      document.body.style.backgroundColor = originalBg;
      if (channel) channel.close();
      if (unsubscribeNative) unsubscribeNative();
    };
  }, []);

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshIframe = () => {
    const iframe = document.getElementById('admin-preview-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="admin-panel admin-layout-container" style={{
      display: 'flex',
      minHeight: '100vh',
      minHeight: '100dvh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif",
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .admin-panel, .admin-panel * {
          cursor: auto !important;
        }
      `}</style>

      {/* Mobile Native App Top Header Bar */}
      <header className="mobile-admin-app-header" style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #0052ff 0%, #7c3aed 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.9rem',
            boxShadow: '0 3px 8px rgba(0, 82, 255, 0.25)',
            flexShrink: 0
          }}>
            R
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a', whiteSpace: 'nowrap' }}>
              Rising Admin
            </span>
          </div>
        </div>

        {/* Action Icon Buttons Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {/* FCM Push Token Icon Button */}
          <button 
            onClick={() => {
              triggerNativeHaptic('light');
              setShowMobileTokenModal(true);
            }} 
            title="Push Token"
            style={{ 
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tokenStatus === 'Saved' || tokenStatus === 'Saved via Native' ? '#15803d' : '#b45309', 
              backgroundColor: tokenStatus === 'Saved' || tokenStatus === 'Saved via Native' ? '#dcfce7' : '#fef3c7', 
              border: '1px solid ' + (tokenStatus === 'Saved' || tokenStatus === 'Saved via Native' ? '#bbf7d0' : '#fde68a'),
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>

          {/* Live Site Preview Icon Button */}
          <button 
            onClick={() => {
              triggerNativeHaptic('light');
              setShowWebsitePreview(true);
            }} 
            title="Live Site Preview"
            style={{ 
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0052ff', 
              backgroundColor: '#eff6ff', 
              border: '1px solid #bfdbfe',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </button>

          {/* Logout Icon Button */}
          <button 
            onClick={() => {
              triggerNativeHaptic('medium');
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_authenticated');
              localStorage.removeItem('admin_user');
              window.location.href = '/admin/login';
            }} 
            title="Logout"
            style={{ 
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar" style={{ width: '270px', backgroundColor: '#ffffff', padding: '2.25rem 1.6rem', borderRight: '1px solid #e2e8f0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.5rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0052ff 0%, #7c3aed 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.1rem',
            boxShadow: '0 4px 14px rgba(0,82,255,0.3)'
          }}>
            R
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Rising Admin
            </h2>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Control Dashboard</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link 
            to="/admin/inquiries" 
            style={{ 
              color: isInquiriesActive ? '#ffffff' : '#475569', 
              textDecoration: 'none', 
              padding: '0.8rem 1.1rem', 
              borderRadius: '12px', 
              backgroundColor: isInquiriesActive ? '#0f172a' : 'transparent', 
              fontWeight: isInquiriesActive ? '700' : '600', 
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: isInquiriesActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Client Inquiries
            </div>
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: isInquiriesActive ? '#0052ff' : '#0052ff',
                color: '#ffffff',
                borderRadius: '20px',
                padding: '0.15rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}>
                {unreadCount}
              </span>
            )}
          </Link>

          <Link 
            to="/admin/works" 
            style={{ 
              color: isWorksActive ? '#ffffff' : '#475569', 
              textDecoration: 'none', 
              padding: '0.8rem 1.1rem', 
              borderRadius: '12px', 
              backgroundColor: isWorksActive ? '#0f172a' : 'transparent', 
              fontWeight: isWorksActive ? '700' : '600', 
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: isWorksActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            Works Management
          </Link>

          <Link 
            to="/admin/case-studies" 
            style={{ 
              color: isCaseStudiesActive ? '#ffffff' : '#475569', 
              textDecoration: 'none', 
              padding: '0.8rem 1.1rem', 
              borderRadius: '12px', 
              backgroundColor: isCaseStudiesActive ? '#0f172a' : 'transparent', 
              fontWeight: isCaseStudiesActive ? '700' : '600', 
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: isCaseStudiesActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Case Studies
          </Link>

          <Link 
            to="/admin/books" 
            style={{ 
              color: isBooksActive ? '#ffffff' : '#475569', 
              textDecoration: 'none', 
              padding: '0.8rem 1.1rem', 
              borderRadius: '12px', 
              backgroundColor: isBooksActive ? '#0f172a' : 'transparent', 
              fontWeight: isBooksActive ? '700' : '600', 
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: isBooksActive ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Books Management
          </Link>

          {/* Admin Push Notification Box */}
          <div style={{
            marginTop: 'auto',
            padding: '1rem',
            backgroundColor: isNotificationsOn ? '#f0fdf4' : '#f8fafc',
            borderRadius: '14px',
            border: '1px solid ' + (isNotificationsOn ? '#bbf7d0' : '#e2e8f0'),
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '800', color: isNotificationsOn ? '#14532d' : '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                🔔 Push Alerts
              </span>

              {/* iOS Style ON/OFF Toggle Switch */}
              <div 
                onClick={() => handleToggleNotifications(!isNotificationsOn)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '13px',
                  backgroundColor: isNotificationsOn ? '#22c55e' : '#cbd5e1',
                  padding: '2px',
                  boxSizing: 'border-box',
                  transition: 'background-color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transform: isNotificationsOn ? 'translateX(20px)' : 'translateX(0px)',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', color: isNotificationsOn ? '#166534' : '#64748b', margin: '0 0 0.75rem 0', lineHeight: '1.4' }}>
              {isNotificationsOn ? 'Alerts active for new client inquiries.' : 'Alerts paused. Toggle ON to enable.'}
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
              <button
                onClick={() => setShowMobileTokenModal(true)}
                style={{
                  width: '100%',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  padding: '0.35rem',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                ⚙️ Settings & Device Info
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowWebsitePreview(true)}
            style={{ 
              color: '#0052ff', 
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '0.8rem 1.1rem', 
              borderRadius: '12px', 
              marginTop: '0.75rem',
              fontWeight: '700', 
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Live Site Preview
          </button>

          <Link 
            to="/" 
            style={{ 
              color: '#64748b', 
              textDecoration: 'none', 
              padding: '0.6rem 1.1rem', 
              borderRadius: '12px', 
              fontWeight: '600', 
              fontSize: '0.82rem',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '0.25rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Exit to Homepage
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_authenticated');
              localStorage.removeItem('admin_user');
              window.location.href = '/admin/login';
            }}
            style={{
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '0.65rem 1.1rem',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content" style={{
        flex: 1,
        padding: '2.5rem 3rem',
        overflowY: 'auto',
        minHeight: '100%',
        backgroundColor: '#f8fafc',
        boxSizing: 'border-box'
      }}>
        <Outlet />
      </main>

      {/* Mobile App Bottom Tab Bar Navigation */}
      <nav className="mobile-admin-bottom-nav" style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '68px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.06)',
        zIndex: 99999,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 0.75rem'
      }}>
        <Link 
          to="/admin/inquiries" 
          onClick={() => triggerNativeHaptic('light')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: isInquiriesActive ? '#0052ff' : '#64748b',
            fontSize: '0.72rem',
            fontWeight: isInquiriesActive ? '700' : '600',
            position: 'relative',
            flex: 1
          }}
        >
          <div style={{
            padding: '0.35rem 1.25rem',
            borderRadius: '20px',
            backgroundColor: isInquiriesActive ? '#eff6ff' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.2s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isInquiriesActive ? "2.5" : "2"}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '12px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                boxShadow: '0 0 0 2px #ffffff'
              }} />
            )}
          </div>
          Inquiries
        </Link>

        <Link 
          to="/admin/works" 
          onClick={() => triggerNativeHaptic('light')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: isWorksActive ? '#0052ff' : '#64748b',
            fontSize: '0.72rem',
            fontWeight: isWorksActive ? '700' : '600',
            flex: 1
          }}
        >
          <div style={{
            padding: '0.35rem 1.25rem',
            borderRadius: '20px',
            backgroundColor: isWorksActive ? '#eff6ff' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isWorksActive ? "2.5" : "2"}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          </div>
          Works
        </Link>

        <Link 
          to="/admin/books" 
          onClick={() => triggerNativeHaptic('light')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: isBooksActive ? '#0052ff' : '#64748b',
            fontSize: '0.72rem',
            fontWeight: isBooksActive ? '700' : '600',
            flex: 1
          }}
        >
          <div style={{
            padding: '0.35rem 1.25rem',
            borderRadius: '20px',
            backgroundColor: isBooksActive ? '#eff6ff' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isBooksActive ? "2.5" : "2"}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          Books
        </Link>

        <button 
          onClick={() => {
            triggerNativeHaptic('light');
            setShowWebsitePreview(true);
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: showWebsitePreview ? '#0052ff' : '#64748b',
            fontSize: '0.72rem',
            fontWeight: showWebsitePreview ? '700' : '600',
            flex: 1
          }}
        >
          <div style={{
            padding: '0.35rem 1.25rem',
            borderRadius: '20px',
            backgroundColor: showWebsitePreview ? '#eff6ff' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          Website
        </button>
      </nav>

      {/* MOBILE PUSH NOTIFICATIONS MODAL (User Facing) */}
      {showMobileTokenModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '1.75rem 1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowMobileTokenModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>

            {/* Header Icon & Title */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: tokenStatus === 'Saved' || tokenStatus === 'Saved via Native' ? '#f0fdf4' : '#fffbeb',
                color: tokenStatus === 'Saved' || tokenStatus === 'Saved via Native' ? '#16a34a' : '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem',
                border: '1px solid ' + (tokenStatus === 'Saved' || tokenStatus === 'Saved via Native' ? '#bbf7d0' : '#fde68a'),
                boxShadow: '0 8px 20px rgba(0,0,0,0.04)'
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                Push Notifications
              </h3>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>
                Real-time alerts for new client inquiries
              </p>
            </div>

            {/* ON / OFF Toggle Switch Card */}
            <div 
              onClick={() => handleToggleNotifications(!isNotificationsOn)}
              style={{
                padding: '1.1rem 1.2rem',
                borderRadius: '18px',
                backgroundColor: isNotificationsOn ? '#f0fdf4' : '#f8fafc',
                border: '1px solid ' + (isNotificationsOn ? '#bbf7d0' : '#e2e8f0'),
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingRight: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isNotificationsOn ? '#22c55e' : '#94a3b8',
                    boxShadow: isNotificationsOn ? '0 0 0 3px rgba(34, 197, 94, 0.2)' : 'none'
                  }} />
                  <span style={{ fontSize: '0.92rem', fontWeight: '800', color: isNotificationsOn ? '#14532d' : '#334155' }}>
                    {isNotificationsOn ? 'Alerts Enabled' : 'Alerts Disabled'}
                  </span>
                </div>
                <span style={{ fontSize: '0.76rem', color: isNotificationsOn ? '#166534' : '#64748b', lineHeight: '1.4' }}>
                  {isNotificationsOn
                    ? 'Receiving instant alerts for client inquiries'
                    : 'Turn on to get notified on new requests'}
                </span>
              </div>

              {/* iOS Style ON/OFF Toggle Switch */}
              <div style={{
                width: '50px',
                height: '28px',
                borderRadius: '15px',
                backgroundColor: isNotificationsOn ? '#22c55e' : '#cbd5e1',
                padding: '2px',
                boxSizing: 'border-box',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  transform: isNotificationsOn ? 'translateX(22px)' : 'translateX(0px)',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
              </div>
            </div>



            {/* Collapsible Advanced Technical Info for Developers */}
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <button
                onClick={() => setShowTechDetails(!showTechDetails)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '0.2rem 0.5rem'
                }}
              >
                {showTechDetails ? '▲ Hide Device Details' : '⚙️ Technical Device Info'}
              </button>

              {showTechDetails && (
                <div style={{ marginTop: '0.75rem', textAlign: 'left' }}>
                  <textarea
                    readOnly
                    rows="2"
                    value={fcmToken || 'No FCM token registered'}
                    style={{
                      width: '100%',
                      fontSize: '0.65rem',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                      resize: 'none'
                    }}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* LIVE WEBSITE PREVIEWER MODAL */}
      {showWebsitePreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          {/* MODAL CONTROL BAR */}
          <div style={{
            width: '100%',
            maxWidth: '1000px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '16px 16px 0 0',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            borderBottom: '1px solid #1e293b',
            boxSizing: 'border-box',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                🌐 Live Site Preview
              </span>
              <span style={{ fontSize: '0.62rem', backgroundColor: '#10b981', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: '800', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                SYNC ACTIVE
              </span>
            </div>

            {/* VIEWPORT CONTROLS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#1e293b', padding: '0.25rem', borderRadius: '10px' }}>
              <button
                onClick={() => setPreviewMode('desktop')}
                style={{
                  backgroundColor: previewMode === 'desktop' ? '#334155' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap'
                }}
              >
                💻 Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                style={{
                  backgroundColor: previewMode === 'mobile' ? '#334155' : 'transparent',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  whiteSpace: 'nowrap'
                }}
              >
                📱 Mobile
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <button
                onClick={handleRefreshIframe}
                title="Refresh Live Preview"
                style={{
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}
              >
                🔄 Refresh
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: '#0052ff',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Open Site ↗
              </a>

              <button
                onClick={() => setShowWebsitePreview(false)}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* IFRAME CONTAINER */}
          <div style={{
            width: '100%',
            maxWidth: previewMode === 'mobile' ? '400px' : '1000px',
            height: previewMode === 'mobile' ? '680px' : 'calc(82vh - 60px)',
            backgroundColor: '#ffffff',
            borderRadius: '0 0 16px 16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <iframe
              id="admin-preview-iframe"
              src="/"
              title="Live Website Preview"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
        </div>
      )}

      {/* REAL-TIME INQUIRY TOAST NOTIFICATION BANNER */}
      {activeToastNotification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35), 0 0 0 2px #0052ff',
          zIndex: 9999999,
          maxWidth: '380px',
          width: 'calc(100% - 48px)',
          fontFamily: "'Manrope', sans-serif"
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#60a5fa' }}>
              📩 NEW INQUIRY RECEIVED
            </span>
            <button
              onClick={() => setActiveToastNotification(null)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem' }}
            >
              ✕
            </button>
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.2rem 0', color: '#ffffff' }}>
            {activeToastNotification.name}
          </h4>
          <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.6rem' }}>
            Service: <strong>{activeToastNotification.projectType}</strong>
          </span>
          {activeToastNotification.details && (
            <p style={{ fontSize: '0.82rem', color: '#d1d5db', margin: '0 0 1rem 0', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "{activeToastNotification.details}"
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link
              to="/admin/inquiries"
              onClick={() => setActiveToastNotification(null)}
              style={{
                flex: 1,
                backgroundColor: '#0052ff',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.6rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 82, 255, 0.4)'
              }}
            >
              View Inquiry Details →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
