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
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedFormatIndex, setSelectedFormatIndex] = useState(0);

  // Accordion open/close state (Technical Specs & Description open by default, matching reference)
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    specs: true,
    publishing: false,
    preview: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
  const otherBooks = allBooksList.filter((b) => b.id !== id && b._id !== id).slice(0, 4);

  // Entrance animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo('.luxury-breadcrumb-bar', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, clearProps: 'opacity,transform' })
      .fromTo('.luxury-visual-column', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7, clearProps: 'opacity,transform' }, '-=0.2')
      .fromTo('.luxury-details-column', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.7, clearProps: 'opacity,transform' }, '-=0.5');
  }, { scope: containerRef, dependencies: [id, book] });

  const handleMouseMoveCover = (e) => {
    if (!bookCoverRef.current || isOpen) return;
    const rect = bookCoverRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseOffset({ x: x / 15, y: -y / 15 });
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
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope', sans-serif", color: '#64748b', backgroundColor: '#fcfbfa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #e5e3dc', borderTopColor: '#121212', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#6e6d68' }}>Loading luxury publication...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: '160px 2rem 100px 2rem', textAlign: 'center', color: '#121212', fontFamily: "'Manrope', sans-serif", backgroundColor: '#fcfbfa', minHeight: '100vh' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>Publication Not Found</h2>
        <p style={{ color: '#6e6d68', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 2rem' }}>The requested book could not be found or has been removed from the archive.</p>
        <Link 
          to="/special-books/all" 
          style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.6rem',
            backgroundColor: '#121212',
            color: '#ffffff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}
        >
          ← Browse Archive
        </Link>
      </div>
    );
  }

  // Filter ONLY real specs with actual values entered by the user
  const realSpecs = [
    { key: 'printSpecs', label: 'Format & Trim Size', value: book.printSpecs, caption: 'Standard Archival Trim' },
    { key: 'gridSpec', label: 'Editorial Grid Layout', value: book.gridSpec, caption: 'Harmonic Baseline Alignment' },
    { key: 'publishingSpec', label: 'Publishing & Distribution', value: book.publishingSpec, caption: 'Global Registration' },
    { key: 'paperSpec', label: 'Paperweight & Tactile Finish', value: book.paperSpec, caption: 'Archival-Grade Stock' }
  ].filter((s) => s.value && String(s.value).trim().length > 0);

  // Sections for modal reader
  const modalSections = [
    book.description ? { id: 'overview', label: '01. Overview', title: 'Editorial Overview', content: book.description } : null,
    book.printSpecs ? { id: 'printSpecs', label: '02. Format Specs', title: 'Format & Dimensions', content: book.printSpecs } : null,
    book.gridSpec ? { id: 'gridSpec', label: '03. Grid System', title: 'Grid Layout Specification', content: book.gridSpec } : null,
    book.publishingSpec ? { id: 'publishingSpec', label: '04. Publishing', title: 'Publishing & Distribution', content: book.publishingSpec } : null,
    book.paperSpec ? { id: 'paperSpec', label: '05. Paper & Finish', title: 'Paper & Finish Specification', content: book.paperSpec } : null
  ].filter(Boolean);

  const numericPrice = book.price !== null && book.price !== undefined && !isNaN(Number(book.price))
    ? Number(book.price)
    : null;

  const formattedUnitPrice = numericPrice !== null
    ? numericPrice.toLocaleString('en-IN', { minimumFractionDigits: numericPrice % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
    : (book.price ? String(book.price) : null);

  const totalCalculated = numericPrice !== null ? numericPrice * quantity : null;
  const formattedTotalPrice = totalCalculated !== null
    ? totalCalculated.toLocaleString('en-IN', { minimumFractionDigits: totalCalculated % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
    : formattedUnitPrice;

  const isAmazonUrl = book.buyUrl && /amazon\./i.test(book.buyUrl);
  const buyButtonText = isAmazonUrl
    ? (formattedTotalPrice ? `Purchase on Amazon — ₹${formattedTotalPrice}` : 'Buy on Amazon')
    : (formattedTotalPrice ? `Order Publication — ₹${formattedTotalPrice}` : 'Order Publication');

  // Format options chips derived from real data - concise luxury pills
  const formatChips = [
    book.printSpecs
      ? (book.printSpecs.length > 20
          ? (/\b\d+x\d+\b/i.test(book.printSpecs) ? `${book.printSpecs.match(/\b\d+x\d+\b/i)[0]}″ Edition` : 'Standard Edition')
          : book.printSpecs)
      : 'Standard Edition',
    book.paperSpec
      ? (book.paperSpec.length > 20 ? 'Archival Finish' : book.paperSpec)
      : 'Archival Finish',
    book.finalBookUrl ? 'Digital PDF Specimen' : null
  ].filter((item, idx, arr) => item && arr.indexOf(item) === idx);

  return (
    <div
      ref={containerRef}
      className="luxury-page-root"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#fbfaf8',
        color: '#121212',
        padding: '105px 2rem 100px 2rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <WaterBackground />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .luxury-product-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .luxury-visual-column {
            position: static !important;
            top: auto !important;
          }
          .luxury-related-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .luxury-page-root {
            padding: 90px 1.25rem 60px 1.25rem !important;
          }
          .luxury-hero-card {
            padding: 2.2rem 1rem 1.8rem 1rem !important;
            min-height: 380px !important;
          }
          .luxury-breadcrumb-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.8rem !important;
          }
          .luxury-related-grid {
            grid-template-columns: 1fr !important;
          }
          .luxury-gallery-lower {
            grid-template-columns: 1fr !important;
          }
          .luxury-buy-row {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }
          .luxury-stepper {
            width: 100% !important;
            padding: 0 1.25rem !important;
          }
          .luxury-spec-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.35rem !important;
          }
          .luxury-spec-val {
            text-align: left !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1320px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* ================= 1. MINIMAL LUXURY BREADCRUMB & BACK NAVIGATION ================= */}
        <div 
          className="luxury-breadcrumb-bar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: '#8c8a84',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
            letterSpacing: '0.02em'
          }}
        >
          {/* Prominent Back Button & Breadcrumb Path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/special-books/all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.85rem',
                borderRadius: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #dedbd2',
                color: '#121212',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.78rem',
                letterSpacing: '0.03em',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#121212';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = '#121212';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#121212';
                e.currentTarget.style.borderColor = '#dedbd2';
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>←</span>
              <span>Back to Books Archive</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <Link to="/" style={{ color: '#8c8a84', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#121212'} onMouseLeave={(e) => e.target.style.color = '#8c8a84'}>Home</Link>
              <span>/</span>
              <Link to="/special-books/all" style={{ color: '#8c8a84', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#121212'} onMouseLeave={(e) => e.target.style.color = '#8c8a84'}>Special Books</Link>
              {book.category && (
                <>
                  <span>/</span>
                  <span style={{ textTransform: 'capitalize' }}>{book.category.replace('-', ' ')}</span>
                </>
              )}
              <span>/</span>
              <span style={{ color: '#121212', fontWeight: '600', maxWidth: 'min(300px, 60vw)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {book.title}
              </span>
            </div>
          </div>

          {/* Quick Actions: Prev / Next / Share */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {prevBook && (
              <Link
                to={`/special-books/${prevBook.id || prevBook._id}`}
                style={{
                  color: '#4a4843',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#121212'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#4a4843'}
              >
                ← Prev
              </Link>
            )}

            {nextBook && (
              <Link
                to={`/special-books/${nextBook.id || nextBook._id}`}
                style={{
                  color: '#4a4843',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.78rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#121212'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#4a4843'}
              >
                Next →
              </Link>
            )}

            <button
              onClick={handleShare}
              style={{
                background: 'transparent',
                border: '1px solid #e0ded8',
                borderRadius: '4px',
                padding: '0.3rem 0.65rem',
                color: '#4a4843',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#121212'; e.currentTarget.style.color = '#121212'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0ded8'; e.currentTarget.style.color = '#4a4843'; }}
            >
              <span>🔗</span> {copiedLink ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>

        {/* ================= 2. MAIN TWO-COLUMN LUXURY SHOWCASE ================= */}
        <div 
          className="luxury-product-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
            gap: '3.5rem',
            alignItems: 'start',
            marginBottom: '6rem'
          }}
        >
          {/* ---------------- LEFT: MULTI-CARD LUXURY GALLERY ---------------- */}
          <div className="luxury-visual-column" style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* UPPER CARD: Hero 3D Book Showcase */}
            <div 
              className="luxury-hero-card"
              style={{
                backgroundColor: '#f5f4ef',
                borderRadius: '8px',
                border: '1px solid #eae8e1',
                padding: '2.5rem 2rem 2.2rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                minHeight: '480px',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Badges: Top-Left (Category/Edition) & Top-Right (In Stock) */}
              <div style={{ position: 'absolute', top: '16px', left: '18px', display: 'flex', gap: '0.4rem', zIndex: 10 }}>
                {book.category && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '3px 8px',
                    borderRadius: '3px',
                    backgroundColor: '#e8e5dc',
                    color: '#423f39'
                  }}>
                    {book.category.replace('-', ' ')}
                  </span>
                )}
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  backgroundColor: '#dedbd2',
                  color: '#383631'
                }}>
                  ORIGINAL
                </span>
              </div>

              {/* In Stock Badge (Top-Right, matching reference) */}
              <div style={{ position: 'absolute', top: '16px', right: '18px', zIndex: 10 }}>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  backgroundColor: '#1c3a2f',
                  color: '#ffffff',
                  display: 'inline-block'
                }}>
                  IN STOCK
                </span>
              </div>

              {/* Floating Prev/Next Image Navigation Arrows (Matching Reference) */}
              <button
                type="button"
                onClick={() => modalSections.length > 0 && setIsOpen(true)}
                title="Preview"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid #dedbd2',
                  color: '#423f39',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  zIndex: 10,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                ‹
              </button>

              <button
                type="button"
                onClick={() => modalSections.length > 0 && setIsOpen(true)}
                title="Preview"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid #dedbd2',
                  color: '#423f39',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  zIndex: 10,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'}
              >
                ›
              </button>

              {/* 3D Interactive Book Mockup */}
              <div
                ref={bookCoverRef}
                onMouseMove={handleMouseMoveCover}
                onMouseLeave={handleMouseLeaveCover}
                onClick={() => modalSections.length > 0 && setIsOpen(true)}
                className="luxury-3d-mockup"
                style={{
                  position: 'relative',
                  width: 'min(280px, 75vw)',
                  height: 'min(395px, 105vw)',
                  maxWidth: '280px',
                  maxHeight: '395px',
                  perspective: '1200px',
                  cursor: modalSections.length > 0 ? 'pointer' : 'default',
                  margin: '1.5rem 0',
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
                  {/* Front Cover Card */}
                  <div 
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '3px 10px 10px 3px',
                      overflow: 'hidden',
                      boxShadow: '0 25px 45px -12px rgba(20, 20, 18, 0.28), 0 0 0 1px rgba(0,0,0,0.06)',
                      backgroundColor: '#121212'
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

                    {/* Realistic Spine Gradient Shadow */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: '24px',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.18) 100%)',
                      pointerEvents: 'none'
                    }} />

                    {/* Gloss Light Reflection */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 60%)',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  {/* 3D Spine Thickness */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '18px',
                    height: '100%',
                    backgroundColor: '#1f1e1a',
                    transformOrigin: 'left',
                    transform: 'rotateY(-90deg)',
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.65)'
                  }} />
                </div>
              </div>

              {/* Bottom Left Button: ▶ WATCH VIDEO / PREVIEW INTERIOR (Matching Reference) */}
              <div style={{ position: 'absolute', bottom: '16px', left: '18px', zIndex: 10 }}>
                {modalSections.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#121212',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: 0
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#0052ff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#121212'}
                  >
                    <span>▶</span> WATCH INTERIOR PREVIEW
                  </button>
                )}
              </div>

              {/* Bottom Right: PDF link if available */}
              {book.finalBookUrl && (
                <div style={{ position: 'absolute', bottom: '16px', right: '18px', zIndex: 10 }}>
                  <a
                    href={book.finalBookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#6e6d68',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      letterSpacing: '0.04em'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#121212'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6e6d68'}
                  >
                    <span>📄</span> PDF SPECIMEN ↗
                  </a>
                </div>
              )}
            </div>

            {/* LOWER TWO CARDS: Secondary Gallery Angle Shots (Matching Reference Image) */}
            <div 
              className="luxury-gallery-lower"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem'
              }}
            >
              {/* Secondary Card 1: Angle Detail / Spine Thumbnail */}
              <div 
                onClick={() => modalSections.length > 0 && setIsOpen(true)}
                style={{
                  backgroundColor: '#f5f4ef',
                  borderRadius: '8px',
                  border: '1px solid #eae8e1',
                  height: '175px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#b3b0a6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#eae8e1'}
              >
                <img
                  src={book.image}
                  alt="Detail Angle"
                  style={{
                    maxHeight: '135px',
                    width: 'auto',
                    objectFit: 'contain',
                    transform: 'rotate(-4deg)',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                    borderRadius: '2px'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '10px',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  color: '#7a7872',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Cover Angle
                </span>
              </div>

              {/* Secondary Card 2: Interior Spread Preview */}
              <div 
                onClick={() => modalSections.length > 0 && setIsOpen(true)}
                style={{
                  backgroundColor: '#f5f4ef',
                  borderRadius: '8px',
                  border: '1px solid #eae8e1',
                  height: '175px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '1rem',
                  boxSizing: 'border-box',
                  position: 'relative',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#b3b0a6'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#eae8e1'}
              >
                {/* Miniature 2-Page Spread Layout Graphic */}
                <div style={{
                  display: 'flex',
                  width: '130px',
                  height: '85px',
                  backgroundColor: '#ffffff',
                  borderRadius: '2px',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.1)',
                  border: '1px solid #dedbd2',
                  overflow: 'hidden'
                }}>
                  <div style={{ flex: 1, borderRight: '1px solid #eae8e1', padding: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ width: '40%', height: '4px', backgroundColor: '#121212', borderRadius: '1px' }} />
                    <div style={{ width: '85%', height: '2px', backgroundColor: '#dedbd2' }} />
                    <div style={{ width: '95%', height: '2px', backgroundColor: '#dedbd2' }} />
                    <div style={{ width: '75%', height: '2px', backgroundColor: '#dedbd2' }} />
                  </div>
                  <div style={{ flex: 1, padding: '6px', display: 'flex', flexDirection: 'column', gap: '3px', backgroundColor: '#faf9f6' }}>
                    <div style={{ width: '70%', height: '35px', backgroundColor: '#dedbd2', margin: 'auto auto', borderRadius: '1px' }} />
                  </div>
                </div>

                <span style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '10px',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  color: '#7a7872',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Interior Spread
                </span>

                <span style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '10px',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  color: '#121212'
                }}>
                  Open ↗
                </span>
              </div>
            </div>

          </div>

          {/* ---------------- RIGHT: PRODUCT DETAILS & PURCHASE PANEL ---------------- */}
          <div className="luxury-details-column" style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Product Title */}
            <h1 style={{
              fontSize: 'clamp(2.1rem, 3.8vw, 2.85rem)',
              fontWeight: '700',
              margin: '0 0 0.35rem 0',
              letterSpacing: '-0.025em',
              lineHeight: '1.16',
              color: '#121212'
            }}>
              {book.title}
            </h1>

            {/* Subtitle / Model line (Matching Reference: "for Porsche 911...") */}
            <div style={{
              fontSize: '0.9rem',
              color: '#73716a',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              letterSpacing: '0.01em'
            }}>
              <span>by</span>
              <span style={{ fontWeight: '600', color: '#2b2a26' }}>{book.author}</span>
              {book.category && (
                <>
                  <span>•</span>
                  <span>{book.category.replace('-', ' ').toUpperCase()}</span>
                </>
              )}
            </div>

            {/* Price Display (Matching Reference: bold price) */}
            {formattedUnitPrice && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '2.1rem', fontWeight: '800', color: '#121212', letterSpacing: '-0.025em' }}>
                  ₹{formattedUnitPrice}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#8c8a84', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  INR
                </span>
              </div>
            )}

            {/* Overview / Description Paragraph with "Read More" (Matching Reference) */}
            {book.description && (
              <div style={{ marginBottom: '1.8rem' }}>
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.65',
                  color: '#4a4843',
                  margin: 0,
                  whiteSpace: 'pre-line'
                }}>
                  {isDescriptionExpanded || book.description.length <= 160
                    ? book.description
                    : `${book.description.substring(0, 160)}...`}
                </p>
                {book.description.length > 160 && (
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      marginTop: '0.35rem',
                      color: '#121212',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}

            {/* Format Option Chips (Matching Reference: Visible Carbon Finish pills) */}
            {formatChips.length > 0 && (
              <div style={{ marginBottom: '1.8rem' }}>
                <span style={{
                  fontSize: '0.72rem',
                  color: '#73716a',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '0.6rem',
                  letterSpacing: '0.03em'
                }}>
                  Specification Format:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {formatChips.map((chip, index) => {
                    const isSelected = selectedFormatIndex === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedFormatIndex(index)}
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: '4px',
                          border: isSelected ? '1px solid #121212' : '1px solid #dedbd2',
                          backgroundColor: isSelected ? '#121212' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#4a4843',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          letterSpacing: '0.02em',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stepper + Main Add to Cart / Purchase CTA (Matching Reference Button Style) */}
            <div 
              className="luxury-buy-row"
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'stretch',
                marginBottom: '2.5rem'
              }}
            >
              {/* Stepper: - 1 + */}
              <div 
                className="luxury-stepper"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #dedbd2',
                  borderRadius: '4px',
                  backgroundColor: '#ffffff',
                  height: '52px',
                  padding: '0 0.85rem',
                  boxSizing: 'border-box',
                  minWidth: '130px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#121212',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '32px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#8c8a84', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                    Qty:
                  </span>
                  <span style={{
                    minWidth: '22px',
                    textAlign: 'center',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    color: '#121212'
                  }}>
                    {quantity}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#121212',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '32px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Main Dark Button: Purchase Book */}
              {book.buyUrl ? (
                <a
                  href={book.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    height: '52px',
                    backgroundColor: '#1b3a2f', // Deep dark luxury forest green from reference
                    color: '#ffffff',
                    borderRadius: '4px',
                    fontWeight: '700',
                    fontSize: '0.92rem',
                    letterSpacing: '0.03em',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1.5rem',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(27, 58, 47, 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#132820';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1b3a2f';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <span>{buyButtonText}</span>
                  <span style={{ fontSize: '1.15rem' }}>↗</span>
                </a>
              ) : (
                <div style={{
                  flex: 1,
                  height: '52px',
                  backgroundColor: '#eae8e1',
                  color: '#6e6d68',
                  borderRadius: '4px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  Purchasing Link Available Soon
                </div>
              )}
            </div>

            {/* ================= ACCORDION STACK (MATCHING REFERENCE EXACTLY) ================= */}
            <div style={{ borderTop: '1px solid #eae8e1' }}>
              
              {/* Accordion Item 1: Description */}
              {book.description && (
                <div style={{ borderBottom: '1px solid #eae8e1' }}>
                  <button
                    type="button"
                    onClick={() => toggleAccordion('description')}
                    style={{
                      width: '100%',
                      padding: '1.1rem 0',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#121212', letterSpacing: '0.01em' }}>
                      Description
                    </span>
                    <span style={{ fontSize: '1.1rem', color: '#73716a', fontWeight: '400' }}>
                      {openAccordions.description ? '−' : '+'}
                    </span>
                  </button>

                  {openAccordions.description && (
                    <div style={{ paddingBottom: '1.25rem', color: '#4a4843', fontSize: '0.88rem', lineHeight: '1.7' }}>
                      <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{book.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Accordion Item 2: Technical Specifications / Fitment (Open by default with 2-column table) */}
              <div style={{ borderBottom: '1px solid #eae8e1' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('specs')}
                  style={{
                    width: '100%',
                    padding: '1.1rem 0',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#121212', letterSpacing: '0.01em' }}>
                    Specifications & Editorial Details
                  </span>
                  <span style={{ fontSize: '1rem', color: '#73716a', fontWeight: '400' }}>
                    {openAccordions.specs ? '✕' : '+'}
                  </span>
                </button>

                {openAccordions.specs && (
                  <div style={{ paddingBottom: '1.25rem' }}>
                    {realSpecs.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {realSpecs.map((spec, sIdx) => (
                          <div 
                            key={spec.key}
                            className="luxury-spec-row"
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              padding: '0.85rem 0',
                              borderBottom: sIdx === realSpecs.length - 1 ? 'none' : '1px solid #f0ede6',
                              gap: '1rem'
                            }}
                          >
                            <div style={{ flex: '1 1 auto', minWidth: '130px' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#121212' }}>
                                {spec.label}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#8c8a84', marginTop: '0.15rem' }}>
                                {spec.caption}
                              </div>
                            </div>

                            <div 
                              className="luxury-spec-val"
                              style={{ 
                                fontSize: '0.85rem', 
                                color: '#383631', 
                                textAlign: 'right', 
                                fontWeight: '500', 
                                maxWidth: '60%', 
                                wordBreak: 'break-word',
                                flex: '1 1 auto'
                              }}
                            >
                              {spec.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#73716a' }}>
                        Official print specifications archived with publisher release.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion Item 3: Publishing & Distribution */}
              <div style={{ borderBottom: '1px solid #eae8e1' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('publishing')}
                  style={{
                    width: '100%',
                    padding: '1.1rem 0',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#121212', letterSpacing: '0.01em' }}>
                    Publishing & Archival Rights
                  </span>
                  <span style={{ fontSize: '1.1rem', color: '#73716a', fontWeight: '400' }}>
                    {openAccordions.publishing ? '−' : '+'}
                  </span>
                </button>

                {openAccordions.publishing && (
                  <div style={{ paddingBottom: '1.25rem', color: '#4a4843', fontSize: '0.85rem', lineHeight: '1.7' }}>
                    <div className="luxury-spec-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f0ede6', gap: '0.5rem' }}>
                      <span style={{ color: '#73716a' }}>Publisher</span>
                      <span style={{ fontWeight: '600', color: '#121212' }} className="luxury-spec-val">{book.publishingSpec || 'Rising Media Works Press'}</span>
                    </div>
                    <div className="luxury-spec-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f0ede6', gap: '0.5rem' }}>
                      <span style={{ color: '#73716a' }}>Distribution</span>
                      <span style={{ fontWeight: '600', color: '#121212' }} className="luxury-spec-val">Global Retail & Amazon Network</span>
                    </div>
                    <div className="luxury-spec-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', gap: '0.5rem' }}>
                      <span style={{ color: '#73716a' }}>Archival Standard</span>
                      <span style={{ fontWeight: '600', color: '#121212' }} className="luxury-spec-val">Acid-Free Preserved Material</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion Item 4: Installation / Reading Guide */}
              <div style={{ borderBottom: '1px solid #eae8e1' }}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('preview')}
                  style={{
                    width: '100%',
                    padding: '1.1rem 0',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#121212', letterSpacing: '0.01em' }}>
                    Digital Specimen & Spread Viewer
                  </span>
                  <span style={{ fontSize: '1.1rem', color: '#73716a', fontWeight: '400' }}>
                    {openAccordions.preview ? '−' : '+'}
                  </span>
                </button>

                {openAccordions.preview && (
                  <div style={{ paddingBottom: '1.25rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                    {modalSections.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        style={{
                          padding: '0.65rem 1.2rem',
                          backgroundColor: '#121212',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase'
                        }}
                      >
                        📖 Open Fullscreen Spread
                      </button>
                    )}

                    {book.finalBookUrl && (
                      <a
                        href={book.finalBookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.65rem 1.2rem',
                          backgroundColor: '#ffffff',
                          color: '#121212',
                          border: '1px solid #dedbd2',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          textDecoration: 'none',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase'
                        }}
                      >
                        📄 Download PDF File ↗
                      </a>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* ================= 3. [02] RELATED PRODUCTS / PUBLICATIONS (MATCHING REFERENCE EXACTLY) ================= */}
        {otherBooks.length > 0 && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid #eae8e1', paddingTop: '3.5rem' }}>
            
            {/* Header: [02] RELATED PRODUCTS (Geometric Wide Font) */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#121212',
                margin: 0,
                fontFamily: "'Space Grotesk', 'Manrope', monospace"
              }}>
                [02] RELATED PUBLICATIONS
              </h2>

              <Link
                to="/special-books/all"
                style={{
                  fontSize: '0.78rem',
                  color: '#73716a',
                  fontWeight: '600',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
                onMouseEnter={(e) => e.target.style.color = '#121212'}
                onMouseLeave={(e) => e.target.style.color = '#73716a'}
              >
                View Catalog →
              </Link>
            </div>

            {/* 4-Card Luxury Grid (Matching Reference Product Cards) */}
            <div 
              className="luxury-related-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.25rem'
              }}
            >
              {otherBooks.map((other, idx) => {
                const oPrice = other.price !== null && other.price !== undefined && String(other.price).trim() !== ''
                  ? (!isNaN(Number(other.price)) ? `₹${Number(other.price).toLocaleString('en-IN', { minimumFractionDigits: Number(other.price) % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}` : `₹${other.price}`)
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
                      backgroundColor: '#f5f4ef',
                      borderRadius: '8px',
                      border: '1px solid #eae8e1',
                      overflow: 'hidden',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = '#b3b0a6';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(20, 20, 18, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = '#eae8e1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Upper Media Container */}
                    <div style={{
                      height: '240px',
                      backgroundColor: '#f5f4ef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      padding: '1.5rem',
                      boxSizing: 'border-box'
                    }}>
                      {/* Badge (Matching Reference: NEW or Bestseller) */}
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        fontSize: '0.62rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        backgroundColor: idx % 2 === 0 ? '#dedbd2' : '#121212',
                        color: idx % 2 === 0 ? '#383631' : '#ffffff'
                      }}>
                        {idx % 2 === 0 ? 'NEW' : 'FEATURED'}
                      </span>

                      <img
                        src={other.image || other.coverImage}
                        alt={other.title}
                        style={{
                          maxHeight: '180px',
                          maxWidth: '125px',
                          objectFit: 'contain',
                          boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                          borderRadius: '2px',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    </div>

                    {/* Lower Info Container (Clean Minimalist Matching Reference) */}
                    <div style={{ padding: '1rem 1.1rem 1.2rem 1.1rem', backgroundColor: '#fcfbfa', borderTop: '1px solid #eae8e1', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        color: '#121212',
                        margin: '0 0 0.25rem 0',
                        lineHeight: '1.3',
                        letterSpacing: '-0.01em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {other.title}
                      </h3>
                      
                      <p style={{
                        color: '#73716a',
                        fontSize: '0.75rem',
                        margin: '0 0 0.8rem 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        By {other.author}
                      </p>

                      <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#121212' }}>
                          {oPrice || 'Available'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#73716a', fontWeight: '600' }}>
                          View ↗
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
            backgroundColor: 'rgba(18, 18, 16, 0.82)',
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
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.1rem 1.8rem',
              borderBottom: '1px solid #eae8e1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f5f4ef'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#1c3a2f', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Publication Archive
                </span>
                <h3 style={{ fontSize: '1.15rem', margin: '0.1rem 0 0 0', fontWeight: '800', color: '#121212' }}>
                  {book.title}
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#121212',
                  color: '#ffffff',
                  border: 'none',
                  width: '32px',
                  height: '32px',
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
              <div style={{ padding: '2.5rem', borderRight: '1px solid #eae8e1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                <div>
                  <h4 style={{ fontSize: '0.75rem', color: '#73716a', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1.25rem 0' }}>
                    Contents & Specifications
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {modalSections.map((sec, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSectionIndex(idx)}
                        style={{
                          background: activeSectionIndex === idx ? '#f5f4ef' : 'transparent',
                          border: 'none',
                          borderRadius: '4px',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          fontSize: '0.88rem',
                          color: activeSectionIndex === idx ? '#121212' : '#6e6d68',
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

                <div style={{ fontSize: '0.72rem', color: '#8c8a84', fontWeight: '500' }}>
                  Rising Media Works Editorial Press
                </div>
              </div>

              {/* Right Page: Content */}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fcfbfa' }}>
                <div style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#1c3a2f', fontWeight: '800', textTransform: 'uppercase' }}>
                    {modalSections[activeSectionIndex]?.label}
                  </span>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '0.5rem 0 1rem 0', color: '#121212' }}>
                    {modalSections[activeSectionIndex]?.title}
                  </h2>
                  <p style={{ fontSize: '0.98rem', lineHeight: '1.75', color: '#4a4843', margin: 0, whiteSpace: 'pre-line' }}>
                    {modalSections[activeSectionIndex]?.content}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eae8e1', paddingTop: '1rem' }}>
                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSectionIndex === 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      color: activeSectionIndex === 0 ? '#dedbd2' : '#121212',
                      cursor: activeSectionIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Previous
                  </button>

                  <span style={{ fontSize: '0.75rem', color: '#8c8a84', fontWeight: '600' }}>
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
                      color: activeSectionIndex === modalSections.length - 1 ? '#dedbd2' : '#121212',
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
