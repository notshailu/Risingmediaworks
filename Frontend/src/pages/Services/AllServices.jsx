import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { servicesData } from '../../data/dummyData';
import WaterBackground from '../../components/WaterBackground';

const AllServices = () => {
  const containerRef = useRef(null);
  const floatingImageRef = useRef(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [mousePos, setMousePos] = useState({ clientX: 0, clientY: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  useGSAP(() => {
    // Entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero-eyebrow', {
      opacity: 0,
      y: 15,
      duration: 1,
      delay: 0.1
    })
    .from('.hero-title-line', {
      opacity: 0,
      y: 45,
      duration: 1.2,
      stagger: 0.12
    }, '-=0.8')
    .from('.hero-desc', {
      opacity: 0,
      y: 20,
      duration: 1
    }, '-=0.8')
    .from('.scroll-indicator', {
      opacity: 0,
      y: 10,
      duration: 1
    }, '-=0.6');

    // Scroll trigger for divider lines and row reveals
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const row = entry.target;
          const line = row.querySelector('.divider-line');
          const content = row.querySelector('.row-content');

          if (line) {
            gsap.to(line, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' });
          }
          if (content) {
            gsap.to(content, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
          }
          revealObserver.unobserve(row);
        }
      });
    }, observerOptions);

    const rows = containerRef.current?.querySelectorAll('.service-row-block');
    rows?.forEach((row) => revealObserver.observe(row));

    return () => {
      revealObserver.disconnect();
    };
  }, { scope: containerRef });

  const handleMouseMove = (e) => {
    setMousePos({ clientX: e.clientX, clientY: e.clientY });
    if (floatingImageRef.current) {
      gsap.to(floatingImageRef.current, {
        x: e.clientX + 25,
        y: e.clientY - 95,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  // Explicit hover preview images corresponding to each service index
  const hoverImages = {
    'video-production': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=500&auto=format&fit=crop',
    'video-editing': 'https://i.pinimg.com/736x/12/a3/81/12a381aa8035415c33511ae7d0c76edf.jpg',
    'motion-graphics': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop',
    'branding-design': 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=500&auto=format&fit=crop',
    'web-design': 'https://i.pinimg.com/736x/0c/e8/08/0ce80850ca4f8ca3b3c367e370323a0e.jpg',
    'digital-content': 'https://i.pinimg.com/736x/1b/f0/b7/1bf0b79fc9d6a8c78bf528f83ccdb316.jpg',
    'photography': 'https://i.pinimg.com/736x/92/fd/f8/92fdf83f9ba8db832d81d0b486a2490d.jpg',
    'book-design': 'https://i.pinimg.com/1200x/3c/e7/4b/3ce74bc3ae3f60eeac738835773f2f47.jpg'
  };

  // Active Scroll Highlight for Services List - Dynamic bg color change on scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rows = containerRef.current?.querySelectorAll('.service-row-block');
          if (rows && rows.length > 0) {
            const viewportCenter = window.innerHeight / 2;
            let closestRow = null;
            let minDistance = Infinity;

            rows.forEach((row) => {
              const rect = row.getBoundingClientRect();
              if (rect.bottom > 80 && rect.top < window.innerHeight - 80) {
                const rowCenter = rect.top + rect.height / 2;
                const distance = Math.abs(rowCenter - viewportCenter);
                if (distance < minDistance) {
                  minDistance = distance;
                  closestRow = row;
                }
              }
            });

            rows.forEach((row) => {
              if (window.innerWidth > 1024 && row.matches(':hover')) {
                return;
              }

              const content = row.querySelector('.row-content');
              const numEl = row.querySelector('.service-num');
              const titleEl = row.querySelector('.service-title');
              const descEl = row.querySelector('.service-desc');
              const arrowEl = row.querySelector('.service-arrow');

              if (row === closestRow) {
                row.style.backgroundColor = '#0052ff';
                row.style.borderRadius = '12px';
                row.style.boxShadow = '0 10px 30px rgba(0, 82, 255, 0.45)';
                if (content) { content.style.color = '#ffffff'; content.style.padding = '1.8rem 1.25rem'; }
                if (numEl) { numEl.style.color = '#ffffff'; numEl.style.opacity = '0.95'; }
                if (titleEl) { titleEl.style.color = '#ffffff'; }
                if (descEl) { descEl.style.color = 'rgba(255, 255, 255, 0.95)'; }
                if (arrowEl) { arrowEl.style.color = '#ffffff'; arrowEl.style.transform = 'translateX(5px)'; }
              } else {
                row.style.backgroundColor = 'transparent';
                row.style.borderRadius = '0px';
                row.style.boxShadow = 'none';
                if (content) { content.style.color = '#000000'; content.style.padding = '1.8rem 0'; }
                if (numEl) { numEl.style.color = '#000000'; numEl.style.opacity = '1'; }
                if (titleEl) { titleEl.style.color = '#000000'; }
                if (descEl) { descEl.style.color = '#444444'; }
                if (arrowEl) { arrowEl.style.color = '#000000'; arrowEl.style.transform = 'none'; }
              }
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="all-services-page"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '120px 2rem 80px 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <WaterBackground />
      <div className="all-services-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
        
        {/* ================= HERO SECTION ================= */}
        <section className="all-services-hero" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="hero-eyebrow" style={{
            fontSize: '0.75rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#000000',
            fontWeight: '700',
            display: 'block',
            marginBottom: '1.5rem',
            fontFamily: "'Manrope', sans-serif"
          }}>
            OUR SERVICES
          </span>
          <h1 className="hero-main-title" style={{
            fontSize: 'calc(2.5rem + 3.2vw)',
            fontWeight: '700',
            textTransform: 'uppercase',
            margin: '0 0 2rem 0',
            letterSpacing: '-0.02em',
            lineHeight: '1.08',
            color: '#000000',
            fontFamily: "'Manrope', sans-serif"
          }}>
            <span className="hero-title-line" style={{ display: 'block' }}>From First Idea</span>
            <span className="hero-title-line" style={{ display: 'block', fontWeight: '300', fontStyle: 'italic', borderBottom: '2px solid #000000', display: 'inline-block', paddingBottom: '3px' }}>To Final Delivery.</span>
          </h1>
          <p className="hero-desc" style={{
            fontSize: '1.2rem',
            lineHeight: '1.8',
            color: '#444444',
            fontWeight: '300',
            maxWidth: '700px',
            margin: 0,
            fontFamily: "'Manrope', sans-serif"
          }}>
            One creative partner for the visual, digital, and content needs of your brand. Rising Media Works brings strategy, design, production, technology, and storytelling together under one creative roof.
          </p>
        </section>

        {/* ================= SERVICE PHILOSOPHY ================= */}
        <section className="service-philosophy-section" style={{
          padding: '4rem 3rem',
          backgroundColor: '#f9f9f9',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#000000', fontWeight: '700', fontFamily: "'Manrope', sans-serif", display: 'block', marginBottom: '0.8rem' }}>
              SERVICE PHILOSOPHY
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif", margin: 0, color: '#000000' }}>
              Built Around Your Brand.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: '1rem', lineHeight: '1.75', color: '#4b5563', margin: 0, fontFamily: "'Manrope', sans-serif", fontWeight: '300' }}>
              Every business is different. Your content should be too.<br />
              Instead of relying on generic templates or disconnected creative pieces, we develop visual solutions around your brand, audience, goals, and communication style.<br />
              The result is creative work that feels consistent, intentional, and recognisably yours.
            </p>
          </div>
        </section>

        {/* ================= SERVICES INDEX ================= */}
        <section style={{ display: 'flex', flexDirection: 'column', width: '100%', marginBottom: '4rem' }}>
          {servicesData.map((service, index) => {
            const isHovered = hoveredService === index;
            return (
              <div
                key={service.id}
                className="service-row-block"
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  width: '100%',
                  position: 'relative',
                  backgroundColor: isHovered ? '#2563eb' : 'transparent',
                  borderRadius: isHovered ? '12px' : '0px',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  boxShadow: isHovered ? '0 12px 35px rgba(37, 99, 235, 0.35)' : 'none'
                }}
              >
                {/* Thin animated divider line */}
                <div 
                  className="divider-line" 
                  style={{ 
                    height: '1px', 
                    backgroundColor: isHovered ? 'transparent' : '#e0e0e0', 
                    width: '100%',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'background-color 0.3s ease'
                  }} 
                />

                <Link
                  to={`/services/${service.id}`}
                  className="row-content"
                  style={{
                    display: 'block',
                    padding: isHovered ? '3rem 2rem' : '3rem 0',
                    textDecoration: 'none',
                    color: isHovered ? '#ffffff' : '#000000',
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="service-row-inner" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '2rem' }}>
                    <div className="service-title-box" style={{ display: 'flex', gap: '3rem', alignItems: 'baseline', flex: '1 1 400px' }}>
                      <span className="service-num" style={{ 
                        fontSize: '1.15rem', 
                        fontWeight: '600', 
                        color: isHovered ? '#93c5fd' : '#000000', 
                        fontFamily: "'Manrope', sans-serif",
                        transition: 'color 0.3s ease'
                      }}>
                        {`0${index + 1}`}
                      </span>
                      <h2 className="service-title" style={{ 
                        fontSize: 'calc(1.4rem + 1vw)', 
                        fontWeight: isHovered ? '700' : '600', 
                        textTransform: 'uppercase', 
                        margin: 0, 
                        fontFamily: "'Manrope', sans-serif",
                        letterSpacing: '-0.5px',
                        color: isHovered ? '#ffffff' : '#000000',
                        transform: `translateX(${isHovered ? '10px' : '0px'})`,
                        transition: 'transform 0.3s ease, font-weight 0.3s ease, color 0.3s ease'
                      }}>
                        {service.title}
                      </h2>
                    </div>

                    <div className="service-desc-box" style={{ 
                      flex: '1 1 350px',
                      opacity: isHovered ? 1 : 0.85,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <p className="service-desc" style={{ 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6', 
                        color: isHovered ? '#e0f2fe' : '#444444', 
                        margin: 0, 
                        fontWeight: '300', 
                        fontFamily: "'Manrope', sans-serif",
                        maxWidth: '300px',
                        transition: 'color 0.3s ease'
                      }}>
                        {service.overview}
                      </p>
                      <span className="service-arrow" style={{ 
                        fontSize: '1.5rem', 
                        color: isHovered ? '#ffffff' : '#000000',
                        transform: `translateX(${isHovered ? '5px' : '0px'})`,
                        transition: 'transform 0.3s ease, color 0.3s ease' 
                      }}>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
          
          {/* Final closing list boundary line */}
          <div 
            className="divider-line" 
            style={{ 
              height: '1px', 
              backgroundColor: '#e0e0e0', 
              width: '100%',
              transform: 'scaleX(0)',
              transformOrigin: 'left'
            }} 
          />
        </section>

        {/* ================= FINAL CTA SECTION ================= */}
        <section style={{ borderTop: 'none', paddingTop: '6rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{
            fontSize: 'calc(1.8rem + 1.8vw)',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: '#000000',
            fontFamily: "'Manrope', sans-serif",
            margin: 0,
            maxWidth: '800px',
            lineHeight: '1.2'
          }}>
            Let's Create Something <br />
            <span style={{ fontStyle: 'italic', fontWeight: '300', borderBottom: '2px solid #000000', paddingBottom: '3px' }}>Worth Remembering.</span>
          </h2>
          
          <p style={{
            fontSize: '1.15rem',
            lineHeight: '1.75',
            color: '#555555',
            fontWeight: '300',
            maxWidth: '600px',
            margin: '0 auto',
            fontFamily: 'serif'
          }}>
            Have an idea, a brand launch, or a media challenge? Let's turn it into something meaningful.
          </p>

          <Link to="/contact" style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '1px solid #000000',
            padding: '1.25rem 3rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '0.8rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            fontFamily: 'sans-serif'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.borderColor = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#000000';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#000000';
          }}
          >
            Start A Project →
          </Link>
        </section>
      </div>

      {/* ================= FLOATING IMAGE HOVER PREVIEW ================= */}
      <div
        ref={floatingImageRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '270px',
          height: '185px',
          pointerEvents: 'none',
          zIndex: 1000,
          overflow: 'hidden',
          borderRadius: '8px',
          boxShadow: '0 16px 36px rgba(0,0,0,0.2), 0 0 0 2px #2563eb',
          opacity: hoveredService !== null ? 1 : 0,
          transform: `scale(${hoveredService !== null ? 1 : 0.8})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      >
        {servicesData.map((service, idx) => (
          <img 
            key={service.id}
            src={hoverImages[service.id] || service.image || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=500&auto=format&fit=crop'} 
            alt={service.title} 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'none',
              opacity: hoveredService === idx ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default AllServices;
