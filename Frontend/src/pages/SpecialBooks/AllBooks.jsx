import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { booksData } from '../../data/dummyData';
const AllBooks = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const bookAssetRef = useRef(null);
  const mouseMoveHandlerRef = useRef(null);
  const [canClick, setCanClick] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(6);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Force light theme
    document.body.classList.add('light-theme');

    // Prevent immediate click-through from navigation clicks
    const timer = setTimeout(() => {
      setCanClick(true);
    }, 450);

    return () => {
      document.body.classList.remove('light-theme');
      clearTimeout(timer);
    };
  }, []);

  useGSAP(() => {
    // Entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-serif-line', {
      opacity: 0,
      y: 80,
      duration: 1.5,
      stagger: 0.15
    })
    .from('.hero-book-mockup-trigger', {
      opacity: 0,
      scale: 0.8,
      y: 100,
      rotation: 5,
      duration: 1.8,
      ease: 'power3.out'
    }, '-=1.2')
    .from('.book-card', {
      opacity: 0,
      z: -600,
      rotationX: 35,
      rotationY: -25,
      y: 100,
      scale: 0.75,
      duration: 1.8,
      stagger: 0.12,
      ease: 'power3.out'
    }, '-=0.8');

    // Subtle floating mouse-move effect on the overlay asset
    const handleMouseMove = (e) => {
      if (!bookAssetRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX - window.innerWidth / 2) * 0.03;
      const yPos = (clientY - window.innerHeight / 2) * 0.03;

      gsap.to(bookAssetRef.current, {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: 'power2.out'
      });
    };

    mouseMoveHandlerRef.current = handleMouseMove;
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (mouseMoveHandlerRef.current) {
        window.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      }
    };
  }, { scope: containerRef });

  const handleHeroBookClick = () => {
    if (!canClick) return;
    
    if (mouseMoveHandlerRef.current) {
      window.removeEventListener('mousemove', mouseMoveHandlerRef.current);
      mouseMoveHandlerRef.current = null;
    }

    const book = bookAssetRef.current;
    const cover = book.querySelector('.book-front-cover-hero');

    const tl = gsap.timeline({
      onComplete: () => {
        navigate('/special-books/all');
      }
    });

    // Center and scale book flat on screen, then swing open the cover
    tl.to(book, {
      x: () => {
        const rect = book.getBoundingClientRect();
        const centerOffsetX = (window.innerWidth / 2) - (rect.left + rect.width / 2);
        return `+=${centerOffsetX}`;
      },
      y: () => {
        const rect = book.getBoundingClientRect();
        const centerOffsetY = (window.innerHeight / 2) - (rect.top + rect.height / 2);
        return `+=${centerOffsetY}`;
      },
      rotation: 0,
      rotationY: 0,
      scale: 2.2,
      duration: 1.2,
      ease: 'power3.inOut'
    })
    .to(cover, {
      rotationY: -130, // Swing front cover open
      duration: 1.2,
      ease: 'power3.inOut'
    }, '-=0.2')
    .to(book, {
      opacity: 0,
      scale: 3,
      duration: 0.6,
      ease: 'power2.in'
    }, '-=0.4');
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        paddingTop: '120px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >

      {/* Hero Big Typography Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '0 2rem'
      }}>
        <div style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '900px'
        }}>
          <span style={{
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#888888',
            fontWeight: '600',
            display: 'block',
            marginBottom: '1.2rem',
            fontFamily: 'sans-serif'
          }}>
            BOOK DESIGN & PUBLISHING
          </span>

          <h1 className="hero-serif-line" style={{
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: '300',
            fontFamily: 'serif',
            lineHeight: '1.05',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em'
          }}>
            Great Ideas Deserve <br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>A Great Cover.</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.75',
            color: 'var(--text-color)',
            opacity: 0.8,
            maxWidth: '650px',
            margin: '1.5rem 0 0 0',
            fontFamily: 'serif',
            fontWeight: '300'
          }}>
            From concept to print-ready artwork, we help authors and publishers turn manuscripts into professionally designed books.
          </p>
        </div>

        {/* Angled Layered Overlay Book Mockup Asset */}
        <div
          ref={bookAssetRef}
          className="hero-book-mockup-trigger all-books-mockup"
          onClick={handleHeroBookClick}
          style={{
            position: 'absolute',
            zIndex: 3,
            right: '25%',
            top: '30%',
            width: '160px',
            height: '240px',
            transform: 'rotate(18deg) translateY(-20px)',
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            perspective: '1000px'
          }}
        >
          {/* Inside Page (representing the book content pages) */}
          <div className="book-page-inside-hero" style={{
            position: 'absolute',
            width: '98%',
            height: '98%',
            top: '1%',
            left: '1%',
            backgroundColor: '#ffffff',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
            zIndex: 1,
            borderRadius: '2px 8px 8px 2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#111111',
            fontSize: '0.65rem',
            fontFamily: 'serif',
            textAlign: 'center',
            padding: '1rem',
            boxSizing: 'border-box'
          }}>
            RISING <br /> EDITION 01
          </div>

          {/* Front Cover (swings open) */}
          <div className="book-front-cover-hero" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: '#0a2240',
            borderRadius: '4px 12px 12px 4px',
            borderLeft: '4px solid #ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            padding: '1.5rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 'bold',
            boxShadow: '20px 30px 50px rgba(0,0,0,0.25)',
            transformOrigin: 'left center', // swing hinge on the left
            zIndex: 2,
            transition: 'transform 0.4s ease'
          }}>
            Rising <br /> Publishing <br /> Vol 01
          </div>
        </div>

        {/* Dynamic Keyframes Injection */}
        <style>{`
          @keyframes pulseCircle {
            0%, 100% { transform: scale(1); border-color: rgba(0, 0, 0, 0.3); }
            50% { transform: scale(1.08); border-color: rgba(0, 0, 0, 0.85); box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.03); }
          }
          @keyframes slideArrow {
            0% { transform: translateY(-10px); opacity: 0; }
            40% { transform: translateY(0px); opacity: 1; }
            80%, 100% { transform: translateY(10px); opacity: 0; }
          }
        `}</style>

        {/* Scroll Down Button */}
        <div
          onClick={() => {
            const filterBar = document.getElementById('books-filter-bar');
            if (filterBar) {
              filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 5,
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.7; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}
        >
          <span style={{
            fontSize: '0.62rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--text-color)',
            fontFamily: 'sans-serif',
            fontWeight: '600',
            marginBottom: '0.7rem',
            opacity: 0.7,
            transition: 'opacity 0.3s ease'
          }}>
            Scroll Down
          </span>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--text-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-color)',
            overflow: 'hidden',
            position: 'relative',
            animation: 'pulseCircle 2.2s infinite ease-in-out'
          }}>
            <span style={{ 
              display: 'inline-block', 
              animation: 'slideArrow 2.2s infinite cubic-bezier(0.25, 1, 0.5, 1)' 
            }}>
              ↓
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar (Placed at Bottom of Hero) */}
      {/* Books Listing Grid */}
      <div 
        className="all-books-grid"
        style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 4rem 10rem 4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '5rem 4rem',
        boxSizing: 'border-box',
        perspective: '2000px',
        transformStyle: 'preserve-3d'
      }}>
        {booksData.slice(0, displayLimit).map((book, idx) => (
          <Link
            key={book.id}
            to={`/special-books/${book.id}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              const card = e.currentTarget.querySelector('.book-3d-wrap-all');
              const glow = e.currentTarget.querySelector('.book-ambient-glow-all');
              const badge = e.currentTarget.querySelector('.book-badge-all');
              if (card) {
                card.style.transform = 'translateY(-15px) rotateY(-22deg) rotateX(8deg) scale(1.03)';
              }
              if (glow) {
                glow.style.opacity = '0.75';
                glow.style.transform = 'scale(1.15) translateZ(-10px)';
              }
              if (badge) {
                badge.style.transform = 'translateY(-4px) scale(1.05)';
                badge.style.boxShadow = '0 8px 20px rgba(191, 144, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget.querySelector('.book-3d-wrap-all');
              const glow = e.currentTarget.querySelector('.book-ambient-glow-all');
              const badge = e.currentTarget.querySelector('.book-badge-all');
              if (card) {
                card.style.transform = 'rotateY(-8deg) rotateX(2deg)';
              }
              if (glow) {
                glow.style.opacity = '0';
                glow.style.transform = 'scale(1) translateZ(-10px)';
              }
              if (badge) {
                badge.style.transform = 'none';
                badge.style.boxShadow = 'none';
              }
            }}
          >
            {/* 3D Book Interactive Wrapper */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              backgroundColor: '#fbfbfa',
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.04)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3rem 2rem',
              boxSizing: 'border-box',
              overflow: 'visible',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {/* Ambient Glow using blurred book image colors */}
              <div 
                className="book-ambient-glow-all"
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: '15%',
                  right: '15%',
                  bottom: '15%',
                  backgroundImage: `url(${book.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(35px) saturate(1.8)',
                  opacity: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  transform: 'translateZ(-10px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }} 
              />

              {/* 3D Standing Book Structure */}
              <div 
                className="book-3d-wrap-all"
                style={{
                  width: '190px',
                  height: '270px',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-8deg) rotateX(2deg)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 2
                }}
              >
                {/* Simulated Book Spine Thickness (Left 3D side) */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '24px',
                  transform: 'rotateY(-90deg) translateX(-12px)',
                  transformOrigin: 'left center',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 20%, rgba(255,255,255,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                  backgroundColor: '#1a1a1a',
                  zIndex: 3
                }} />

                {/* Simulated Page Edge Thickness (Right 3D side) */}
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '2px',
                  bottom: '2px',
                  width: '20px',
                  transform: 'rotateY(90deg) translateX(10px)',
                  transformOrigin: 'right center',
                  background: 'repeating-linear-gradient(to right, #f4f3ef 0px, #f4f3ef 2px, #e8e7e1 3px, #e8e7e1 4px)',
                  borderRight: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.08)',
                  zIndex: 1
                }} />

                {/* Book Front Cover */}
                <div 
                  className="book-front-cover"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${book.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '2px 5px 5px 2px',
                    boxShadow: 'inset 4px 0 8px rgba(255,255,255,0.15), -4px 6px 15px rgba(0,0,0,0.15)',
                    zIndex: 4,
                    transform: 'translateZ(1px)'
                  }}
                >
                  {/* Spine Crease Line overlay */}
                  <div style={{
                    position: 'absolute',
                    left: '10px',
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 0 3px rgba(255,255,255,0.2)'
                  }} />
                </div>

                {/* Back Cover shadow anchor */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  boxShadow: '-12px 18px 30px rgba(0,0,0,0.28)',
                  transform: 'translateZ(-12px)',
                  borderRadius: '2px 5px 5px 2px',
                  zIndex: 0
                }} />
              </div>

              {/* Collector Badge Overlay */}
              <span 
                className="book-badge-all"
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#9a7b56',
                  border: '1px solid rgba(154, 123, 86, 0.3)',
                  backgroundColor: 'rgba(251, 251, 250, 0.8)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  zIndex: 5,
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {idx % 3 === 0 ? 'Collector\'s Edit' : idx % 3 === 1 ? 'Hardcover' : 'First Edition'}
              </span>
            </div>

            {/* Typography Metadata Redesign */}
            <div style={{ marginTop: '1.8rem', paddingLeft: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.4rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '400', 
                  fontFamily: 'serif', 
                  margin: 0,
                  lineHeight: '1.3',
                  color: '#1a1a1a',
                  letterSpacing: '-0.01em'
                }}>
                  {book.title}
                </h3>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#9a7b56',
                  fontWeight: '300'
                }}>
                  →
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                <span style={{ 
                  fontSize: '0.72rem', 
                  color: '#888888', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  fontWeight: '600',
                  fontFamily: 'sans-serif'
                }}>
                  By {book.author}
                </span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#cccccc' }} />
                <span style={{ 
                  fontSize: '0.68rem', 
                  color: '#9a7b56',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: '600',
                  fontFamily: 'sans-serif'
                }}>
                  {book.category.replace('-', ' ')}
                </span>
              </div>
              <p style={{
                fontSize: '0.88rem',
                color: '#666666',
                lineHeight: '1.6',
                margin: 0,
                fontWeight: '300',
                fontFamily: 'serif'
              }}>
                {book.description}
              </p>
            </div>
          </Link>
        ))}
      </div>


      {/* See All Books action button */}
      {booksData.length > displayLimit && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '8rem', position: 'relative', zIndex: 10 }}>
          <Link
            to="/special-books/all"
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              padding: '1.1rem 2.6rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.22em',
              textDecoration: 'none',
              display: 'inline-block',
              cursor: 'pointer',
              borderRadius: '0px',
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
              fontFamily: 'sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.letterSpacing = '0.26em';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.letterSpacing = '0.22em';
            }}
          >
            See All Books
          </Link>
        </div>
      )}

      {/* Coming Soon Section */}
      <div style={{
        borderTop: '1px solid var(--card-border)',
        padding: '8rem 4rem',
        marginTop: '6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.01)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: '#000000',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          fontWeight: '600',
          marginBottom: '1.5rem',
          display: 'block'
        }}>
          Upcoming Publications
        </span>
        <h2 style={{
          fontFamily: 'serif',
          fontSize: 'calc(2rem + 1.5vw)',
          fontWeight: '300',
          textTransform: 'uppercase',
          margin: '0 0 1rem 0',
          letterSpacing: '0.05em',
          color: 'var(--text-color)'
        }}>
          Coming Soon
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-muted)',
          maxWidth: '550px',
          lineHeight: '1.7',
          margin: '0 0 4rem 0',
          fontWeight: '300'
        }}>
          We are currently designing and curating our next batch of editorial designs and technical literature editions. Sign up below to get early updates.
        </p>

        {/* Silhouettes of Upcoming Books (Styled like the top Hero cover mockup) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '5rem',
          flexWrap: 'wrap',
          margin: '3rem auto 6rem auto',
          width: '100%',
          maxWidth: '800px'
        }}>
          {/* Upcoming Book 1 */}
          <div 
            style={{
              width: '170px',
              height: '250px',
              position: 'relative',
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              transform: 'rotate(-10deg) translateY(0px)',
              transition: 'transform 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(-10deg) translateY(-12px) scale(1.05)';
              const cover = e.currentTarget.querySelector('.book-cover-3d');
              if (cover) {
                cover.style.transform = 'rotateY(-50deg)'; // Open cover halfway
                cover.style.boxShadow = '25px 35px 60px rgba(0,0,0,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(-10deg) translateY(0px)';
              const cover = e.currentTarget.querySelector('.book-cover-3d');
              if (cover) {
                cover.style.transform = 'rotateY(0deg)';
                cover.style.boxShadow = '15px 25px 45px rgba(0,0,0,0.18)';
              }
            }}
          >
            {/* Pages Inside */}
            <div style={{
              position: 'absolute',
              width: '97%',
              height: '98%',
              top: '1%',
              left: '2%',
              backgroundColor: '#f6f6f6',
              boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.15)',
              zIndex: 1,
              borderRadius: '2px 8px 8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333333',
              fontSize: '0.55rem',
              fontFamily: 'serif',
              textAlign: 'center',
              padding: '1rem',
              boxSizing: 'border-box',
              border: '1px solid #e0e0e0',
              borderLeft: 'none'
            }}>
              RISING MEDIA <br />
              EDITION 03
            </div>

            {/* Front Cover */}
            <div 
              className="book-cover-3d"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: '#0a2240', // Deep Indigo
                borderRadius: '4px 10px 10px 4px',
                borderLeft: '4px solid #ffffff',
                boxShadow: '15px 25px 45px rgba(0,0,0,0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                padding: '1.5rem',
                boxSizing: 'border-box',
                textAlign: 'center',
                transformOrigin: 'left center', // hinge on left side
                transition: 'transform 0.5s ease, box-shadow 0.5s ease',
                zIndex: 2,
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.65rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Vol. 03
              </span>
              <span style={{ fontSize: '1rem', fontFamily: 'serif', fontStyle: 'italic', lineHeight: '1.3', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Architectural <br /> Space
              </span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2rem' }}>
                Coming OCT
              </span>
            </div>
          </div>

          {/* Upcoming Book 2 */}
          <div 
            style={{
              width: '170px',
              height: '250px',
              position: 'relative',
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              transform: 'rotate(12deg) translateY(10px)',
              transition: 'transform 0.4s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'rotate(12deg) translateY(-2px) scale(1.05)';
              const cover = e.currentTarget.querySelector('.book-cover-3d');
              if (cover) {
                cover.style.transform = 'rotateY(-50deg)'; // Open cover halfway
                cover.style.boxShadow = '25px 35px 60px rgba(0,0,0,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'rotate(12deg) translateY(10px)';
              const cover = e.currentTarget.querySelector('.book-cover-3d');
              if (cover) {
                cover.style.transform = 'rotateY(0deg)';
                cover.style.boxShadow = '15px 25px 45px rgba(0,0,0,0.18)';
              }
            }}
          >
            {/* Pages Inside */}
            <div style={{
              position: 'absolute',
              width: '97%',
              height: '98%',
              top: '1%',
              left: '2%',
              backgroundColor: '#f6f6f6',
              boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.15)',
              zIndex: 1,
              borderRadius: '2px 8px 8px 2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333333',
              fontSize: '0.55rem',
              fontFamily: 'serif',
              textAlign: 'center',
              padding: '1rem',
              boxSizing: 'border-box',
              border: '1px solid #e0e0e0',
              borderLeft: 'none'
            }}>
              RISING MEDIA <br />
              EDITION 04
            </div>

            {/* Front Cover */}
            <div 
              className="book-cover-3d"
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: '#1c1c1c', // Charcoal
                borderRadius: '4px 10px 10px 4px',
                borderLeft: '4px solid #ffffff',
                boxShadow: '15px 25px 45px rgba(0,0,0,0.18)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                padding: '1.5rem',
                boxSizing: 'border-box',
                textAlign: 'center',
                transformOrigin: 'left center', // hinge on left side
                transition: 'transform 0.5s ease, box-shadow 0.5s ease',
                zIndex: 2,
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.65rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Vol. 04
              </span>
              <span style={{ fontSize: '1rem', fontFamily: 'serif', fontStyle: 'italic', lineHeight: '1.3', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Minimalist <br /> Code Bases
              </span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2rem' }}>
                Coming NOV
              </span>
            </div>
          </div>
        </div>

        {/* Minimalist Newsletter Form */}
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '450px',
          borderBottom: '1px solid var(--text-color)',
          paddingBottom: '0.5rem'
        }}>
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL FOR UPDATES"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-color)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif'
            }}
          />
          <button style={{
            background: 'transparent',
            border: 'none',
            color: '#000000',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            padding: '0 0.5rem'
          }}>
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
