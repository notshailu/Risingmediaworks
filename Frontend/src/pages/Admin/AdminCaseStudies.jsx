import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { caseStudiesData } from '../../data/dummyData';

const AdminCaseStudies = () => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/case-studies');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setStudies(data);
          localStorage.setItem('rmw_case_studies', JSON.stringify(data));
        } else {
          loadFromLocal();
        }
      } else {
        loadFromLocal();
      }
    } catch {
      loadFromLocal();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocal = () => {
    try {
      const saved = localStorage.getItem('rmw_case_studies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudies(parsed);
          return;
        }
      }
      setStudies(caseStudiesData);
      localStorage.setItem('rmw_case_studies', JSON.stringify(caseStudiesData));
    } catch {
      setStudies(caseStudiesData);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      const updated = studies.filter(s => (s._id || s.id) !== id);
      setStudies(updated);
      localStorage.setItem('rmw_case_studies', JSON.stringify(updated));

      try {
        await fetch(`http://localhost:5000/api/case-studies/${id}`, { method: 'DELETE' });
      } catch {
        // Backend optional
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Manrope', -apple-system, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Case Studies Directory
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.4rem 0 0 0', fontWeight: '500' }}>
            Manage, edit, and publish deep-dive client success stories and campaign breakdowns.
          </p>
        </div>

        <Link 
          to="/admin/case-studies/new" 
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
          + Add New Case Study
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Loading case studies...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {studies.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>No case studies found. Click "+ Add New Case Study" to create one.</p>
            </div>
          ) : (
            studies.map((study) => (
              <div 
                key={study._id || study.id} 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  border: '1px solid #e2e8f0', 
                  display: 'flex', 
                  flexDirection: 'column',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ height: '190px', backgroundColor: '#f1f5f9', position: 'relative' }}>
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em'
                  }}>
                    {study.client}
                  </span>
                </div>

                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: '1.3' }}>
                    {study.title}
                  </h3>

                  <p style={{ color: '#334155', fontSize: '0.85rem', lineHeight: '1.55', margin: '0 0 1.2rem 0', flex: 1, fontWeight: '500' }}>
                    {study.overview ? study.overview.substring(0, 100) + '...' : 'No overview available.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                    <Link 
                      to={`/case-studies/${study.id}`} 
                      target="_blank"
                      style={{ fontSize: '0.8rem', color: '#0052ff', textDecoration: 'none', fontWeight: '700' }}
                    >
                      View Live ↗
                    </Link>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/admin/case-studies/edit/${study._id || study.id}`} 
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
                        onClick={() => handleDelete(study._id || study.id)} 
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
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCaseStudies;

