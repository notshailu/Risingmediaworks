import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { booksData } from '../../data/dummyData';
import WaterBackground from '../../components/WaterBackground';

const BookDetail = () => {
  const { id } = useParams();
  const containerRef = useRef(null);
  const bookCoverRef = useRef(null);
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('light-theme');
    
    // Fetch book from API, fallback to dummyData if not found or off-grid
    const fetchBookData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/books/${id}`);
        if (res.ok) {
          const apiBook = await res.json();
          setBook({
            id: apiBook._id,
            title: apiBook.title,
            author: apiBook.author,
            description: apiBook.description,
            overview: apiBook.description,
            price: apiBook.price,
            image: apiBook.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
            buyUrl: apiBook.buyUrl,
            category: apiBook.category || 'Special Book',
            printSpecs: apiBook.printSpecs || '6x9 inch • Hardcover',
            gridSpec: apiBook.gridSpec || '12-Column Editorial',
            publishingSpec: apiBook.publishingSpec || 'KDP & IngramSpark',
            paperSpec: apiBook.paperSpec || 'Cream 120gsm / Matte',
            finalBookUrl: apiBook.finalBookUrl
          });
        } else {
          const found = booksData.find((b) => b.id === id);
          setBook(found || null);
        }
      } catch (err) {
        const found = booksData.find((b) => b.id === id);
        setBook(found || null);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();

    return () => {
      document.body.classList.remove('light-theme');
    };
  }, [id]);

  const currentIndex = booksData.findIndex((b) => b.id === id);
  const prevBook = currentIndex > 0 ? booksData[currentIndex - 1] : null;
  const nextBook = currentIndex < booksData.length - 1 ? booksData[currentIndex + 1] : null;
  const otherBooks = booksData.filter((b) => b.id !== id).slice(0, 3);

  // Entrance animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from('.animate-nav', {
      opacity: 0,
      y: -20,
      duration: 0.8
    })
    .from('.animate-hero-left', {
      opacity: 0,
      x: -40,
      duration: 1
    }, '-=0.4')
    .from('.animate-hero-right', {
      opacity: 0,
      x: 40,
      duration: 1
    }, '-=0.8')
    .from('.animate-spec-card', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8
    }, '-=0.6');
  }, { scope: containerRef, dependencies: [id] });

  if (!book) {
    return (
      <div style={{ padding: '140px 2rem', textAlign: 'center', color: '#000000', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '300' }}>Book Project Not Found</h2>
        <Link to="/special-books" style={{ color: '#2563eb', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
          Back to All Special Books
        </Link>
      </div>
    );
  }

  const sections = [
    { id: 'overview', label: '01. Overview', title: 'Concept Overview', content: book.overview },
    { id: 'requirement', label: '02. Requirement', title: 'Client Requirement', content: book.requirement },
    { id: 'concept', label: '03. Design Concept', title: 'Design Concept', content: book.concept },
    { id: 'coverDesign', label: '04. Cover Design', title: 'Cover Typography', content: book.coverDesign },
    { id: 'spine', label: '05. Spine Specs', title: 'Spine & Bind Details', content: book.spine },
    { id: 'backCover', label: '06. Back Cover', title: 'Back Cover Layout', content: book.backCover },
    { id: 'interiorDesign', label: '07. Interior Layout', title: 'Interior Layout Grid', content: book.interiorDesign },
    { id: 'printSpecs', label: '08. Print Specs', title: 'Print Specifications', content: book.printSpecs },
    { id: 'publishingDetails', label: '09. Publishing', title: 'Global KDP Publishing', content: book.publishingDetails }
  ];

  const handleMouseMoveCover = (e) => {
    if (!bookCoverRef.current || isOpen) return;
    const rect = bookCoverRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseOffset({ x: x / 12, y: -y / 12 });
  };

  const handleMouseLeaveCover = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#fcfcfc',
        color: '#000000',
        padding: '110px 2rem 80px 2rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      <WaterBackground />

      <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* TOP NAVIGATION BAR */}
        <div className="animate-nav" style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          paddingBottom: '2rem',
          borderBottom: '1px solid #e5e5e5',
          marginBottom: '3.5rem'
        }}>
          <Link
            to="/special-books"
            style={{
              fontSize: '0.85rem',
              color: '#000000',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: '600',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <span style={{ fontSize: '1.1rem' }}>←</span> Back to Books Archive
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.82rem',
            fontWeight: '600'
          }}>
            {prevBook ? (
              <Link
                to={`/special-books/${prevBook.id}`}
                style={{ color: '#000000', textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                ← Prev Book
              </Link>
            ) : (
              <span style={{ color: '#cccccc', cursor: 'not-allowed' }}>← Prev Book</span>
            )}
            <span style={{ color: '#d1d5db' }}>|</span>
            {nextBook ? (
              <Link
                to={`/special-books/${nextBook.id}`}
                style={{ color: '#000000', textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.6}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                Next Book →
              </Link>
            ) : (
              <span style={{ color: '#cccccc', cursor: 'not-allowed' }}>Next Book →</span>
            )}
          </div>
        </div>

        {/* HERO SECTION: 3D BOOK & EDITORIAL HEADER */}
        <div className="book-detail-hero" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 460px) 1fr',
          gap: '4.5rem',
          alignItems: 'center',
          marginBottom: '5rem'
        }}>
          
          {/* LEFT: REAL 3D INTERACTIVE BOOK COVER */}
          <div className="animate-hero-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              ref={bookCoverRef}
              onMouseMove={handleMouseMoveCover}
              onMouseLeave={handleMouseLeaveCover}
              onClick={() => setIsOpen(true)}
              style={{
                position: 'relative',
                width: '290px',
                height: '410px',
                perspective: '1200px',
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* 3D BOOK CONTAINER */}
              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${mouseOffset.x}deg) rotateX(${mouseOffset.y}deg)`,
                transition: 'transform 0.15s ease-out'
              }}>
                {/* BOOK FRONT COVER */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '4px 12px 12px 4px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.06)',
                  backgroundColor: '#111827'
                }}>
                  <img
                    src={book.image}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* REALISTIC BOOK COVER OVERLAY & SPINE GRADIENT */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '28px',
                    background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.15) 50%, rgba(0,0,0,0.2) 100%)',
                    pointerEvents: 'none'
                  }} />

                  {/* GLOSS REFLECTION ON HOVER */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
                    pointerEvents: 'none'
                  }} />
                  
                  {/* HOVER BADGE */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#ffffff',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontFamily: "'Manrope', sans-serif",
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    whiteSpace: 'nowrap'
                  }}>
                    📖 Click to Open Book
                  </div>
                </div>

                {/* 3D SPINE SIMULATION */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '18px',
                  height: '100%',
                  backgroundColor: '#1f2937',
                  transformOrigin: 'left',
                  transform: 'rotateY(-90deg)',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }} />
              </div>
            </div>

          </div>

          {/* RIGHT: EDITORIAL DETAILS & METADATA */}
          <div className="animate-hero-right" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.35rem 0.9rem',
                borderRadius: '50px',
                fontFamily: "'Manrope', sans-serif",
                border: '1px solid #bfdbfe'
              }}>
                {book.category ? book.category.replace('-', ' ') : 'Special Book'}
              </span>
              
              <span style={{ fontSize: '0.78rem', color: '#6b7280', fontFamily: "'Manrope', sans-serif", fontWeight: '500' }}>
                • Hardcover & KDP Edition
              </span>
            </div>

            <h1 style={{
              fontSize: 'calc(2.2rem + 1.8vw)',
              fontWeight: '500',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: '1.15',
              fontFamily: "'Manrope', sans-serif",
              color: '#000000'
            }}>
              {book.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontFamily: "'Manrope', sans-serif" }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '0.2rem' }}>Author</span>
                <span style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{book.author}</span>
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb' }} />
              <div>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '0.2rem' }}>Format Specs</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '500', color: '#374151' }}>{book.printSpecs || '6x9 inch • Hardcover'}</span>
              </div>
            </div>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#4b5563',
              fontWeight: '300',
              margin: 0,
              fontFamily: "'Manrope', sans-serif",
              maxWidth: '650px'
            }}>
              {book.description || book.overview}
            </p>

            <a
              href={book.buyUrl || book.finalBookUrl || 'https://www.amazon.com'}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: '#0052ff',
                color: '#ffffff',
                padding: '0.85rem 2.4rem',
                borderRadius: '50px',
                fontSize: '0.82rem',
                fontWeight: '700',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontFamily: "'Valley Sans', 'Manrope', sans-serif",
                marginTop: '0.4rem',
                width: 'fit-content',
                boxShadow: '0 4px 20px rgba(0, 82, 255, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0052ff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 82, 255, 0.4)';
              }}
            >
              BUY NOW ↗
            </a>

            {/* KEY HIGHLIGHTS SPEC GRID */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.2rem',
              marginTop: '1rem',
              paddingTop: '1.8rem',
              borderTop: '1px solid #f3f4f6'
            }}>
              <div className="animate-spec-card" style={{
                backgroundColor: '#ffffff',
                padding: '1.2rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: "'Manrope', sans-serif", fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Grid Layout</span>
                <span style={{ fontSize: '0.9rem', color: '#111827', fontFamily: "'Manrope', sans-serif", fontWeight: '600' }}>{book.gridSpec || '12-Column Editorial'}</span>
              </div>

              <div className="animate-spec-card" style={{
                backgroundColor: '#ffffff',
                padding: '1.2rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: "'Manrope', sans-serif", fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Publishing</span>
                <span style={{ fontSize: '0.9rem', color: '#111827', fontFamily: "'Manrope', sans-serif", fontWeight: '600' }}>{book.publishingSpec || 'KDP & IngramSpark'}</span>
              </div>

              <div className="animate-spec-card" style={{
                backgroundColor: '#ffffff',
                padding: '1.2rem',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: "'Manrope', sans-serif", fontWeight: '500', display: 'block', marginBottom: '0.3rem' }}>Paper & Finish</span>
                <span style={{ fontSize: '0.9rem', color: '#111827', fontFamily: "'Manrope', sans-serif", fontWeight: '600' }}>{book.paperSpec || 'Cream 120gsm / Matte'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MORE SPECIAL BOOKS CAROUSEL / ARCHIVE */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            borderBottom: '1px solid #e5e5e5',
            paddingBottom: '1.2rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', fontFamily: "'Manrope', sans-serif", display: 'block', marginBottom: '0.3rem' }}>
                Explore Publishing Archive
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '500', margin: 0, fontFamily: "'Manrope', sans-serif", color: '#111827' }}>
                Other Special Books
              </h2>
            </div>
            <Link
              to="/special-books"
              style={{
                fontSize: '0.82rem',
                color: '#2563eb',
                fontWeight: '600',
                fontFamily: "'Manrope', sans-serif",
                textDecoration: 'none'
              }}
            >
              View All Books →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {otherBooks.map((other) => (
              <Link
                key={other.id}
                to={`/special-books/${other.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  backgroundColor: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{
                  height: '280px',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
                }}>
                  <img
                    src={other.image}
                    alt={other.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600', fontFamily: "'Manrope', sans-serif" }}>
                    {other.author}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '500', margin: '0.4rem 0 0 0', fontFamily: "'Manrope', sans-serif", color: '#111827' }}>
                    {other.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* FULL-SCREEN 3D BOOK SPREAD READER MODAL */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1000px',
            height: '620px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* MODAL HEADER */}
            <div style={{
              padding: '1.2rem 2.5rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9fafb'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '600', fontFamily: "'Manrope', sans-serif" }}>
                  Interactive Spread Reader
                </span>
                <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '500', fontFamily: "'Manrope', sans-serif", color: '#111827' }}>
                  {book.title}
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ✕
              </button>
            </div>

            {/* TWO-PAGE SPREAD BODY */}
            <div style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              overflow: 'hidden'
            }}>
              {/* LEFT PAGE: CONTENTS & IMAGE */}
              <div style={{
                padding: '3rem',
                borderRight: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff'
              }}>
                <div>
                  <h4 style={{ fontSize: '0.78rem', color: '#9ca3af', fontFamily: "'Manrope', sans-serif", fontWeight: '600', margin: '0 0 1.5rem 0' }}>
                    Table of Contents
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {sections.map((sec, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSectionIndex(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          fontFamily: "'Manrope', sans-serif",
                          fontSize: '0.95rem',
                          color: activeSectionIndex === idx ? '#2563eb' : '#4b5563',
                          fontWeight: activeSectionIndex === idx ? '600' : '400',
                          cursor: 'pointer',
                          padding: '0.2rem 0',
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {sec.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: "'Manrope', sans-serif" }}>
                  Rising Media Works Editorial © 2026
                </div>
              </div>

              {/* RIGHT PAGE: DETAIL CONTENT */}
              <div style={{
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#fbfbfb'
              }}>
                <div style={{ overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600', fontFamily: "'Manrope', sans-serif" }}>
                    {sections[activeSectionIndex].label}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '500', margin: '0.6rem 0 1.2rem 0', fontFamily: "'Manrope', sans-serif", color: '#111827' }}>
                    {sections[activeSectionIndex].title}
                  </h2>
                  <p style={{ fontSize: '1rem', lineHeight: '1.75', color: '#374151', fontWeight: '300', fontFamily: "'Manrope', sans-serif", margin: 0 }}>
                    {sections[activeSectionIndex].content || 'Comprehensive specifications for layout, margins, type hierarchy, and print-ready publishing.'}
                  </p>
                </div>

                {/* PAGE FOOTER NAV */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1.2rem'
                }}>
                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSectionIndex === 0}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: '600',
                      color: activeSectionIndex === 0 ? '#d1d5db' : '#000000',
                      cursor: activeSectionIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← Previous
                  </button>

                  <span style={{ fontSize: '0.78rem', fontFamily: "'Manrope', sans-serif", color: '#9ca3af' }}>
                    Page {activeSectionIndex + 1} of {sections.length}
                  </span>

                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.min(sections.length - 1, prev + 1))}
                    disabled={activeSectionIndex === sections.length - 1}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: '600',
                      color: activeSectionIndex === sections.length - 1 ? '#d1d5db' : '#000000',
                      cursor: activeSectionIndex === sections.length - 1 ? 'not-allowed' : 'pointer'
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
