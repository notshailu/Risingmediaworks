import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { booksData } from '../../data/dummyData';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setBooks(data);
        } else {
          setBooks(booksData);
        }
      } else {
        setBooks(booksData);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks(booksData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await fetch(`http://localhost:5000/api/books/${id}`, { method: 'DELETE' });
        fetchBooks(); // Refresh list
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  return (
    <div style={{ fontFamily: "'Manrope', -apple-system, sans-serif", maxWidth: '1200px', margin: '0 auto' }}>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Books Directory
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.4rem 0 0 0', fontWeight: '500' }}>
            Manage editorial publications, digital releases, and special hardcover catalogs.
          </p>
        </div>
        <Link 
          to="/admin/books/new" 
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
          + Add New Book
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Loading books catalog...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {books.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, fontWeight: '600' }}>No books found in catalog. Add one to get started!</p>
            </div>
          ) : (
            books.map(book => (
              <div 
                key={book._id || book.id} 
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
                <div style={{ height: '210px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  {book.coverImage || book.image ? (
                    <img src={book.coverImage || book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>No Cover Image</span>
                  )}
                </div>
                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', fontWeight: '800', color: '#0f172a' }}>
                    {book.title}
                  </h3>
                  <p style={{ color: '#64748b', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '600' }}>
                    By {book.author || 'Rising Media Works'}
                  </p>
                  <p style={{ color: '#334155', fontSize: '0.85rem', marginBottom: '1.2rem', flex: 1, lineHeight: '1.55', fontWeight: '500' }}>
                    {book.description?.substring(0, 90)}...
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', marginTop: 'auto' }}>
                    <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' }}>
                      {book.price ? `$${book.price}` : 'Featured'}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/admin/books/edit/${book._id || book.id}`} 
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
                        onClick={() => handleDelete(book._id || book.id)} 
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

export default AdminBooks;

