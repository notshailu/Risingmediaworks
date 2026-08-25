import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { booksData } from '../../data/dummyData';

const BookDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const containerRef = useRef(null);
  const bookContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const book = booksData.find((b) => b.id === id);

  const currentIndex = booksData.findIndex((b) => b.id === id);
  const prevBook = currentIndex > 0 ? booksData[currentIndex - 1] : null;
  const nextBook = currentIndex < booksData.length - 1 ? booksData[currentIndex + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Force light theme
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, [id]);

  // Entrance animations
  useGSAP(() => {
    gsap.from('.animate-header', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.animate-book-frame', {
      opacity: 0,
      scale: 0.95,
      y: 40,
      duration: 1.5,
      delay: 0.2,
      ease: 'power4.out'
    });
  }, { scope: containerRef });

  if (!book) {
    return (
      <div style={{ padding: '120px 2rem', textAlign: 'center', color: '#000000', fontFamily: 'sans-serif' }}>
        <h2>Book Project Not Found</h2>
        <Link to="/special-books" style={{ color: '#000000', textDecoration: 'underline' }}>Back to All Books</Link>
      </div>
    );
  }

  const sections = [
    { label: '01. Project Overview', title: 'Concept Overview', content: book.overview },
    { label: '02. Client Requirement', title: 'Client Requirement', content: book.requirement },
    { label: '03. Design Concept', title: 'Design Concept', content: book.concept },
    { label: '04. Cover Design', title: 'Cover Typography', content: book.coverDesign },
    { label: '05. Spine Specifications', title: 'Spine & Bind Details', content: book.spine },
    { label: '06. Back Cover Layout', title: 'Back Cover Typography', content: book.backCover },
    { label: '07. Interior Grid Design', title: 'Interior Layout Grid', content: book.interiorDesign },
    { label: '08. Print Specifications', title: 'Print Specifications', content: book.printSpecs },
    { label: '09. KDP & Publishing', title: 'Global KDP Publishing', content: book.publishingDetails }
  ];

  const handleOpenBook = () => {
    if (isOpen) return;
    
    const cover = bookContainerRef.current.querySelector('.book-cover-3d');
    const spread = bookContainerRef.current.querySelector('.book-inner-spread');

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
      }
    });

    // Swing open animation
    tl.to(cover, {
      rotationY: -145,
      duration: 1.4,
      ease: 'power3.inOut'
    })
    .to(spread, {
      opacity: 1,
      zIndex: 10,
      duration: 0.6
    }, '-=0.8');
  };

  useEffect(() => {
    if (location.state?.autoOpen) {
      const timer = setTimeout(() => {
        handleOpenBook();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [location.state, id]);

  const handleCloseBook = () => {
    if (!isOpen) return;

    const cover = bookContainerRef.current.querySelector('.book-cover-3d');
    const spread = bookContainerRef.current.querySelector('.book-inner-spread');

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
      }
    });

    tl.to(spread, {
      opacity: 0,
      zIndex: 1,
      duration: 0.4
    })
    .to(cover, {
      rotationY: 0,
      duration: 1.2,
      ease: 'power3.inOut'
    }, '-=0.2');
  };

  const handlePageChange = (index) => {
    if (index < 0 || index >= sections.length) return;

    gsap.fromTo('.book-page-right-content', 
      { opacity: 0, x: 15 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
    setActiveSectionIndex(index);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '90px 4rem 30px 4rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'serif'
      }}
    >
      {/* Top Header Block */}
      <div className="animate-header" style={{ marginBottom: '2rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Link
            to="/special-books"
            style={{
              fontSize: '0.75rem',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: 'sans-serif',
              fontWeight: '600'
            }}
          >
            <span style={{ fontSize: '0.9rem' }}>←</span> Back to All Books
          </Link>
          
          <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'sans-serif', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.15em' }}>
            {prevBook ? (
              <Link to={`/special-books/${prevBook.id}`} style={{ color: '#000000', textDecoration: 'none', textTransform: 'uppercase', transition: 'opacity 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.opacity=0.6} onMouseLeave={(e)=>e.currentTarget.style.opacity=1}>
                ← Prev Book
              </Link>
            ) : (
              <span style={{ color: '#cccccc', cursor: 'not-allowed', textTransform: 'uppercase' }}>← Prev Book</span>
            )}
            <span style={{ color: '#e5e5e5' }}>|</span>
            {nextBook ? (
              <Link to={`/special-books/${nextBook.id}`} style={{ color: '#000000', textDecoration: 'none', textTransform: 'uppercase', transition: 'opacity 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.opacity=0.6} onMouseLeave={(e)=>e.currentTarget.style.opacity=1}>
                Next Book →
              </Link>
            ) : (
              <span style={{ color: '#cccccc', cursor: 'not-allowed', textTransform: 'uppercase' }}>Next Book →</span>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #e5e5e5', paddingBottom: '1.2rem' }}>
          <div>
            <span style={{
              fontSize: '0.68rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#888888',
              fontWeight: '600',
              display: 'block',
              marginBottom: '0.3rem',
              fontFamily: 'sans-serif'
            }}>
              Interactive Book Profile
            </span>
            <h1 style={{
              fontSize: 'calc(1.8rem + 1vw)',
              fontWeight: '400',
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.02em',
              lineHeight: '1.1'
            }}>
              {book.title}
            </h1>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666666', textTransform: 'uppercase', letterSpacing: '0.18em', fontFamily: 'sans-serif', fontWeight: '600' }}>
            Author: {book.author}
          </span>
        </div>
      </div>

      {/* Main Interactive Stage Container */}
      <div 
        className="animate-book-frame"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
          position: 'relative'
        }}
      >
        {/* Interactive 3D Book Container */}
        <div 
          ref={bookContainerRef}
          style={{
            position: 'relative',
            width: isOpen ? '760px' : '260px',
            height: '420px',
            transition: 'width 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            perspective: '2000px',
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* CLOSED BOOK - CLICKABLE COVER PANEL */}
          <div
            className="book-cover-3d"
            onClick={handleOpenBook}
            style={{
              position: 'absolute',
              width: '260px',
              height: '380px',
              backgroundColor: '#0a2240',
              borderRadius: '4px 12px 12px 4px',
              borderLeft: '5px solid #ffffff',
              boxShadow: isOpen ? 'none' : '0 25px 50px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              padding: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              cursor: isOpen ? 'default' : 'pointer',
              transformOrigin: 'left center',
              zIndex: isOpen ? 1 : 12,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.4s ease, box-shadow 0.4s ease'
            }}
          >
            {/* Front Cover Artwork Text */}
            <div style={{ backfaceVisibility: 'hidden', transform: 'translateZ(2px)' }}>
              <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 'bold' }}>
                Volume 01
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1rem 0' }}>
                {book.title}
              </h2>
              <span style={{ fontSize: '0.65rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                [ Click to Open Book ]
              </span>
            </div>
          </div>

          {/* OPEN BOOK - TWO-PAGE INNER SPREAD PANEL */}
          <div
            className="book-inner-spread"
            style={{
              position: 'absolute',
              width: '760px',
              height: '385px',
              backgroundColor: '#fbfbfb',
              boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
              borderRadius: '4px',
              border: '1px solid #e0e0e0',
              display: 'flex',
              opacity: isOpen ? 1 : 0,
              zIndex: isOpen ? 10 : 1,
              overflow: 'hidden',
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
          >
            {/* Left Page: Table of Contents / Index Navigation */}
            <div style={{
              flex: 1,
              borderRight: '1px solid #e5e5e5',
              padding: '2.2rem 2.5rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              <div>
                <h3 style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 1.2rem 0', fontFamily: 'sans-serif' }}>
                  Table of Contents
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {sections.map((sec, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePageChange(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontFamily: 'serif',
                        fontSize: '0.88rem',
                        color: activeSectionIndex === idx ? '#000000' : '#888888',
                        fontWeight: activeSectionIndex === idx ? '600' : '400',
                        cursor: 'pointer',
                        padding: '0.1rem 0',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              <span style={{ fontSize: '0.65rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'sans-serif' }}>
                Rising Media Works © 2026
              </span>
            </div>

            {/* Right Page: Active Section Detail Display */}
            <div style={{
              flex: 1,
              padding: '2.2rem 2.5rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              <div className="book-page-right-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '250px', paddingRight: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600', fontFamily: 'sans-serif' }}>
                  {sections[activeSectionIndex].label}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '400', margin: 0, textTransform: 'uppercase' }}>
                  {sections[activeSectionIndex].title}
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#333333', lineHeight: '1.65', fontWeight: '300', margin: 0 }}>
                  {sections[activeSectionIndex].content}
                </p>
              </div>

              {/* Turn Page Navigation footer inside Right Page */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '0.8rem',
                flexShrink: 0
              }}>
                <button
                  onClick={() => handlePageChange(activeSectionIndex - 1)}
                  disabled={activeSectionIndex === 0}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.7rem',
                    fontFamily: 'sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: activeSectionIndex === 0 ? '#cccccc' : '#000000',
                    cursor: activeSectionIndex === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← Prev
                </button>
                
                <span style={{ fontSize: '0.7rem', fontFamily: 'sans-serif', color: '#888888' }}>
                  Page {activeSectionIndex + 1} of {sections.length}
                </span>

                <button
                  onClick={() => handlePageChange(activeSectionIndex + 1)}
                  disabled={activeSectionIndex === sections.length - 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.7rem',
                    fontFamily: 'sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: activeSectionIndex === sections.length - 1 ? '#cccccc' : '#000000',
                    cursor: activeSectionIndex === sections.length - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stage Control Actions (Buy Now & Close Book) */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '3rem',
          width: '100%',
          maxWidth: '450px',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isOpen && (
            <button 
              onClick={handleCloseBook}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                color: '#000000',
                border: '1px solid #000000',
                padding: '1rem 2rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '0.75rem',
                cursor: 'pointer',
                borderRadius: '0px',
                transition: 'all 0.3s ease',
                fontFamily: 'sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000000';
              }}
            >
              Close Book
            </button>
          )}

          <button 
            style={{
              flex: 1,
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              padding: '1rem 2rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '0.75rem',
              cursor: 'pointer',
              borderRadius: '0px',
              transition: 'all 0.3s ease',
              fontFamily: 'sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
