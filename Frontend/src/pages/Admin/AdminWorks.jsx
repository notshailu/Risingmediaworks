import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../../data/dummyData';

const AdminWorks = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchWorks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/works');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setWorks(data);
        } else {
          setWorks(projectsData);
        }
      } else {
        setWorks(projectsData);
      }
    } catch (error) {
      console.error('Error fetching works:', error);
      setWorks(projectsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      try {
        await fetch(`http://localhost:5000/api/works/${id}`, { method: 'DELETE' });
        fetchWorks(); // Refresh list
      } catch (error) {
        console.error('Error deleting work:', error);
      }
    }
  };

  const filterCategories = [
    { id: 'all', label: 'All Works' },
    { id: 'ai-videos', label: 'AI Videos' },
    { id: 'motion-graphics', label: 'Motion Graphics' },
    { id: 'greaves', label: 'Greaves Cotton' },
    { id: 'itoty', label: 'ITOTY Campaigns' },
    { id: 'nh-work', label: 'NH Group' }
  ];

  const filteredWorks = activeCategory === 'all'
    ? works
    : works.filter((w) => w.category === activeCategory);

  return (
    <div style={{ fontFamily: "'Manrope', -apple-system, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Works Directory
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.4rem 0 0 0', fontWeight: '500' }}>
            Manage video portfolios, motion graphic projects, and client brand showcases.
          </p>
        </div>
        <Link 
          to="/admin/works/new" 
          style={{ 
            padding: '0.65rem 1.4rem', 
            backgroundColor: '#0052ff', 
            color: '#ffffff', 
            textDecoration: 'none', 
            borderRadius: '10px', 
            fontWeight: '700', 
            fontSize: '0.88rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 14px rgba(0, 82, 255, 0.25)',
            transition: 'transform 0.15s ease'
          }}
        >
          + Add New Work
        </Link>
      </div>

      {/* Category Filter Pills Toolbar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginBottom: '2rem',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '0.85rem 1.2rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.5rem' }}>
          CATEGORY:
        </span>
        {filterCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isActive ? '#0f172a' : 'transparent',
                color: isActive ? '#ffffff' : '#64748b',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Loading works library...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredWorks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>No works found in this category.</p>
            </div>
          ) : (
            filteredWorks.map(work => (
              <div 
                key={work._id || work.id} 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: '1px solid #e2e8f0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ height: '190px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                  {work.image ? (
                    <img src={work.image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>No Thumbnail Preview</span>
                  )}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    borderRadius: '20px',
                    letterSpacing: '0.08em'
                  }}>
                    {(work.category || 'project').replace('-', ' ')}
                  </span>
                </div>

                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', fontWeight: '800', color: '#0f172a' }}>
                    {work.title}
                  </h3>
                  <span style={{ color: '#64748b', marginBottom: '0.8rem', fontSize: '0.82rem', fontWeight: '600' }}>
                    Client: <strong>{work.client || 'Rising Media Works'}</strong>
                  </span>
                  <p style={{ color: '#334155', fontSize: '0.85rem', marginBottom: '1.2rem', flex: 1, lineHeight: '1.55', fontWeight: '500' }}>
                    {work.description?.substring(0, 90)}...
                  </p>
                  
                  {work.videoUrl && (
                    <p style={{ fontSize: '0.75rem', color: '#0052ff', wordBreak: 'break-all', marginBottom: '1.2rem', fontWeight: '600' }}>
                      🔗 <a href={work.videoUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{work.videoUrl.substring(0, 45)}...</a>
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                    <Link 
                      to={`/admin/works/edit/${work._id || work.id}`} 
                      style={{ 
                        padding: '0.45rem 0.95rem', 
                        backgroundColor: '#f1f5f9', 
                        color: '#0f172a', 
                        borderRadius: '8px', 
                        textDecoration: 'none', 
                        fontSize: '0.8rem', 
                        fontWeight: '700' 
                      }}
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(work._id || work.id)} 
                      style={{ 
                        padding: '0.45rem 0.95rem', 
                        backgroundColor: '#fef2f2', 
                        color: '#dc2626', 
                        border: '1px solid #fecaca', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '0.8rem', 
                        fontWeight: '700' 
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminWorks;

