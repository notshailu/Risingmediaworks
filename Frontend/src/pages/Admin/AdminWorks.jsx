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
    <div>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000', letterSpacing: '-1px' }}>Works Directory</h1>
        <Link to="/admin/works/new" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: '600', transition: 'background 0.2s', display: 'inline-block' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#000'}>
          + Add New Work
        </Link>
      </div>

      {/* Admin Category Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.5rem' }}>
          Filter By:
        </span>
        {filterCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                border: isActive ? '1px solid #000' : '1px solid #e0e0e0',
                backgroundColor: isActive ? '#000' : '#fff',
                color: isActive ? '#fff' : '#444',
                fontSize: '0.8rem',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.color = '#000';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.color = '#444';
                }
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Loading works...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredWorks.length === 0 ? (
            <p style={{ color: '#666' }}>No works found in this category.</p>
          ) : (
            filteredWorks.map(work => (
              <div key={work._id || work.id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e0e0e0', position: 'relative' }}>
                  {work.image ? (
                    <img src={work.image} alt={work.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#999', fontSize: '0.9rem' }}>No Thumbnail</span>
                  )}
                  <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '0.3rem 0.8rem', backgroundColor: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.7rem', textTransform: 'uppercase', borderRadius: '20px', letterSpacing: '0.1em' }}>
                    {(work.category || 'project').replace('-', ' ')}
                  </span>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', fontWeight: 'bold', color: '#000' }}>{work.title}</h3>
                  <p style={{ color: '#666', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '500' }}>Client: {work.client || 'Rising Media Works'}</p>
                  <p style={{ color: '#444', fontSize: '0.85rem', marginBottom: '1.2rem', flex: 1, lineHeight: '1.5' }}>{work.description?.substring(0, 80)}...</p>
                  
                  {work.videoUrl && (
                    <p style={{ fontSize: '0.75rem', color: '#0066cc', wordBreak: 'break-all', marginBottom: '1.2rem' }}>
                      Link: <a href={work.videoUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{work.videoUrl.substring(0, 45)}...</a>
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: 'auto' }}>
                    <Link to={`/admin/works/edit/${work._id || work.id}`} style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#000', border: '1px solid #000', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#000'; e.target.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#000'; }}>Edit</Link>
                    <button onClick={() => handleDelete(work._id || work.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s' }}
                      onMouseOver={(e) => { e.target.style.backgroundColor = '#d32f2f'; e.target.style.color = '#fff'; }}
                      onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#d32f2f'; }}>Delete</button>
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
