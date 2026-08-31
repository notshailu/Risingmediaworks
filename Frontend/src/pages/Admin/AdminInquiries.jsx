import React, { useState, useEffect } from 'react';
import { triggerNativeHaptic } from '../../utils/nativeBridge';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manual Lead Entry Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Video Production',
    details: ''
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = () => {
    try {
      const stored = localStorage.getItem('rmw_inquiries');
      if (stored) {
        const parsed = JSON.parse(stored);
        setInquiries(parsed);
      } else {
        localStorage.setItem('rmw_inquiries', JSON.stringify([]));
        setInquiries([]);
      }
    } catch (e) {
      console.error('Error fetching inquiries:', e);
      setInquiries([]);
    }
  };

  const saveInquiries = (updated) => {
    setInquiries(updated);
    localStorage.setItem('rmw_inquiries', JSON.stringify(updated));
    // Broadcast change to other open tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('rmw_inquiries_channel');
      channel.postMessage({ type: 'INQUIRIES_UPDATED' });
      channel.close();
    }
  };

  const handleToggleStatus = (id) => {
    triggerNativeHaptic('medium');
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: inq.status === 'New' ? 'Responded' : 'New' };
      }
      return inq;
    });
    saveInquiries(updated);
  };

  const handleDeleteInquiry = (id) => {
    triggerNativeHaptic('warning');
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      const updated = inquiries.filter(inq => inq.id !== id);
      saveInquiries(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all inquiries?')) {
      saveInquiries([]);
    }
  };

  const handleCreateManualInquiry = (e) => {
    e.preventDefault();
    if (!manualForm.name || (!manualForm.email && !manualForm.phone)) {
      alert('Please enter at least client name and an email or phone number.');
      return;
    }

    triggerNativeHaptic('success');
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: manualForm.name,
      company: manualForm.company,
      email: manualForm.email,
      phone: manualForm.phone,
      projectType: manualForm.projectType,
      details: manualForm.details || 'Manually logged inquiry via Admin Control Panel.',
      status: 'New',
      createdAt: new Date().toISOString()
    };

    const updated = [newInquiry, ...inquiries];
    saveInquiries(updated);
    setShowManualModal(false);
    setManualForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: 'Video Production',
      details: ''
    });
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'new' ? inq.status === 'New' :
      activeFilter === 'responded' ? inq.status === 'Responded' : true;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      (inq.name && inq.name.toLowerCase().includes(query)) ||
      (inq.email && inq.email.toLowerCase().includes(query)) ||
      (inq.projectType && inq.projectType.toLowerCase().includes(query)) ||
      (inq.details && inq.details.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const totalCount = inquiries.length;
  const newCount = inquiries.filter(i => i.status === 'New').length;
  const respondedCount = inquiries.filter(i => i.status === 'Responded').length;

  const getInitials = (name) => {
    if (!name) return 'IN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const avatarGradients = [
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'
  ];

  return (
    <div style={{ fontFamily: "'Manrope', -apple-system, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Header Row */}
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
              Client Inquiries
            </h1>
            {newCount > 0 && (
              <span style={{
                backgroundColor: '#eff6ff',
                color: '#0052ff',
                border: '1px solid #bfdbfe',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0052ff' }} />
                {newCount} New Action Required
              </span>
            )}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.4rem 0 0 0', fontWeight: '500' }}>
            Manage client project proposals submitted through website contact forms or logged manually.
          </p>
        </div>

        {/* Action Buttons */}
        {totalCount > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handleClearAll}
              style={{
                padding: '0.6rem 1rem',
                backgroundColor: '#ffffff',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>



      {/* METRICS STAT CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Metric Card */}
        <div
          onClick={() => setActiveFilter('all')}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.4rem',
            border: activeFilter === 'all' ? '2px solid #0f172a' : '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '1.1rem'
          }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#f1f5f9',
            color: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            📋
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Submissions
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>
              {totalCount}
            </div>
          </div>
        </div>

        {/* New Unread Metric Card */}
        <div
          onClick={() => setActiveFilter('new')}
          style={{
            backgroundColor: activeFilter === 'new' ? '#eff6ff' : '#ffffff',
            borderRadius: '16px',
            padding: '1.4rem',
            border: activeFilter === 'new' ? '2px solid #0052ff' : '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '1.1rem'
          }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#dbeafe',
            color: '#0052ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            🔥
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0052ff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New / Unread
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>
              {newCount}
            </div>
          </div>
        </div>

        {/* Responded Metric Card */}
        <div
          onClick={() => setActiveFilter('responded')}
          style={{
            backgroundColor: activeFilter === 'responded' ? '#f0fdf4' : '#ffffff',
            borderRadius: '16px',
            padding: '1.4rem',
            border: activeFilter === 'responded' ? '2px solid #16a34a' : '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '1.1rem'
          }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            ✅
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Responded
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2' }}>
              {respondedCount}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
        backgroundColor: '#ffffff',
        padding: '0.85rem 1.2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Inquiries', count: totalCount },
            { id: 'new', label: 'New Unread', count: newCount },
            { id: 'responded', label: 'Responded', count: respondedCount }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => {
                triggerNativeHaptic('light');
                setActiveFilter(filter.id);
              }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeFilter === filter.id ? '#0f172a' : 'transparent',
                color: activeFilter === filter.id ? '#ffffff' : '#64748b',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{filter.label}</span>
              <span style={{
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '8px',
                backgroundColor: activeFilter === filter.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                color: activeFilter === filter.id ? '#ffffff' : '#475569',
                fontWeight: '800'
              }}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '320px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.85rem 0.45rem 2.2rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: '#f8fafc'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* INQUIRIES LIST OR RICH EMPTY STATE */}
      {filteredInquiries.length === 0 ? (
        <div style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px dashed #cbd5e1',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            color: '#0052ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 10px 25px rgba(0, 82, 255, 0.15)'
          }}>
            📩
          </div>
          <div style={{ maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.4rem 0' }}>
              No Inquiries Found
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
              {searchQuery 
                ? `No inquiries match "${searchQuery}". Try clearing your search filter.`
                : `There are currently no ${activeFilter !== 'all' ? activeFilter : ''} inquiries. New client form submissions will appear here automatically.`}
            </p>
          </div>
          
          {searchQuery && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredInquiries.map((inq, index) => {
            const dateStr = new Date(inq.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const avatarBg = avatarGradients[index % avatarGradients.length];

            return (
              <div 
                key={inq.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: inq.status === 'New' ? '1.5px solid #0052ff' : '1px solid #e2e8f0',
                  padding: '1.6rem 1.8rem',
                  boxShadow: inq.status === 'New' ? '0 8px 24px rgba(0, 82, 255, 0.08)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Top Row: Client Info & Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  
                  {/* Left: Avatar & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: avatarBg,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '1.05rem',
                      letterSpacing: '0.05em',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {getInitials(inq.name)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {inq.name}
                        </h3>
                        <span style={{
                          padding: '0.2rem 0.65rem',
                          borderRadius: '8px',
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          backgroundColor: inq.status === 'New' ? '#eff6ff' : '#f0fdf4',
                          color: inq.status === 'New' ? '#0052ff' : '#15803d',
                          border: inq.status === 'New' ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: inq.status === 'New' ? '#0052ff' : '#16a34a'
                          }} />
                          {inq.status}
                        </span>
                      </div>
                      
                      <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', display: 'block', fontWeight: '500' }}>
                        Submitted on {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* Right: Quick Action Contact Chips */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {inq.email && (
                      <a 
                        href={`mailto:${inq.email}`} 
                        title="Send Email"
                        style={{
                          padding: '0.45rem 0.85rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '10px',
                          color: '#0f172a',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          textDecoration: 'none',
                          border: '1px solid #cbd5e1',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        ✉ {inq.email}
                      </a>
                    )}
                    {inq.phone && (
                      <a 
                        href={`tel:${inq.phone}`} 
                        title="Call Client"
                        style={{
                          padding: '0.45rem 0.85rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '10px',
                          color: '#0f172a',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          textDecoration: 'none',
                          border: '1px solid #cbd5e1',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        📞 {inq.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Service Interest Badge Box */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.08em' }}>
                    INTERESTED IN:
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
                    {inq.projectType || 'General Project Enquiry'}
                  </span>
                </div>

                {/* Project Details Message Box */}
                <div style={{
                  backgroundColor: '#ffffff',
                  padding: '1rem 1.1rem',
                  borderRadius: '12px',
                  borderLeft: '3px solid #0052ff',
                  backgroundColor: '#fafafa'
                }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>
                    PROJECT DETAILS & REQUIREMENTS
                  </span>
                  <p style={{ fontSize: '0.92rem', lineHeight: '1.65', color: '#334155', margin: 0, fontWeight: '500', whiteSpace: 'pre-line' }}>
                    {inq.details}
                  </p>
                </div>

                {/* Bottom Card Action Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: '0.2rem' }}>
                  <button
                    onClick={() => handleToggleStatus(inq.id)}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: inq.status === 'New' ? '#f0fdf4' : '#f1f5f9',
                      color: inq.status === 'New' ? '#15803d' : '#475569',
                      border: inq.status === 'New' ? '1px solid #bbf7d0' : '1px solid #cbd5e1',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {inq.status === 'New' ? '✓ Mark as Responded' : '↺ Mark as New'}
                  </button>

                  <button
                    onClick={() => handleDeleteInquiry(inq.id)}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REAL MANUAL LEAD ENTRY MODAL */}
      {showManualModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '540px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Log Client Inquiry
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>
                  Record a direct client phone, email, or meeting lead.
                </span>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: '#64748b', cursor: 'pointer', padding: '0.3rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Company / Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Global"
                    value={manualForm.company}
                    onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Project Service Type
                </label>
                <select
                  value={manualForm.projectType}
                  onChange={(e) => setManualForm({ ...manualForm, projectType: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Video Production">Video Production</option>
                  <option value="AI Video Production">AI Video Production</option>
                  <option value="Motion Graphics">Motion Graphics</option>
                  <option value="Branding & Identity">Branding & Identity</option>
                  <option value="Web Design & Development">Web Design & Development</option>
                  <option value="Book Design & Publishing">Book Design & Publishing</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#334155', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Project Details / Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter project requirements or inquiry notes..."
                  value={manualForm.details}
                  onChange={(e) => setManualForm({ ...manualForm, details: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  style={{ padding: '0.6rem 1.2rem', backgroundColor: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.5rem', backgroundColor: '#0052ff', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 82, 255, 0.25)' }}
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;

