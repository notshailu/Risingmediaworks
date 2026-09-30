import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const flameCanvasRef = useRef(null);

  const playHoverSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio context silenced or blocked
    }
  };

  const scrollToTop = () => {
    playHoverSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Interactive Blue Flame Tail Particle Physics on Cursor Movement
  useEffect(() => {
    // Disable particle canvas render loop on mobile devices where mousemove is unavailable
    if (window.innerWidth <= 1024 || 'ontouchstart' in window) return;

    const canvas = flameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const particles = [];

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn blue flame particles on cursor movement
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          size: Math.random() * 12 + 6,
          vx: (Math.random() - 0.5) * 2.2,
          vy: -Math.random() * 3 - 1, // Upward rising flame buoyancy!
          life: 1.0,
          decay: Math.random() * 0.035 + 0.02,
          color: Math.random() > 0.4 ? '#00f0ff' : (Math.random() > 0.5 ? '#3b6cff' : '#0052ff')
        });
      }
    };

    const container = canvas.parentElement;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy; // Rise upwards like flames
        p.size *= 0.94;
        p.life -= p.decay;

        if (p.life <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = p.life;
        ctx.shadowBlur = 18;
        ctx.shadowColor = p.color;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.35, p.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <footer id="footer" style={{
      width: '100%',
      backgroundColor: '#3b6cff', // Vibrant Royal Blue outer frame matching reference
      padding: '3vw',
      boxSizing: 'border-box'
    }}>
      {/* Inner Black Card Layout */}
      <div className="footer-inner-card" style={{
        backgroundColor: '#000000',
        borderRadius: '24px',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        padding: '5rem 4vw 0 4vw',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        
        {/* Blue Flame Canvas Trail Overlay */}
        <canvas
          ref={flameCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
        
        {/* Top 4-Column Header Grid */}
        <div className="footer-columns-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: '4rem',
          marginBottom: '6rem'
        }}>
          
          {/* Left Column: Brand Statement */}
          <div>
            <span style={{
              fontSize: '1rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#0052ff',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: '800',
              display: 'block',
              marginBottom: '1.2rem'
            }}>
              RISING MEDIA WORKS
            </span>

            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '400',
              lineHeight: '1.5',
              margin: '0 0 1rem 0',
              color: '#ffffff',
              maxWidth: '480px',
              fontFamily: "'Manrope', sans-serif"
            }}>
              We build brands that move.
            </h3>

            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.65',
              color: 'rgba(255, 255, 255, 0.65)',
              margin: '0 0 1rem 0',
              fontFamily: "'Manrope', sans-serif",
              fontWeight: '300'
            }}>
              Creative Agency for Branding, Film, Content & Digital.
            </p>
            
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.65',
              color: 'rgba(255, 255, 255, 0.65)',
              margin: 0,
              fontFamily: "'Manrope', sans-serif",
              fontWeight: '300'
            }}>
              Alwar, Rajasthan, India
            </p>
          </div>

          {/* Right Column 1: EXPLORE */}
          <div>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: 'monospace',
              display: 'block',
              marginBottom: '1.8rem'
            }}>
              EXPLORE
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { name: 'Work', path: '/work' },
                { name: 'Services', path: '/services' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((item, i) => (
                <li key={i}>
                  <Link 
                    to={item.path}
                    onMouseEnter={playHoverSound}
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '0.92rem',
                      fontFamily: "'Manrope', sans-serif",
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#3b6cff';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column 2: SERVICES */}
          <div>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: 'monospace',
              display: 'block',
              marginBottom: '1.8rem'
            }}>
              SERVICES
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                'Branding',
                'Content',
                'Film & Video',
                'Digital',
                'Publishing'
              ].map((cap, i) => (
                <li key={i} style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.92rem', fontFamily: "'Manrope', sans-serif", fontWeight: '300' }}>
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column 3: CONNECT */}
          <div>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: 'monospace',
              display: 'block',
              marginBottom: '1.8rem'
            }}>
              CONNECT
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { name: 'Instagram', url: 'https://www.instagram.com/risingmediaworks?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==' },
                { name: 'LinkedIn', url: '#linkedin' },
                { name: 'WhatsApp', url: 'https://wa.me/918741975000' },
                { name: 'Email', url: 'mailto:Info.risingmediaworks@gmail.com' }
              ].map((item, i) => (
                <li key={i}>
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={playHoverSound}
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '0.92rem',
                      fontFamily: "'Manrope', sans-serif",
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = '#3b6cff';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Massive Giant Typography Wordmark */}
        <div style={{
          position: 'relative',
          width: '100%',
          textAlign: 'center',
          overflow: 'hidden',
          lineHeight: 0.8,
          marginBottom: '2rem'
        }}>
          <h1 className="footer-giant-wordmark" style={{
            fontSize: 'calc(2rem + 8vw)',
            fontWeight: '800',
            fontFamily: "'Manrope', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            margin: 0,
            color: '#ffffff',
            display: 'block',
            lineHeight: '0.9',
            transform: 'translateY(5%)'
          }}>
            CREATE. DESIGN. BRAND. GROW.
          </h1>

          {/* Bottom Gradient Fade Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '140px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.6) 50%, transparent 100%)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="footer-bottom-bar" style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2.5rem 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.8rem',
          fontFamily: "'Manrope', sans-serif",
          color: 'rgba(255, 255, 255, 0.6)',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <span>© 2026 Rising Media Works. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none' }}>Terms & Conditions</Link>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '0.5rem 1.4rem',
              borderRadius: '20px',
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b6cff';
              e.currentTarget.style.color = '#3b6cff';
              e.currentTarget.style.backgroundColor = 'rgba(59, 108, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            BACK TO TOP ↑
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
