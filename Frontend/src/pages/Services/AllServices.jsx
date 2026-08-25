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
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target.querySelector('.divider-line'), {
            scaleX: 1,
            duration: 1.2,
            ease: 'power2.inOut'
          });
          gsap.to(entry.target.querySelector('.row-content'), {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.1
          });
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const rows = document.querySelectorAll('.service-row-block');
    rows.forEach(row => {
      revealObserver.observe(row);
    });

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
    'video-editing': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=500&auto=format&fit=crop',
    'motion-graphics': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500&auto=format&fit=crop',
    'branding-design': 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=500&auto=format&fit=crop',
    'social-media': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500&auto=format&fit=crop',
    'product-shoots': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop',
    'documentary-corporate': 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop',
    'book-design': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop'
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'transparent',
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
        
        {/* ================= HERO SECTION ================= */}
        <section style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="hero-eyebrow" style={{
            fontSize: '0.75rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#888888',
            fontWeight: '600',
            display: 'block',
            marginBottom: '1.5rem',
            fontFamily: 'sans-serif'
          }}>
            OUR SERVICES
          </span>
          <h1 style={{
            fontSize: 'calc(2.5rem + 3.2vw)',
            fontWeight: '300',
            textTransform: 'uppercase',
            margin: '0 0 2rem 0',
            letterSpacing: '-0.02em',
            lineHeight: '1.08',
            color: '#000000',
            fontFamily: 'serif'
          }}>
            <span className="hero-title-line" style={{ display: 'block' }}>We Turn Ideas</span>
            <span className="hero-title-line" style={{ display: 'block', fontStyle: 'italic', borderBottom: '2px solid #000000', display: 'inline-block', paddingBottom: '3px' }}>Into Visual Experiences.</span>
          </h1>
          <p className="hero-desc" style={{
            fontSize: '1.25rem',
            lineHeight: '1.8',
            color: '#444444',
            fontWeight: '300',
            maxWidth: '650px',
            margin: 0,
            fontFamily: 'serif'
          }}>
            Rising Media Works brings together storytelling, production, design, motion, branding, and digital content to create work that connects with people.
          </p>
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
                  position: 'relative'
                }}
              >
                {/* Thin animated divider line */}
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

                <Link
                  to={`/services/${service.id}`}
                  className="row-content"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '3rem 0',
                    textDecoration: 'none',
                    color: 'inherit',
                    opacity: 0,
                    transform: 'translateY(20px)',
                    transition: 'padding 0.3s ease',
                    display: 'block' // Ensure structure matches block
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '3rem', alignItems: 'baseline', flex: '1 1 400px' }}>
                      <span style={{ 
                        fontSize: '1.15rem', 
                        fontWeight: '300', 
                        color: isHovered ? '#000000' : '#888888', 
                        fontFamily: 'serif',
                        transition: 'color 0.3s ease'
                      }}>
                        {`0${index + 1}`}
                      </span>
                      <h2 style={{ 
                        fontSize: 'calc(1.4rem + 1vw)', 
                        fontWeight: isHovered ? '400' : '300', 
                        textTransform: 'uppercase', 
                        margin: 0, 
                        fontFamily: 'serif',
                        letterSpacing: '-0.5px',
                        transform: `translateX(${isHovered ? '10px' : '0px'})`,
                        transition: 'transform 0.3s ease, font-weight 0.3s ease'
                      }}>
                        {service.title}
                      </h2>
                    </div>

                    <div style={{ 
                      flex: '1 1 350px',
                      opacity: isHovered ? 1 : 0.6,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <p style={{ 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6', 
                        color: '#444444', 
                        margin: 0, 
                        fontWeight: '300', 
                        fontFamily: 'serif',
                        maxWidth: '300px'
                      }}>
                        {service.overview}
                      </p>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        transform: `translateX(${isHovered ? '5px' : '0px'})`,
                        transition: 'transform 0.3s ease' 
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
        <section style={{ borderTop: '1px solid #e0e0e0', paddingTop: '6rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{
            fontSize: 'calc(1.8rem + 1.8vw)',
            fontWeight: '300',
            textTransform: 'uppercase',
            color: '#000000',
            fontFamily: 'serif',
            margin: 0,
            maxWidth: '800px',
            lineHeight: '1.2'
          }}>
            Let's Create Something <br />
            <span style={{ fontStyle: 'italic', borderBottom: '2px solid #000', paddingBottom: '3px' }}>Worth Remembering.</span>
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
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            fontFamily: 'sans-serif',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#000000';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            Start a Conversation →
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
          width: '260px',
          height: '180px',
          pointerEvents: 'none',
          zIndex: 1000,
          overflow: 'hidden',
          borderRadius: '4px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          opacity: hoveredService !== null ? 1 : 0,
          transform: `scale(${hoveredService !== null ? 1 : 0.8})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      >
        {servicesData.map((service, idx) => (
          <img 
            key={service.id}
            src={hoverImages[service.id]} 
            alt="" 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'grayscale(100%)',
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
