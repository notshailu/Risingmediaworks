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

  if (loading) return <p>Loading...</p>;

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    marginBottom: '1.5rem',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: '#000',
    fontFamily: 'inherit',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#333',
    fontWeight: '600',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
        <button onClick={() => navigate('/admin/works')} style={{ background: 'transparent', border: 'none', color: '#000', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>←</button>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#000', letterSpacing: '-1px' }}>{isEditMode ? 'Edit Work' : 'Add New Work'}</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
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
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Client / Producer</label>
            <input type="text" name="client" value={formData.client} onChange={handleChange} style={inputStyle} placeholder="e.g. Greaves Cotton" />
          </div>
          <div>
            <label style={labelStyle}>Video Link (YouTube, Instagram or Drive)</label>
            <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} style={inputStyle} placeholder="https://www.youtube.com/watch?..." />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Enter project description"></textarea>
        </div>

        <div>
          <label style={labelStyle}>Thumbnail / Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} style={{...inputStyle, padding: '0.65rem 1rem'}} />
          {isEditMode && formData.image && (
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-1rem', marginBottom: '1.5rem' }}>Current thumbnail will be kept if no new file is selected.</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" style={{ padding: '0.85rem 2rem', backgroundColor: '#000', color: '#fff', borderRadius: '4px', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#000'}>
            {isEditMode ? 'Save Changes' : 'Create Work'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkForm;
