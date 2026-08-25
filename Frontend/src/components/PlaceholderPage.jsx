import React, { useEffect } from 'react';

const PlaceholderPage = ({ title, data, theme = 'dark' }) => {
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }

    // Cleanup on unmount so the theme doesn't bleed into other pages if we navigate away
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, [theme]);

  // Helper to render cards for arrays of data (like projects, services list)
  const renderGrid = (items) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
      width: '100%',
      maxWidth: '1200px',
      marginTop: '3rem',
      paddingBottom: '4rem'
    }}>
      {items.map((item, idx) => (
        <div key={item.id || idx} style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, background-color 0.4s ease, border-color 0.4s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {item.image && (
            <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ padding: '1.5rem' }}>
            {item.category && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>{item.category.replace('-', ' ')}</div>}
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-color)' }}>{item.title}</h3>
            {(item.description || item.overview) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {item.description || item.overview}
              </p>
            )}
            {item.author && (
              <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 500 }}>
                By {item.author}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Helper to render single object details (like a specific service or case study)
  const renderDetail = (item) => (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      marginTop: '3rem',
      textAlign: 'left',
      backgroundColor: 'var(--card-bg)',
      padding: '3rem',
      borderRadius: '16px',
      border: '1px solid var(--card-border)',
      transition: 'background-color 0.4s ease, border-color 0.4s ease'
    }}>
      {item.image && (
        <img src={item.image} alt={item.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem' }} />
      )}
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--text-color)' }}>{item.title}</h2>
      {item.client && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}><strong>Client:</strong> {item.client}</p>}
      {item.author && <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}><strong>Author:</strong> {item.author}</p>}
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        {item.overview || item.description || item.objective}
      </p>
      
      {item.process && (
        <div>
          <h4 style={{ color: 'var(--text-color)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>Our Process</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {item.process.map((step, i) => (
              <span key={i} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'var(--card-border)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-color)' }}>
                {step}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{
      width: '100%', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      flexDirection: 'column',
      padding: '120px 2rem 60px 2rem',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-0.02em', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-color)' }}>
          {title}
        </h1>
        {!data && <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Page content coming soon...</p>}
      </div>
      
      {/* If data is an array, render a grid of cards. If it's an object, render a detail view. */}
      {data && Array.isArray(data) && data.length > 0 && renderGrid(data)}
      {data && !Array.isArray(data) && renderDetail(data)}
      
    </div>
  );
};

export default PlaceholderPage;
