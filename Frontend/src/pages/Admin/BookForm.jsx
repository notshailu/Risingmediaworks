import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    coverImage: ''
  });
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/books/${id}`);
          if (response.ok) {
            const data = await response.json();
            setFormData(data);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching book:', error);
          setLoading(false);
        }
      };
      fetchBook();
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
    const url = isEditMode ? `http://localhost:5000/api/books/${id}` : 'http://localhost:5000/api/books';
    const method = isEditMode ? 'PUT' : 'POST';

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('author', formData.author);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    
    if (file) {
      submitData.append('coverImage', file);
    } else if (formData.coverImage) {
      submitData.append('coverImage', formData.coverImage);
    }

    try {
      const response = await fetch(url, {
        method,
        body: submitData
      });

      if (response.ok) {
        navigate('/admin/books');
      } else {
        console.error('Failed to save book');
      }
    } catch (error) {
      console.error('Error saving book:', error);
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
        <button onClick={() => navigate('/admin/books')} style={{ background: 'transparent', border: 'none', color: '#000', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>←</button>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#000', letterSpacing: '-1px' }}>{isEditMode ? 'Edit Book' : 'Add New Book'}</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div>
          <label style={labelStyle}>Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="Enter book title" />
        </div>
        
        <div>
          <label style={labelStyle}>Author *</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} required style={inputStyle} placeholder="Enter author name" />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }} placeholder="Enter book description"></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Price ($)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} style={inputStyle} placeholder="29.99" />
          </div>
          <div>
            <label style={labelStyle}>Cover Image</label>
            <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} style={{...inputStyle, padding: '0.65rem 1rem'}} />
            {isEditMode && formData.coverImage && (
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-1rem', marginBottom: '1.5rem' }}>Current image will be kept if no new file is selected.</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" style={{ padding: '0.85rem 2rem', backgroundColor: '#000', color: '#fff', borderRadius: '4px', border: 'none', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#000'}>
            {isEditMode ? 'Save Changes' : 'Create Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
