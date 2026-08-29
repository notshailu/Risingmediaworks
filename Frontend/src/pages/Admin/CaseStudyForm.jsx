import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { caseStudiesData } from '../../data/dummyData';

const CaseStudyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    id: `case-study-${Date.now()}`,
    title: '',
    client: '',
    image: '',
    videoUrl: '',
    overview: '',
    problem: '',
    objective: '',
    challenges: '',
    strategy: '',
    creativeDirection: '',
    production: '',
    editing: '',
    results: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      try {
        const saved = JSON.parse(localStorage.getItem('rmw_case_studies') || '[]');
        const existing = saved.find(s => (s._id || s.id) === id) || caseStudiesData.find(s => (s._id || s.id) === id);
        if (existing) {
          setFormData({
            id: existing.id || id,
            title: existing.title || '',
            client: existing.client || '',
            image: existing.image || '',
            videoUrl: existing.videoUrl || '',
            overview: existing.overview || '',
            problem: existing.problem || '',
            objective: existing.objective || '',
            challenges: existing.challenges || '',
            strategy: existing.strategy || '',
            creativeDirection: existing.creativeDirection || '',
            production: existing.production || '',
            editing: existing.editing || '',
            results: existing.results || ''
          });
        }
      } catch (err) {
        console.error('Error loading case study for edit:', err);
      }
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update local storage state
      let saved = [];
      try {
        saved = JSON.parse(localStorage.getItem('rmw_case_studies') || '[]');
      } catch {
        saved = [...caseStudiesData];
      }

      if (saved.length === 0) {
        saved = [...caseStudiesData];
      }

      let updated = [];
      if (isEdit) {
        updated = saved.map(s => (s.id === formData.id || s._id === id) ? { ...s, ...formData } : s);
      } else {
        const newSlugId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `case-${Date.now()}`;
        const newStudy = { ...formData, id: newSlugId };
        updated = [newStudy, ...saved];
      }

      localStorage.setItem('rmw_case_studies', JSON.stringify(updated));

      // Attempt optional backend API sync
      try {
        const endpoint = isEdit ? `http://localhost:5000/api/case-studies/${id}` : 'http://localhost:5000/api/case-studies';
        const method = isEdit ? 'PUT' : 'POST';
        await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch {
        // Backend optional fallback
      }

      alert(`Case Study ${isEdit ? 'Updated' : 'Created'} Successfully!`);
      navigate('/admin/case-studies');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save case study.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e0e0e0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #eeeeee', paddingBottom: '1.2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#000', margin: 0 }}>
          {isEdit ? 'Edit Case Study' : 'Create New Case Study'}
        </h1>
        <Link to="/admin/case-studies" style={{ color: '#0052ff', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
          ← Back to Directory
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Case Study Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Mahindra EV Commercial Launch"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Client Name *
            </label>
            <input
              type="text"
              name="client"
              required
              value={formData.client}
              onChange={handleChange}
              placeholder="e.g. Mahindra & Mahindra"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Cover Image / Thumbnail URL *
            </label>
            <input
              type="text"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              placeholder="e.g. https://img.youtube.com/vi/w_xOxPuBmjk/hqdefault.jpg"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Video Link (Optional)
            </label>
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="e.g. https://www.youtube.com/watch?v=w_xOxPuBmjk"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
            Project Overview *
          </label>
          <textarea
            name="overview"
            required
            rows="3"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Detailed overview of the case study project..."
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Client Problem
            </label>
            <textarea
              name="problem"
              rows="3"
              value={formData.problem}
              onChange={handleChange}
              placeholder="What challenge did the client face?"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Client Objective
            </label>
            <textarea
              name="objective"
              rows="3"
              value={formData.objective}
              onChange={handleChange}
              placeholder="What goals did the client set out to achieve?"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Creative Strategy
            </label>
            <textarea
              name="strategy"
              rows="3"
              value={formData.strategy}
              onChange={handleChange}
              placeholder="Strategic direction and campaign planning..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '0.4rem' }}>
              Results & Impact
            </label>
            <textarea
              name="results"
              rows="3"
              value={formData.results}
              onChange={handleChange}
              placeholder="e.g. 2.5M multi-platform views, 400% engagement lift..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/case-studies')}
            style={{ padding: '0.85rem 1.8rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#ffffff', color: '#333', cursor: 'pointer', fontWeight: '700' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: '0.85rem 2.2rem', borderRadius: '8px', border: 'none', backgroundColor: '#0052ff', color: '#ffffff', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 12px rgba(0,82,255,0.3)' }}
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Case Study'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseStudyForm;
