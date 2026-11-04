import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getActiveDummyBooks } from '../../utils/dummyBooksHelper';
import WaterBackground from '../../components/WaterBackground';

const BookDetail = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const { id } = useParams();
  const containerRef = useRef(null);
  const bookCoverRef = useRef(null);
  
  const [book, setBook] = useState(null);
  const [allBooksList, setAllBooksList] = useState(() => getActiveDummyBooks());
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [copiedLink, setCopiedLink] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.classList.add('light-theme');
    
    const fetchBookData = async () => {
      setLoading(true);
      const activeDummy = getActiveDummyBooks();

      try {
        const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
        if (res.ok) {
          const apiBook = await res.json();
          setBook({
            id: apiBook._id,
            _id: apiBook._id,
            title: apiBook.title,
            author: apiBook.author,
            description: apiBook.description || '',
            price: apiBook.price !== undefined && apiBook.price !== null ? apiBook.price : null,
            image: apiBook.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
            buyUrl: apiBook.buyUrl || '',
            category: apiBook.category || '',
            printSpecs: apiBook.printSpecs || '',
            gridSpec: apiBook.gridSpec || '',
            publishingSpec: apiBook.publishingSpec || '',
            paperSpec: apiBook.paperSpec || '',
            finalBookUrl: apiBook.finalBookUrl || ''
          });
        } else {
          const found = activeDummy.find((b) => b.id === id || b._id === id);
          if (found) {
            setBook({
              id: found.id || found._id,
              _id: found.id || found._id,
              title: found.title,
              author: found.author,
              description: found.description || found.overview || '',
              price: found.price !== undefined && found.price !== null ? found.price : null,
              image: found.coverImage || found.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
              buyUrl: found.buyUrl || '',
              category: found.category || '',
              printSpecs: found.printSpecs || '',
              gridSpec: found.gridSpec || '',
              publishingSpec: found.publishingSpec || '',
              paperSpec: found.paperSpec || '',
              finalBookUrl: found.finalBookUrl || ''
            });
          } else {
            setBook(null);
          }
        }

        const listRes = await fetch(`${API_BASE_URL}/api/books`).catch(() => null);
        if (listRes && listRes.ok) {
          const apiList = await listRes.json();
          if (Array.isArray(apiList) && apiList.length > 0) {
            const normalizedList = apiList.map((b) => ({
              ...b,
              id: b._id || b.id,
              image: b.coverImage || b.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
            }));
            const existing = new Set(normalizedList.map((b) => b.id));
            setAllBooksList([...normalizedList, ...activeDummy.filter((b) => !existing.has(b.id))]);
          } else {
            setAllBooksList(activeDummy);
          }
        } else {
          setAllBooksList(activeDummy);
        }
      } catch (err) {
        const found = activeDummy.find((b) => b.id === id || b._id === id);
        if (found) {
          setBook({
            id: found.id || found._id,
            _id: found.id || found._id,
            title: found.title,
            author: found.author,
            description: found.description || found.overview || '',
            price: found.price !== undefined && found.price !== null ? found.price : null,
            image: found.coverImage || found.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
            buyUrl: found.buyUrl || '',
            category: found.category || '',
            printSpecs: found.printSpecs || '',
            gridSpec: found.gridSpec || '',
            publishingSpec: found.publishingSpec || '',
            paperSpec: found.paperSpec || '',
            finalBookUrl: found.finalBookUrl || ''
          });
        } else {
          setBook(null);
        }
        setAllBooksList(activeDummy);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();

    return () => {
      document.body.classList.remove('light-theme');
    };
  }, [id, API_BASE_URL]);

  const currentIndex = allBooksList.findIndex((b) => b.id === id || b._id === id);
  const prevBook = currentIndex > 0 ? allBooksList[currentIndex - 1] : null;
  const nextBook = currentIndex >= 0 && currentIndex < allBooksList.length - 1 ? allBooksList[currentIndex + 1] : null;
  const otherBooks = allBooksList.filter((b) => b.id !== id && b._id !== id).slice(0, 3);

  // Entrance animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo('.book-nav-bar', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' })
      .fromTo('.book-visual-column', { opacity: 0, x: -25 }, { opacity: 1, x: 0, duration: 0.7, clearProps: 'opacity,transform' }, '-=0.2')
      .fromTo('.book-details-column', { opacity: 0, x: 25 }, { opacity: 1, x: 0, duration: 0.7, clearProps: 'opacity,transform' }, '-=0.5');
  }, { scope: containerRef, dependencies: [id, book] });

  const handleMouseMoveCover = (e) => {
    if (!bookCoverRef.current || isOpen) return;
    const rect = bookCoverRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseOffset({ x: x / 14, y: -y / 14 });
  };

  const handleMouseLeaveCover = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope', sans-serif", color: '#64748b' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#0052ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Loading publication details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: '160px 2rem 100px 2rem', textAlign: 'center', color: '#0f172a', fontFamily: "'Manrope', sans-serif" }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>Publication Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2rem' }}>The requested book could not be found or has been removed.</p>
        <Link 
          to="/special-books/all" 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.6rem',
            backgroundColor: '#0052ff',
            color: '#ffffff',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}
        >
          ← Browse Publications Archive
        </Link>
      </div>
    );
  }

  // Filter ONLY specs that actually contain non-empty data entered by the user
  const realSpecs = [
    { key: 'printSpecs', label: 'Format & Dimensions', value: book.printSpecs },
    { key: 'gridSpec', label: 'Grid Layout', value: book.gridSpec },
    { key: 'publishingSpec', label: 'Publishing & Distribution', value: book.publishingSpec },
    { key: 'paperSpec', label: 'Paper & Finish', value: book.paperSpec }
  ].filter((s) => s.value && String(s.value).trim().length > 0);

  // Filter sections for Interactive Look Inside spread modal (only real content)
  const modalSections = [
    book.description ? { id: 'overview', label: '01. Overview', title: 'Editorial Overview', content: book.description } : null,
    book.printSpecs ? { id: 'printSpecs', label: '02. Format Specs', title: 'Format & Dimensions', content: book.printSpecs } : null,
    book.gridSpec ? { id: 'gridSpec', label: '03. Grid System', title: 'Grid Layout Specification', content: book.gridSpec } : null,
    book.publishingSpec ? { id: 'publishingSpec', label: '04. Publishing', title: 'Publishing & Distribution', content: book.publishingSpec } : null,
    book.paperSpec ? { id: 'paperSpec', label: '05. Paper & Finish', title: 'Paper & Finish Specification', content: book.paperSpec } : null
  ].filter(Boolean);

  const formattedPrice = book.price !== null && book.price !== undefined && String(book.price).trim() !== ''
    ? (!isNaN(Number(book.price)) 
        ? Number(book.price).toLocaleString('en-IN', { minimumFractionDigits: Number(book.price) % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
        : String(book.price))
    : null;

  const isAmazonUrl = book.buyUrl && /amazon\./i.test(book.buyUrl);
  const buyButtonLabel = isAmazonUrl
    ? (formattedPrice ? `Buy on Amazon — ₹${formattedPrice}` : 'Buy on Amazon')
    : (formattedPrice ? `Purchase Book — ₹${formattedPrice}` : 'Purchase Book');

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#fafbfc',
        color: '#0f172a',
        padding: '110px 1.5rem 100px 1.5rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <WaterBackground />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 960px) {
          .book-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .book-visual-column {
            position: static !important;
            top: auto !important;
          }
        }
        @media (max-width: 640px) {
          .book-nav-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .book-specs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* ================= BREADCRUMBS & NAVIGATION ================= */}
        <div 
          className="book-nav-bar" 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Breadcrumb path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
            <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#0052ff'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Home</Link>
            <span>/</span>
            <Link to="/special-books/all" style={{ color: '#64748b', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#0052ff'} onMouseLeave={(e) => e.target.style.color = '#64748b'}>Special Books</Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: '700', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {book.title}
            </span>
          </div>

          {/* Actions: Prev / Next / Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem' }}>
            {prevBook && (
              <Link
                to={`/special-books/${prevBook.id || prevBook._id}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                ← Prev
              </Link>
            )}

            {nextBook && (
              <Link
                to={`/special-books/${nextBook.id || nextBook._id}`}
                style={{
                  padding: '0.4rem 0.85rem',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              >
                Next →
              </Link>
            )}

            <button
              onClick={handleShare}
              style={{
                padding: '0.4rem 0.85rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#475569',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              🔗 {copiedLink ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* ================= MAIN TWO-COLUMN PRODUCT SECTION ================= */}
        <div 
          className="book-detail-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 460px) 1fr',
            gap: '3.5rem',
            alignItems: 'start',
            marginBottom: '4.5rem'
          }}
        >
          {/* ---------------- LEFT: 3D BOOK PRESENTATION ---------------- */}
          <div className="book-visual-column" style={{ position: 'sticky', top: '100px' }}>
            <div 
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
              }}
            >
              {/* Interactive 3D Book Mockup */}
              <div
                ref={bookCoverRef}
                onMouseMove={handleMouseMoveCover}
                onMouseLeave={handleMouseLeaveCover}
                onClick={() => modalSections.length > 0 && setIsOpen(true)}
                style={{
                  position: 'relative',
                  width: '270px',
                  height: '385px',
                  perspective: '1200px',
                  cursor: modalSections.length > 0 ? 'pointer' : 'default',
                  margin: '1rem 0 1.5rem 0',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${mouseOffset.x}deg) rotateX(${mouseOffset.y}deg)`,
                    transition: 'transform 0.15s ease-out'
                  }}
                >
                  {/* Front Cover */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '4px 12px 12px 4px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0,0,0,0.06)',
                      backgroundColor: '#0f172a'
                    }}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />

                    {/* Realistic spine gradient */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: '24px',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.12) 50%, rgba(0,0,0,0.15) 100%)',
                      pointerEvents: 'none'
                    }} />

                    {/* Subtle gloss reflection */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, transparent 60%)',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  {/* 3D Spine Thickness */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '16px',
                    height: '100%',
                    backgroundColor: '#1e293b',
                    transformOrigin: 'left',
                    transform: 'rotateY(-90deg)',
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.6)'
                  }} />
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div style={{ display: 'flex', gap: '0.65rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                {modalSections.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    style={{
                      flex: 1,
                      minWidth: '130px',
                      padding: '0.65rem 0.9rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  >
                    <span>📖</span> Look Inside
                  </button>
                )}

                {book.finalBookUrl && (
                  <a
                    href={book.finalBookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      minWidth: '130px',
                      padding: '0.65rem 0.9rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.82rem',
                      color: '#0052ff',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                  >
                    <span>📄</span> PDF Preview
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT: REAL PRODUCT DETAILS & BUY SECTION ---------------- */}
          <div className="book-details-column" style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Category Tag (Only if exists) */}
            {book.category && (
              <div style={{ marginBottom: '0.6rem' }}>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  {book.category.replace('-', ' ')}
                </span>
              </div>
            )}

            {/* Book Title */}
            <h1 style={{
              fontSize: 'clamp(2.1rem, 4vw, 2.85rem)',
              fontWeight: '800',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.025em',
              lineHeight: '1.18',
              color: '#0f172a'
            }}>
              {book.title}
            </h1>

            {/* Author */}
            <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>By</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{book.author}</span>
            </div>

            {/* Real Price (Only if set) */}
            {formattedPrice && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.3rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                  ₹{formattedPrice}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                  INR
                </span>
              </div>
            )}

            {/* Purchase CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              {book.buyUrl ? (
                <a
                  href={book.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    backgroundColor: '#0052ff',
                    color: '#ffffff',
                    padding: '1rem 1.8rem',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '0.98rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(0, 82, 255, 0.25)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0040d0';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 82, 255, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#0052ff';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 82, 255, 0.25)';
                  }}
                >
                  <span>{buyButtonLabel}</span>
                  <span style={{ fontSize: '1.1rem' }}>↗</span>
                </a>
              ) : (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  padding: '0.9rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.92rem'
                }}>
                  Purchasing Link Available Soon
                </div>
              )}

              {modalSections.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    padding: '0.85rem 1.6rem',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  <span>📖</span> Preview Book Interior
                </button>
              )}
            </div>

            {/* Real Description (Only if entered) */}
            {book.description && (
              <div style={{ marginBottom: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.8rem' }}>
                <h3 style={{
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#475569',
                  margin: '0 0 0.75rem 0'
                }}>
                  Overview
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: '1.75',
                  color: '#334155',
                  margin: 0,
                  whiteSpace: 'pre-line'
                }}>
                  {book.description}
                </p>
              </div>
            )}

            {/* Real Specifications (Only if values exist) */}
            {realSpecs.length > 0 && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.8rem', marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#475569',
                  margin: '0 0 1rem 0'
                }}>
                  Specifications
                </h3>

                <div 
                  className="book-specs-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  {realSpecs.map((spec) => (
                    <div
                      key={spec.key}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '1rem 1.25rem'
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>
                        {spec.label}
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', wordBreak: 'break-word' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ================= RELATED BOOKS FROM CATALOG ================= */}
        {otherBooks.length > 0 && (
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '3rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                  Publications Archive
                </span>
                <h2 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>
                  Other Special Books
                </h2>
              </div>

              <Link
                to="/special-books/all"
                style={{
                  fontSize: '0.85rem',
                  color: '#0052ff',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                View All Books →
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {otherBooks.map((other) => {
                const otherPriceFormatted = other.price !== null && other.price !== undefined && String(other.price).trim() !== ''
                  ? (!isNaN(Number(other.price)) 
                      ? `₹${Number(other.price).toLocaleString('en-IN', { minimumFractionDigits: Number(other.price) % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}` 
                      : `₹${other.price}`)
                  : null;

                return (
                  <Link
                    key={other.id || other._id}
                    to={`/special-books/${other.id || other._id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';
                      e.currentTarget.style.borderColor = '#0052ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{ height: '260px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img
                        src={other.image || other.coverImage}
                        alt={other.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {other.category && (
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          {other.category.replace('-', ' ')}
                        </div>
                      )}
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.35rem 0', lineHeight: '1.3' }}>
                        {other.title}
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 1rem 0' }}>
                        By {other.author}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9' }}>
                        {otherPriceFormatted ? (
                          <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.05rem' }}>
                            {otherPriceFormatted}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>—</span>
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0052ff' }}>
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ================= REAL DATA INTERACTIVE SPREAD MODAL ================= */}
      {isOpen && modalSections.length > 0 && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9990,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem'
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '960px',
            height: '600px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.1rem 1.8rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#0052ff', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Publication Details
                </span>
                <h3 style={{ fontSize: '1.15rem', margin: '0.1rem 0 0 0', fontWeight: '800', color: '#0f172a' }}>
                  {book.title}
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✕
              </button>
            </div>

            {/* Two-Page Spread */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
              {/* Left Page: Index */}
              <div style={{ padding: '2.5rem', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                <div>
                  <h4 style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1.25rem 0' }}>
                    Contents & Specifications
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {modalSections.map((sec, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSectionIndex(idx)}
                        style={{
                          background: activeSectionIndex === idx ? '#eff6ff' : 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          fontSize: '0.9rem',
                          color: activeSectionIndex === idx ? '#0052ff' : '#475569',
                          fontWeight: activeSectionIndex === idx ? '800' : '500',
                          cursor: 'pointer',
                          padding: '0.55rem 0.75rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '500' }}>
                  Rising Media Works Editorial
                </div>
              </div>

              {/* Right Page: Content */}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fafbfc' }}>
                <div style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#0052ff', fontWeight: '800', textTransform: 'uppercase' }}>
                    {modalSections[activeSectionIndex]?.label}
                  </span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0.5rem 0 1rem 0', color: '#0f172a' }}>
                    {modalSections[activeSectionIndex]?.title}
                  </h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.75', color: '#334155', margin: 0, whiteSpace: 'pre-line' }}>
                    {modalSections[activeSectionIndex]?.content}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSectionIndex === 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: activeSectionIndex === 0 ? '#cbd5e1' : '#0f172a',
                      cursor: activeSectionIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Previous
                  </button>

                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>
                    {activeSectionIndex + 1} of {modalSections.length}
                  </span>

                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.min(modalSections.length - 1, prev + 1))}
                    disabled={activeSectionIndex === modalSections.length - 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: activeSectionIndex === modalSections.length - 1 ? '#cbd5e1' : '#0f172a',
                      cursor: activeSectionIndex === modalSections.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
