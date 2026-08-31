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
    coverImage: '',
    buyUrl: '',
    category: '',
    printSpecs: '',
    gridSpec: '',
    publishingSpec: '',
    paperSpec: '',
    finalBookUrl: ''
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
            setFormData({
              title: data.title || '',
              author: data.author || '',
              description: data.description || '',
              price: data.price || '',
              coverImage: data.coverImage || '',
              buyUrl: data.buyUrl || '',
              category: data.category || '',
              printSpecs: data.printSpecs || '',
              gridSpec: data.gridSpec || '',
              publishingSpec: data.publishingSpec || '',
              paperSpec: data.paperSpec || '',
              finalBookUrl: data.finalBookUrl || ''
            });
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
    submitData.append('buyUrl', formData.buyUrl);
    submitData.append('category', formData.category);
    submitData.append('printSpecs', formData.printSpecs);
    submitData.append('gridSpec', formData.gridSpec);
    submitData.append('publishingSpec', formData.publishingSpec);
    submitData.append('paperSpec', formData.paperSpec);
    submitData.append('finalBookUrl', formData.finalBookUrl);
    
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

  if (loading) return <p style={{ padding: '2rem' }}>Loading book details...</p>;

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    marginBottom: '1.25rem',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: '#000',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    color: '#333',
    fontWeight: '600',
    fontSize: '0.88rem'
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem' }}>
        <button onClick={() => navigate('/admin/books')} style={{ background: 'transparent', border: 'none', color: '#000', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>←</button>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#000', letterSpacing: '-1px' }}>{isEditMode ? 'Edit Book Details' : 'Add New Book'}</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Publishing Architectures" />
          </div>
          
          <div>
            <label style={labelStyle}>Author *</label>
            <input type="text" name="author" value={formData.author} onChange={handleChange} required style={inputStyle} placeholder="e.g. Elena Rostova" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Purchasing Link (Buy Now URL) 🔗 *</label>
          <input 
            type="url" 
            name="buyUrl" 
            value={formData.buyUrl} 
            onChange={handleChange} 
            style={inputStyle} 
            placeholder="https://www.amazon.com/dp/your-book-id or store link" 
          />
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Enter book description & editorial overview"></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} style={inputStyle} placeholder="e.g. publishing, technical-books, academic-books" />
          </div>

          <div>
            <label style={labelStyle}>Price ($)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} style={inputStyle} placeholder="29.99" />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: '#111' }}>Editorial & Technical Specifications</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Format Specs</label>
              <input type="text" name="printSpecs" value={formData.printSpecs} onChange={handleChange} style={inputStyle} placeholder="e.g. 7x10 inch print, white paperweight" />
            </div>

            <div>
              <label style={labelStyle}>Grid Layout Spec</label>
              <input type="text" name="gridSpec" value={formData.gridSpec} onChange={handleChange} style={inputStyle} placeholder="e.g. 12-Column Editorial" />
            </div>

            <div>
              <label style={labelStyle}>Publishing Spec</label>
              <input type="text" name="publishingSpec" value={formData.publishingSpec} onChange={handleChange} style={inputStyle} placeholder="e.g. KDP & IngramSpark" />
            </div>

            <div>
              <label style={labelStyle}>Paper & Finish Spec</label>
              <input type="text" name="paperSpec" value={formData.paperSpec} onChange={handleChange} style={inputStyle} placeholder="e.g. Cream 120gsm / Matte" />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Cover Image</label>
            <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} style={{...inputStyle, padding: '0.65rem 1rem'}} />
            {isEditMode && formData.coverImage && (
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-0.8rem', marginBottom: '1rem' }}>Current image will be retained if unchanged.</p>
            )}
          </div>

          <div>
            <label style={labelStyle}>High-Res / PDF Link (Optional)</label>
            <input type="url" name="finalBookUrl" value={formData.finalBookUrl} onChange={handleChange} style={inputStyle} placeholder="https://..." />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" style={{ padding: '0.9rem 2.5rem', backgroundColor: '#000', color: '#fff', borderRadius: '4px', border: 'none', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.2s' }}
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
