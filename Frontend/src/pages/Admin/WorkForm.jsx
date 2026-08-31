import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WorkForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    category: 'ai-videos', // default category
    client: '',
    description: '',
    videoUrl: '',
    image: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchWork = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/works/${id}`);
          if (response.ok) {
            const data = await response.json();
            setFormData(data);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching work:', error);
          setLoading(false);
        }
      };
      fetchWork();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditMode ? `http://localhost:5000/api/works/${id}` : 'http://localhost:5000/api/works';
    const method = isEditMode ? 'PUT' : 'POST';

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('category', formData.category);
    submitData.append('client', formData.client);
    submitData.append('description', formData.description);
    submitData.append('videoUrl', formData.videoUrl);
    
    if (file) {
      submitData.append('image', file);
    } else if (formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      const response = await fetch(url, {
        method,
        body: submitData
      });

      if (response.ok) {
        navigate('/admin/works');
      } else {
        console.error('Failed to save work');
      }
    } catch (error) {
      console.error('Error saving work:', error);
    }
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Loading form...</div>;

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    color: '#0f172a',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    color: '#334155',
    fontWeight: '700',
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  };

  return (
    <div style={{ fontFamily: "'Manrope', -apple-system, sans-serif", maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '0.75rem' }}>
        <button 
          onClick={() => navigate('/admin/works')} 
          style={{ 
            background: '#ffffff', 
            border: '1px solid #cbd5e1', 
            color: '#0f172a', 
            fontSize: '1rem', 
            cursor: 'pointer', 
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700'
          }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
          {isEditMode ? 'Edit Work' : 'Add New Work'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="Enter work title" />
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
              <option value="ai-videos">AI Videos</option>
              <option value="motion-graphics">Motion Graphics</option>
              <option value="greaves">Greaves Cotton</option>
              <option value="itoty">ITOTY Campaigns</option>
              <option value="nh-work">NH Group Work</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Client / Producer</label>
            <input type="text" name="client" value={formData.client} onChange={handleChange} style={inputStyle} placeholder="e.g. Greaves Cotton" />
          </div>
          <div>
            <label style={labelStyle}>Video Link (YouTube, Vimeo or Drive)</label>
            <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} style={inputStyle} placeholder="https://www.youtube.com/watch?..." />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Enter project description"></textarea>
        </div>

        <div>
          <label style={labelStyle}>Thumbnail Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} style={{ ...inputStyle, backgroundColor: '#ffffff' }} />
          {isEditMode && formData.image && (
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '-0.8rem', marginBottom: '1.25rem' }}>Current thumbnail will be preserved if no new file is selected.</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <button 
            type="button"
            onClick={() => navigate('/admin/works')}
            style={{ 
              padding: '0.65rem 1.4rem', 
              backgroundColor: '#f1f5f9', 
              color: '#334155', 
              borderRadius: '10px', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '0.88rem', 
              cursor: 'pointer' 
            }}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            style={{ 
              padding: '0.65rem 1.6rem', 
              backgroundColor: '#0052ff', 
              color: '#ffffff', 
              borderRadius: '10px', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '0.88rem', 
              cursor: 'pointer', 
              boxShadow: '0 4px 14px rgba(0, 82, 255, 0.25)' 
            }}
          >
            {isEditMode ? 'Save Changes' : 'Create Work'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkForm;

