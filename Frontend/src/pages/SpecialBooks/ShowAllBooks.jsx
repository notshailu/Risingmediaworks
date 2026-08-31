import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { booksData } from '../../data/dummyData';

const ShowAllBooks = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Force light theme
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  useGSAP(() => {
    // Entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.animate-header', {
      opacity: 0,
      y: 35,
      duration: 1.2
    })
    .from('.book-card', {
      opacity: 0,
      z: -600,
      rotationX: 35,
      rotationY: -25,
      y: 100,
      scale: 0.75,
      duration: 1.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.6');
  });

  return (
    <div
      className="show-all-books-page"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '120px 4rem 60px 4rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'serif'
      }}
    >
      {/* Header Block */}
      <div className="animate-header" style={{ marginBottom: '3rem', flexShrink: 0 }}>
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
            marginBottom: '1.5rem',
            fontFamily: 'sans-serif',
            fontWeight: '600'
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>←</span> Back to Featured
        </Link>
        
        <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '1.5rem' }}>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#888888',
            fontWeight: '600',
            display: 'block',
            marginBottom: '0.4rem',
            fontFamily: 'sans-serif'
          }}>
            Rising Media Works
          </span>
          <h1 className="show-all-books-title" style={{
            fontSize: 'calc(2.2rem + 1.2vw)',
            fontWeight: '400',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '0.04em',
            lineHeight: '1.1'
          }}>
            Complete Publications Archive
          </h1>
        </div>
      </div>

      <div className="show-all-books-grid" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '5rem 4rem',
        boxSizing: 'border-box',
        perspective: '2000px',
        transformStyle: 'preserve-3d'
      }}>
        {booksData.map((book) => (
          <Link
            key={book.id}
            to={`/special-books/${book.id}`}
            className="book-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              textDecoration: 'none',
              color: 'inherit',
              perspective: '1200px'
            }}
          >
            {/* Book Cover Container (Supports 3D Perspective Rotation) */}
            <div 
              style={{
                width: '100%',
                height: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.015)',
                border: '1px solid #e4e4e7',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.4)';
                const cover = e.currentTarget.querySelector('.book-3d-cover');
                if (cover) {
                  cover.style.transform = 'rotateY(-20deg) rotateX(5deg) translateZ(20px)';
                  cover.style.boxShadow = '-15px 25px 40px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4e4e7';
                const cover = e.currentTarget.querySelector('.book-3d-cover');
                if (cover) {
                  cover.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
                  cover.style.boxShadow = '-5px 10px 20px rgba(0, 0, 0, 0.12)';
                }
              }}
            >
              {/* Inner 3D Card Object */}
              <div
                className="book-3d-cover"
                style={{
                  width: '210px',
                  height: '310px',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(0deg) rotateX(0deg) translateZ(0)',
                  transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease',
                  boxShadow: '-5px 10px 20px rgba(0, 0, 0, 0.12)',
                  borderRadius: '2px 6px 6px 2px'
                }}
              >
                {/* Simulated book thickness spine */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '6px',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                  zIndex: 4,
                  pointerEvents: 'none'
                }} />

                <img
                  src={book.image}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '2px 6px 6px 2px',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {/* Book Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem' }}>
              <span style={{
                fontSize: '0.7rem',
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: '600',
                fontFamily: 'sans-serif'
              }}>
                {book.author}
              </span>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '300',
                margin: 0,
                fontFamily: 'serif',
                lineHeight: '1.25',
                color: '#000000'
              }}>
                {book.title}
              </h3>
              <p style={{
                fontSize: '0.88rem',
                color: '#71717a',
                lineHeight: '1.6',
                margin: 0,
                fontWeight: '300'
              }}>
                {book.description}
              </p>

              {/* Buy Now Action Button Row */}
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <a
                  href={book.buyUrl || book.finalBookUrl || 'https://www.amazon.com'}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '0.55rem 1.3rem',
                    borderRadius: '50px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    fontFamily: "'Valley Sans', 'Manrope', sans-serif",
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: '1px solid #000000'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0052ff';
                    e.currentTarget.style.borderColor = '#0052ff';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  BUY NOW ↗
                </a>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowAllBooks;
