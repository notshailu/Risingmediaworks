import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const SAMPLE_PRESETS = [
  {
    title: 'The Architecture of Modern Typography',
    author: 'Elena Rostova',
    description: 'A comprehensive editorial study on Swiss grid systems, asymmetric typography, and architectural book design across physical and digital media.',
    price: '29.99',
    buyUrl: 'https://www.amazon.com/dp/B000TEST123',
    category: 'academic-books',
    printSpecs: '7x10 inch print, white paperweight',
    gridSpec: '12-Column Editorial',
    publishingSpec: 'KDP & IngramSpark',
    paperSpec: 'Cream 120gsm / Matte',
    finalBookUrl: 'https://risingmediaworks.com/books/sample-preview.pdf'
  },
  {
    title: 'Generative Media & Editorial Systems',
    author: 'Marcus Vance',
    description: 'Exploring neural aesthetics, algorithmic layout generation, and dynamic print workflows for contemporary creative studios.',
    price: '34.50',
    buyUrl: 'https://www.amazon.com/dp/B000TEST456',
    category: 'technical-books',
    printSpecs: '8.5x11 inch, Hardcover',
    gridSpec: 'Modular 16-Column Grid',
    publishingSpec: 'IngramSpark Hardcover',
    paperSpec: 'Art Silk 150gsm Coated',
    finalBookUrl: 'https://risingmediaworks.com/books/generative-systems.pdf'
  },
  {
    title: 'Minimalist Book Design & Production',
    author: 'Jane Doe',
    description: 'Essential principles of tactile cover design, micro-typography, and high-end print production for independent publishers.',
    price: '24.99',
    buyUrl: 'https://www.amazon.com/dp/B000TEST789',
    category: 'publishing',
    printSpecs: '6x9 inch print, cream paperweight',
    gridSpec: 'Asymmetric 8-Column Grid',
    publishingSpec: 'KDP Paperback & Hardcover',
    paperSpec: 'Munken Premium 115gsm',
    finalBookUrl: 'https://risingmediaworks.com/books/minimalist-design.pdf'
  }
];

// Helper to generate a realistic demo book cover PNG file in-memory
const createSampleCoverFile = (title, author) => {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 900;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);

      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, 600, 900);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 900);

      // Architectural grid accent pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 40; x < 600; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 900);
        ctx.stroke();
      }
      for (let y = 40; y < 900; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }

      // Border frame
      ctx.strokeStyle = '#0052ff';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, 528, 828);

      // Header label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('RISING MEDIA WORKS · SPECIAL EDITIONS', 300, 100);

      // Title (auto-wrapped)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      const words = (title || 'Sample Book').split(' ');
      let line = '';
      let yPos = 400;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 440 && n > 0) {
          ctx.fillText(line.trim(), 300, yPos);
          line = words[n] + ' ';
          yPos += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 300, yPos);

      // Author
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(`By ${author || 'Rising Editorial'}`, 300, yPos + 60);

      // Footer tag
      ctx.fillStyle = '#64748b';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('ARCHITECTURAL PUBLISHING ARCHIVE · 2026', 300, 810);

      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const fileName = `${(title || 'sample-book').toLowerCase().replace(/[^a-z0-9]/g, '-')}-cover.png`;
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve({ file, previewUrl: canvas.toDataURL('image/png') });
      }, 'image/png');
    } catch (err) {
      console.warn('Could not generate sample cover canvas:', err);
      resolve(null);
    }
  });
};

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Detect localhost / local development environment
  const isLocalhost = Boolean(
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.endsWith('.localhost') ||
     window.location.port === '5173' ||
     window.location.port === '5000' ||
     import.meta.env.DEV)
  );

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/books/${id}`);
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
            if (data.coverImage) {
              setPreviewUrl(data.coverImage);
            }
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching book:', error);
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, isEditMode, API_BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected || null);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleAutofill = async () => {
    setStatusMessage({ type: '', text: '' });
    const preset = SAMPLE_PRESETS[presetIndex % SAMPLE_PRESETS.length];
    setPresetIndex(prev => prev + 1);

    setFormData(prev => ({
      ...prev,
      ...preset,
      coverImage: ''
    }));

    // Generate a valid PNG cover image file so form can be submitted immediately
    const sampleCover = await createSampleCoverFile(preset.title, preset.author);
    if (sampleCover) {
      setFile(sampleCover.file);
      setPreviewUrl(sampleCover.previewUrl);
    }

    setStatusMessage({
      type: 'info',
      text: `⚡ Autofilled with "${preset.title}". Click again to cycle presets, or click "Create Book" to test!`
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    // Ensure buyUrl and finalBookUrl have http/https prefix
    let buyUrl = (formData.buyUrl || '').trim();
    if (buyUrl && !/^https?:\/\//i.test(buyUrl)) {
      buyUrl = `https://${buyUrl}`;
    }
    let finalBookUrl = (formData.finalBookUrl || '').trim();
    if (finalBookUrl && !/^https?:\/\//i.test(finalBookUrl)) {
      finalBookUrl = `https://${finalBookUrl}`;
    }

    const url = isEditMode ? `${API_BASE_URL}/api/books/${id}` : `${API_BASE_URL}/api/books`;
    const method = isEditMode ? 'PUT' : 'POST';

    const submitData = new FormData();
    submitData.append('title', formData.title.trim());
    submitData.append('author', formData.author.trim());
    submitData.append('description', formData.description.trim());
    submitData.append('price', formData.price);
    submitData.append('buyUrl', buyUrl);
    submitData.append('category', formData.category.trim());
    submitData.append('printSpecs', formData.printSpecs.trim());
    submitData.append('gridSpec', formData.gridSpec.trim());
    submitData.append('publishingSpec', formData.publishingSpec.trim());
    submitData.append('paperSpec', formData.paperSpec.trim());
    submitData.append('finalBookUrl', finalBookUrl);
    
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
        setStatusMessage({
          type: 'success',
          text: `✔ Book ${isEditMode ? 'updated' : 'created'} successfully! Redirecting to catalog...`
        });
        setTimeout(() => {
          navigate('/admin/books');
        }, 1200);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errText = errorData.message || errorData.error || `Server returned error (${response.status})`;
        setStatusMessage({
          type: 'error',
          text: `✘ Failed to save book: ${errText}`
        });
      }
    } catch (error) {
      console.error('Error saving book:', error);
      setStatusMessage({
        type: 'error',
        text: `✘ Connection error: Unable to reach backend server at ${API_BASE_URL}. Please ensure your backend is running ('node server.js' or 'npm run dev' in Backend directory).`
      });
    } finally {
      setSubmitting(false);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/admin/books')} 
            style={{ background: 'transparent', border: 'none', color: '#000', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}
            title="Back to Books Directory"
          >
            ←
          </button>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#000', letterSpacing: '-1px', margin: 0 }}>
            {isEditMode ? 'Edit Book Details' : 'Add New Book'}
          </h1>
        </div>

        {/* Localhost Auto-fill Button */}
        {isLocalhost && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={handleAutofill}
              title="Automatically populate form with realistic sample book data for testing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.25rem',
                backgroundColor: '#0052ff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 82, 255, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0040d0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0052ff'}
            >
              <span>⚡ Auto-fill Test Data</span>
            </button>
          </div>
        )}
      </div>

      {/* Status Notifications Banner */}
      {statusMessage.text && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.92rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: statusMessage.type === 'error' ? '#fef2f2' : statusMessage.type === 'success' ? '#f0fdf4' : '#eff6ff',
          color: statusMessage.type === 'error' ? '#b91c1c' : statusMessage.type === 'success' ? '#15803d' : '#1d4ed8',
          border: `1px solid ${statusMessage.type === 'error' ? '#fecaca' : statusMessage.type === 'success' ? '#bbf7d0' : '#bfdbfe'}`
        }}>
          <span>{statusMessage.text}</span>
          <button 
            type="button" 
            onClick={() => setStatusMessage({ type: '', text: '' })}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '1rem' }}
          >
            ×
          </button>
        </div>
      )}

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
            type="text" 
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
            <label style={labelStyle}>Price (₹ INR)</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} style={inputStyle} placeholder="e.g. 499 or 999" />
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
            <input 
              type="file" 
              name="coverImage" 
              accept="image/png,image/jpeg,image/webp,image/jpg" 
              onChange={handleFileChange} 
              style={{ ...inputStyle, padding: '0.65rem 1rem' }} 
            />
            {file && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                {previewUrl && (
                  <img src={previewUrl} alt="Cover Preview" style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '3px', border: '1px solid #cbd5e1' }} />
                )}
                <div style={{ flex: 1, fontSize: '0.82rem', color: '#166534' }}>
                  <strong>Selected File:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setPreviewUrl(''); }}
                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                >
                  Remove
                </button>
              </div>
            )}
            {isEditMode && formData.coverImage && !file && (
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-0.8rem', marginBottom: '1rem' }}>
                Current image will be retained if unchanged.
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>High-Res / PDF Link (Optional)</label>
            <input 
              type="text" 
              name="finalBookUrl" 
              value={formData.finalBookUrl} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="https://..." 
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button 
            type="submit" 
            disabled={submitting}
            style={{ 
              padding: '0.9rem 2.5rem', 
              backgroundColor: submitting ? '#64748b' : '#000', 
              color: '#fff', 
              borderRadius: '4px', 
              border: 'none', 
              fontWeight: '600', 
              fontSize: '0.95rem', 
              cursor: submitting ? 'not-allowed' : 'pointer', 
              transition: 'background 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => { if (!submitting) e.target.style.backgroundColor = '#333'; }}
            onMouseOut={(e) => { if (!submitting) e.target.style.backgroundColor = '#000'; }}
          >
            {submitting ? (
              <>
                <span style={{ 
                  display: 'inline-block', 
                  width: '14px', 
                  height: '14px', 
                  border: '2px solid #ffffff', 
                  borderTopColor: 'transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 0.8s linear infinite' 
                }} />
                <span>{isEditMode ? 'Saving Changes...' : 'Creating Book...'}</span>
              </>
            ) : (
              <span>{isEditMode ? 'Save Changes' : 'Create Book'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
