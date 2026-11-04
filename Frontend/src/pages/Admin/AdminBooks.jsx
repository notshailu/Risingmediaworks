import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  getActiveDummyBooks, 
  deleteDummyBook, 
  deleteAllDummyBooks, 
  restoreAllDummyBooks,
  getDeletedDummyBookIds
} from '../../utils/dummyBooksHelper';

const AdminBooks = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDummyCount, setActiveDummyCount] = useState(0);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/books`);
      let apiBooks = [];
      if (response.ok) {
        apiBooks = await response.json();
      }

      const activeDummy = getActiveDummyBooks().map((b) => ({
        ...b,
        _id: b.id,
        isDummy: true
      }));
      setActiveDummyCount(activeDummy.length);

      // Avoid duplicates if any API book matches an id
      const apiIds = new Set(apiBooks.map((b) => b._id || b.id));
      const filteredDummy = activeDummy.filter((b) => !apiIds.has(b.id));

      // Display real database books first, then active demo books
      setBooks([...apiBooks, ...filteredDummy]);
    } catch (error) {
      console.error('Error fetching books in AdminBooks:', error);
      const activeDummy = getActiveDummyBooks().map((b) => ({
        ...b,
        _id: b.id,
        isDummy: true
      }));
      setActiveDummyCount(activeDummy.length);
      setBooks(activeDummy);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();

    const handleUpdate = () => fetchBooks();
    window.addEventListener('dummy_books_updated', handleUpdate);
    return () => window.removeEventListener('dummy_books_updated', handleUpdate);
  }, []);

  const handleDelete = async (id, isDummy) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        if (isDummy || (typeof id === 'string' && id.startsWith('book-'))) {
          deleteDummyBook(id);
          // Also call backend in case
          fetch(`${API_BASE_URL}/api/books/${id}`, { method: 'DELETE' }).catch(() => null);
        } else {
          await fetch(`${API_BASE_URL}/api/books/${id}`, { method: 'DELETE' });
        }
        fetchBooks(); // Refresh list
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleRemoveAllDummy = () => {
    if (window.confirm('Are you sure you want to remove ALL placeholder demo books? Only your real uploaded publications will be shown.')) {
      deleteAllDummyBooks();
      fetchBooks();
    }
  };

  const handleRestoreDummy = () => {
    if (window.confirm('Restore all placeholder demo books to the catalog?')) {
      restoreAllDummyBooks();
      fetchBooks();
    }
  };

  return (
    <div style={{ fontFamily: "'Manrope', -apple-system, sans-serif", maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
      <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>
            Books Directory
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.4rem 0 0 0', fontWeight: '500' }}>
            Manage editorial publications, digital releases, and special hardcover catalogs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {activeDummyCount > 0 ? (
            <button
              type="button"
              onClick={handleRemoveAllDummy}
              style={{
                padding: '0.65rem 1.15rem',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
              title="Remove all placeholder demo books from the website and dashboard"
            >
              <span>🗑️ Remove All Dummy Books</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRestoreDummy}
              style={{
                padding: '0.65rem 1.15rem',
                backgroundColor: '#f8fafc',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              title="Restore placeholder demo books"
            >
              <span>↺ Restore Demo Books</span>
            </button>
          )}

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
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Loading books catalog...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {books.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <p style={{ color: '#0f172a', fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: '700' }}>No books found in catalog.</p>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>All dummy books were removed. Click "+ Add New Book" above to upload your first publication!</p>
              <button
                type="button"
                onClick={handleRestoreDummy}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                ↺ Restore Demo Books
              </button>
            </div>
          ) : (
            books.map((book) => {
              const bookId = book._id || book.id;
              const isDummy = book.isDummy || (typeof bookId === 'string' && bookId.startsWith('book-'));

              return (
                <div 
                  key={bookId} 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    border: '1px solid #e2e8f0', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    position: 'relative'
                  }}
                >
                  {isDummy && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(254, 243, 199, 0.95)',
                      color: '#92400e',
                      border: '1px solid #fde68a',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      letterSpacing: '0.05em',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      zIndex: 10,
                      backdropFilter: 'blur(4px)'
                    }}>
                      DEMO BOOK
                    </div>
                  )}

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
                        {book.price ? `₹${book.price}` : 'Featured'}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!isDummy && (
                          <Link 
                            to={`/admin/books/edit/${bookId}`} 
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
                        )}
                        <button 
                          onClick={() => handleDelete(bookId, isDummy)} 
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
                          title={isDummy ? 'Remove this placeholder demo book' : 'Delete book from catalog'}
                        >
                          {isDummy ? 'Remove Demo' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
