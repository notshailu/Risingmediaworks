import React, { useState, useEffect } from 'react';

// Initial dummy inquiries fallback if localStorage is empty
const initialInquiries = [
  {
    id: 'inq-101',
    name: 'Vikram Sharma',
    email: 'vikram.sharma@greavescotton.com',
    phone: '+91 98201 44521',
    projectType: 'Video Production',
    details: 'We need a high-end corporate brand film & commercial for our upcoming 3-wheeler EV launch in Q3. Looking for end-to-end scriptwriting, shooting, and motion post-production.',
    createdAt: '2026-08-28T14:30:00Z',
    status: 'New'
  },
  {
    id: 'inq-102',
    name: 'Ananya Roy',
    email: 'ananya@designstudio.io',
    phone: '+91 97112 88904',
    projectType: 'Branding & Creative Design',
    details: 'Looking to overhaul our digital brand identity and create a comprehensive design system for our mobile application and social channels.',
    createdAt: '2026-08-27T09:15:00Z',
    status: 'Responded'
  },
  {
    id: 'inq-103',
    name: 'Rohan Mehta',
    email: 'rohan.m@itoty.in',
    phone: '+91 98840 12390',
    projectType: 'Motion Graphics',
    details: 'Need 3D product motion graphics animation for our annual tractor of the year award ceremony intro sequence.',
    createdAt: '2026-08-26T18:45:00Z',
    status: 'New'
  }
];

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = () => {
    try {
      const stored = localStorage.getItem('rmw_inquiries');
      if (stored) {
        setInquiries(JSON.parse(stored));
      } else {
        localStorage.setItem('rmw_inquiries', JSON.stringify(initialInquiries));
        setInquiries(initialInquiries);
      }
    } catch (e) {
      console.error('Error fetching inquiries:', e);
      setInquiries(initialInquiries);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: inq.status === 'New' ? 'Responded' : 'New' };
      }
      return inq;
    });
    setInquiries(updated);
    localStorage.setItem('rmw_inquiries', JSON.stringify(updated));
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      const updated = inquiries.filter(inq => inq.id !== id);
      setInquiries(updated);
      localStorage.setItem('rmw_inquiries', JSON.stringify(updated));
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (activeFilter === 'new') return inq.status === 'New';
    if (activeFilter === 'responded') return inq.status === 'Responded';
    return true;
  });

  const newCount = inquiries.filter(i => i.status === 'New').length;
  const respondedCount = inquiries.filter(i => i.status === 'Responded').length;

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Header */}
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#000000', letterSpacing: '-0.02em', margin: 0 }}>
            Client Inquiries
          </h1>
          <p style={{ color: '#666666', fontSize: '0.9rem', margin: '0.4rem 0 0 0' }}>
            All contact form project inquiries submitted through the website.
          </p>
        </div>

        {/* Stats Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', color: '#000' }}>
            Total: {inquiries.length}
          </span>
          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
            New: {newCount}
          </span>
          <span style={{ backgroundColor: '#f0fdf4', color: '#15803d', padding: '0.4rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>
            Responded: {respondedCount}
          </span>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Inquiries' },
          { id: 'new', label: `New (${newCount})` },
          { id: 'responded', label: `Responded (${respondedCount})` }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '20px',
              border: activeFilter === filter.id ? '1px solid #000000' : '1px solid #e0e0e0',
              backgroundColor: activeFilter === filter.id ? '#000000' : '#ffffff',
              color: activeFilter === filter.id ? '#ffffff' : '#444444',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Inquiries Cards Grid / List */}
      {filteredInquiries.length === 0 ? (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e5e5' }}>
          <p style={{ color: '#888888', fontSize: '1rem', margin: 0 }}>No inquiries found under this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredInquiries.map((inq) => {
            const dateStr = new Date(inq.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={inq.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: inq.status === 'New' ? '1.5px solid #0052ff' : '1px solid #e5e5e5',
                  padding: '1.75rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  position: 'relative'
                }}
              >
                {/* Top Row: Client Info & Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000000', margin: 0 }}>
                        {inq.name}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        backgroundColor: inq.status === 'New' ? '#0052ff' : '#10b981',
                        color: '#ffffff'
                      }}>
                        {inq.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#888888', marginTop: '0.25rem', display: 'block' }}>
                      Submitted on {dateStr}
                    </span>
                  </div>

                  {/* Quick Contact Links */}
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {inq.email && (
                      <a 
                        href={`mailto:${inq.email}`} 
                        style={{
                          padding: '0.4rem 0.85rem',
                          backgroundColor: '#f5f5f7',
                          borderRadius: '8px',
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textDecoration: 'none',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        ✉ {inq.email}
                      </a>
                    )}
                    {inq.phone && (
                      <a 
                        href={`tel:${inq.phone}`} 
                        style={{
                          padding: '0.4rem 0.85rem',
                          backgroundColor: '#f5f5f7',
                          borderRadius: '8px',
                          color: '#000000',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textDecoration: 'none',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        📞 {inq.phone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Type */}
                <div style={{ backgroundColor: '#fafaf9', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #f0f0f0' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.1em', display: 'block', marginBottom: '0.2rem' }}>
                    INTERESTED IN SERVICE
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#18181b' }}>
                    {inq.projectType || 'General Project Enquiry'}
                  </span>
                </div>

                {/* Details Message */}
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>
                    PROJECT DETAILS & MESSAGE
                  </span>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.65', color: '#333333', margin: 0, fontWeight: '400', whiteSpace: 'pre-line' }}>
                    {inq.details}
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleToggleStatus(inq.id)}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '8px',
                      backgroundColor: inq.status === 'New' ? '#f0fdf4' : '#f5f5f7',
                      color: inq.status === 'New' ? '#15803d' : '#666666',
                      border: '1px solid #e0e0e0',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
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
                      fontWeight: '600',
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
    </div>
  );
};

export default AdminInquiries;
