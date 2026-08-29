import { Outlet, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { storeAdminToken } from '../../firebase';

const AdminLayout = () => {
  const location = useLocation();
  const [fcmToken, setFcmToken] = useState(localStorage.getItem('admin_fcm_token') || '');
  const [tokenStatus, setTokenStatus] = useState(localStorage.getItem('admin_fcm_token') ? 'Saved' : 'Not Saved');
  const [copied, setCopied] = useState(false);

  const isInquiriesActive = location.pathname.includes('/admin/inquiries');
  const isWorksActive = location.pathname.includes('/admin/works');
  const isCaseStudiesActive = location.pathname.includes('/admin/case-studies');
  const isBooksActive = location.pathname.includes('/admin/books');

  // Count unread new inquiries for notification badge
  let unreadCount = 0;
  try {
    const stored = JSON.parse(localStorage.getItem('rmw_inquiries') || '[]');
    unreadCount = stored.filter(i => i.status === 'New').length;
  } catch (e) {}

  const handleSaveToken = async () => {
    setTokenStatus('Saving...');
    try {
      const token = await storeAdminToken();
      if (token) {
        setFcmToken(token);
        localStorage.setItem('admin_fcm_token', token);
        localStorage.setItem('rmw_admin_fcm_token', token);
        setTokenStatus('Saved');
      } else {
        setTokenStatus('Blocked / Error');
      }
    } catch (err) {
      console.error(err);
      setTokenStatus('Failed');
    }
  };

  useEffect(() => {
    // Automatically attempt token sync when entering admin layout
    handleSaveToken();
  }, []);

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="admin-panel admin-layout-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f7', color: '#000', fontFamily: "'Manrope', sans-serif" }}>
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
        padding: '1rem 1.25rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }}>
            R
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#000000' }}>
            Rising Admin
          </span>
        </div>

        {/* Top Inquiries Button */}
        <Link 
          to="/admin/inquiries" 
          style={{ 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            color: '#ffffff', 
            textDecoration: 'none', 
            backgroundColor: isInquiriesActive ? '#000000' : '#0052ff', 
            padding: '0.45rem 1rem', 
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 12px rgba(0,82,255,0.25)'
          }}
        >
          <span>📩 Inquiries</span>
          {unreadCount > 0 && (
            <span style={{ backgroundColor: '#ffffff', color: '#0052ff', borderRadius: '10px', padding: '0.1rem 0.45rem', fontSize: '0.7rem', fontWeight: '800' }}>
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Desktop Sidebar (Hidden on Mobile App View) */}
      <aside className="admin-sidebar" style={{ width: '260px', backgroundColor: '#ffffff', padding: '2.5rem 1.8rem', borderRight: '1px solid #e0e0e0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem' }}>
            R
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#000000', letterSpacing: '-0.02em', margin: 0 }}>
            Rising Admin
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Link 
            to="/admin/inquiries" 
            style={{ 
              color: isInquiriesActive ? '#ffffff' : '#444444', 
              textDecoration: 'none', 
              padding: '0.85rem 1.2rem', 
              borderRadius: '10px', 
              backgroundColor: isInquiriesActive ? '#000000' : 'transparent', 
              fontWeight: isInquiriesActive ? '700' : '500', 
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Inquiries
            </div>
            {unreadCount > 0 && (
              <span style={{ backgroundColor: isInquiriesActive ? '#ffffff' : '#0052ff', color: isInquiriesActive ? '#000000' : '#ffffff', borderRadius: '10px', padding: '0.15rem 0.5rem', fontSize: '0.72rem', fontWeight: '800' }}>
                {unreadCount}
              </span>
            )}
          </Link>

          <Link 
            to="/admin/works" 
            style={{ 
              color: isWorksActive ? '#ffffff' : '#444444', 
              textDecoration: 'none', 
              padding: '0.85rem 1.2rem', 
              borderRadius: '10px', 
              backgroundColor: isWorksActive ? '#000000' : 'transparent', 
              fontWeight: isWorksActive ? '700' : '500', 
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            Works Management
          </Link>

          <Link 
            to="/admin/case-studies" 
            style={{ 
              color: isCaseStudiesActive ? '#ffffff' : '#444444', 
              textDecoration: 'none', 
              padding: '0.85rem 1.2rem', 
              borderRadius: '10px', 
              backgroundColor: isCaseStudiesActive ? '#000000' : 'transparent', 
              fontWeight: isCaseStudiesActive ? '700' : '500', 
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Case Studies
          </Link>

          <Link 
            to="/admin/books" 
            style={{ 
              color: isBooksActive ? '#ffffff' : '#444444', 
              textDecoration: 'none', 
              padding: '0.85rem 1.2rem', 
              borderRadius: '10px', 
              backgroundColor: isBooksActive ? '#000000' : 'transparent', 
              fontWeight: isBooksActive ? '700' : '500', 
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Books Management
          </Link>

          {/* Admin FCM Push Token Store Box */}
          <div style={{
            marginTop: '1.8rem',
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#495057' }}>
                🔔 Admin Push Token
              </span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '700',
                padding: '0.15rem 0.4rem',
                borderRadius: '6px',
                backgroundColor: tokenStatus === 'Saved' ? '#d4edda' : '#fff3cd',
                color: tokenStatus === 'Saved' ? '#155724' : '#856404'
              }}>
                {tokenStatus}
              </span>
            </div>

            {fcmToken ? (
              <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
                <input
                  type="text"
                  readOnly
                  value={fcmToken}
                  style={{
                    fontSize: '0.68rem',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ced4da',
                    backgroundColor: '#ffffff',
                    color: '#495057',
                    fontFamily: 'monospace',
                    textOverflow: 'ellipsis'
                  }}
                />
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={handleCopyToken}
                    style={{
                      flex: 1,
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      padding: '0.35rem',
                      backgroundColor: '#0052ff',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {copied ? '✓ Copied' : 'Copy Token'}
                  </button>
                  <button
                    onClick={handleSaveToken}
                    title="Refresh & Save Token"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      padding: '0.35rem 0.6rem',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleSaveToken}
                style={{
                  width: '100%',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.45rem',
                  backgroundColor: '#0052ff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Store Admin Token
              </button>
            )}
          </div>

          <Link 
            to="/" 
            style={{ 
              color: '#666666', 
              textDecoration: 'none', 
              padding: '0.85rem 1.2rem', 
              borderRadius: '10px', 
              marginTop: '1rem',
              fontWeight: '500', 
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content" style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
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
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e5e5',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        zIndex: 99999,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 0.5rem'
      }}>
        <Link 
          to="/admin/inquiries" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: isInquiriesActive ? '#000000' : '#888888',
            fontSize: '0.72rem',
            fontWeight: isInquiriesActive ? '700' : '500',
            position: 'relative'
          }}
        >
          <div style={{
            padding: '0.35rem 1.1rem',
            borderRadius: '16px',
            backgroundColor: isInquiriesActive ? '#f0f0f0' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isInquiriesActive ? "2.5" : "2"}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          Inquiries
        </Link>

        <Link 
          to="/admin/works" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: isWorksActive ? '#000000' : '#888888',
            fontSize: '0.72rem',
            fontWeight: isWorksActive ? '700' : '500'
          }}
        >
          <div style={{
            padding: '0.35rem 1.1rem',
            borderRadius: '16px',
            backgroundColor: isWorksActive ? '#f0f0f0' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isWorksActive ? "2.5" : "2"}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          </div>
          Works
        </Link>

        <Link 
          to="/admin/books" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: isBooksActive ? '#000000' : '#888888',
            fontSize: '0.72rem',
            fontWeight: isBooksActive ? '700' : '500'
          }}
        >
          <div style={{
            padding: '0.35rem 1.1rem',
            borderRadius: '16px',
            backgroundColor: isBooksActive ? '#f0f0f0' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isBooksActive ? "2.5" : "2"}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          Books
        </Link>

        <Link 
          to="/" 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: '#888888',
            fontSize: '0.72rem',
            fontWeight: '500'
          }}
        >
          <div style={{
            padding: '0.35rem 1.1rem',
            borderRadius: '16px',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          Website
        </Link>
      </nav>
    </div>
  );
};

export default AdminLayout;
