import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#000', letterSpacing: '-1px' }}>Books Directory</h1>
        <Link to="/admin/books/new" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#000', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: '600', transition: 'background 0.2s', display: 'inline-block' }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#000'}>
          + Add New Book
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#666' }}>Loading books...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {books.length === 0 ? (
            <p style={{ color: '#666' }}>No books found. Add one to get started!</p>
          ) : (
            books.map(book => (
              <div key={book._id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e0e0e0' }}>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#999', fontSize: '0.9rem' }}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', fontWeight: 'bold', color: '#000' }}>{book.title}</h3>
                  <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>By {book.author}</p>
                  <p style={{ color: '#444', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>{book.description?.substring(0, 80)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#000', fontSize: '1.1rem' }}>${book.price}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link to={`/admin/books/edit/${book._id}`} style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#000', border: '1px solid #000', borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#000'; e.target.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#000'; }}>Edit</Link>
                      <button onClick={() => handleDelete(book._id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#d32f2f'; e.target.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#d32f2f'; }}>Delete</button>
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
