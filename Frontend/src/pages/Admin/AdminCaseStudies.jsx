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
        setStudies(JSON.parse(saved));
      } else {
        setStudies(caseStudiesData);
        localStorage.setItem('rmw_case_studies', JSON.stringify(caseStudiesData));
      }
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#000', letterSpacing: '-1px', margin: 0 }}>
            Case Studies Directory
          </h1>
          <p style={{ color: '#666', margin: '0.4rem 0 0 0', fontSize: '0.9rem' }}>
            Manage, add, edit, and publish deep-dive agency case studies.
          </p>
        </div>

        <Link 
          to="/admin/case-studies/new" 
          style={{ 
            padding: '0.85rem 1.6rem', 
            backgroundColor: '#000000', 
            color: '#ffffff', 
            textDecoration: 'none', 
            borderRadius: '8px', 
            fontWeight: '700', 
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          + Add New Case Study
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Loading case studies...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {studies.length === 0 ? (
            <p style={{ color: '#666' }}>No case studies found. Click "+ Add New Case Study" to create one.</p>
          ) : (
            studies.map((study) => (
              <div 
                key={study._id || study.id} 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid #e0e0e0', 
                  display: 'flex', 
                  flexDirection: 'column',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ height: '200px', backgroundColor: '#f0f0f0', position: 'relative' }}>
                  <img 
                    src={study.image} 
                    alt={study.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: '#ffffff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    {study.client}
                  </span>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#000000', margin: '0 0 0.5rem 0', lineHeight: '1.3' }}>
                    {study.title}
                  </h3>

                  <p style={{ color: '#555555', fontSize: '0.88rem', lineHeight: '1.55', margin: '0 0 1.5rem 0', flex: 1 }}>
                    {study.overview ? study.overview.substring(0, 110) + '...' : 'No overview available.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eeeeee' }}>
                    <Link 
                      to={`/case-studies/${study.id}`} 
                      target="_blank"
                      style={{ fontSize: '0.8rem', color: '#0052ff', textDecoration: 'none', fontWeight: '600' }}
                    >
                      View Live ↗
                    </Link>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/admin/case-studies/edit/${study._id || study.id}`} 
                        style={{
                          padding: '0.45rem 0.9rem',
                          backgroundColor: '#ffffff',
                          color: '#000000',
                          border: '1px solid #000000',
                          borderRadius: '6px',
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
                          padding: '0.45rem 0.9rem',
                          backgroundColor: '#ffffff',
                          color: '#d32f2f',
                          border: '1px solid #d32f2f',
                          borderRadius: '6px',
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
