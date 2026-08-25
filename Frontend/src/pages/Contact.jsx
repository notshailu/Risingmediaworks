import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Contact = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Add light theme class on mount
    document.body.classList.add('light-theme');
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  useGSAP(() => {
    // 1. Entrance Animations for page elements
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.animate-label', {
      opacity: 0,
      y: 15,
      duration: 1,
      delay: 0.2
    })
    .from('.animate-title', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      stagger: 0.1
    }, '-=0.8')
    .from('.animate-input', {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1
    }, '-=0.8')
    .from('.animate-info-block', {
      opacity: 0,
      x: 20,
      duration: 1,
      stagger: 0.15
    }, '-=1');

    // 2. Mouse follow ambient glow effect
    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(glowRef.current, {
        x: x,
        y: y,
        duration: 1.5,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 2rem 60px 2rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.4s ease, color 0.4s ease'
      }}
    >
      {/* Ambient background glow */}
      <div 
        ref={glowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.04) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />

      <div style={{ maxWidth: '1100px', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '5rem', textAlign: 'left' }}>
          <span className="animate-label" style={{
            fontSize: '0.75rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#888888',
            fontWeight: '600',
            display: 'block',
            marginBottom: '1rem',
            fontFamily: 'sans-serif'
          }}>
            Get In Touch
          </span>
          <h1 className="animate-title" style={{
            fontSize: 'calc(2.2rem + 2vw)',
            fontWeight: '300',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: '1.15',
            color: '#000000',
            fontFamily: 'serif'
          }}>
            Let's create something <br />
            <span style={{ fontStyle: 'italic', fontWeight: '400', borderBottom: '2px solid #000', paddingBottom: '4px' }}>remarkable</span> together.
          </h1>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5rem',
          marginTop: '2rem'
        }}>
          {/* Form Side */}
          <div style={{ flex: '1 1 550px' }}>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                <div className="animate-input" style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: 'sans-serif', fontWeight: '600' }}>Your Name</label>
                  <input type="text" style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    padding: '0.75rem 0',
                    color: '#000000',
                    outline: 'none',
                    fontSize: '1.05rem',
                    fontFamily: 'serif',
                    transition: 'border-color 0.3s ease'
                  }} 
                  onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                  />
                </div>
                <div className="animate-input" style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: 'sans-serif', fontWeight: '600' }}>Your Email</label>
                  <input type="email" style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    padding: '0.75rem 0',
                    color: '#000000',
                    outline: 'none',
                    fontSize: '1.05rem',
                    fontFamily: 'serif',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                  />
                </div>
              </div>

              <div className="animate-input" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: 'sans-serif', fontWeight: '600' }}>Enquiry Type</label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <select style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #e0e0e0',
                    padding: '0.75rem 0',
                    color: '#000000',
                    outline: 'none',
                    fontSize: '1.05rem',
                    fontFamily: 'serif',
                    transition: 'border-color 0.3s ease',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                  onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                  >
                    <option value="start-project">Start a Project</option>
                    <option value="project-enquiry">Project Enquiry</option>
                    <option value="general">General Support</option>
                    <option value="other">Other</option>
                  </select>
                  <div style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#000000',
                    fontSize: '0.8rem'
                  }}>▼</div>
                </div>
              </div>

              <div className="animate-input" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: 'sans-serif', fontWeight: '600' }}>Message</label>
                <textarea rows="4" style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #e0e0e0',
                  padding: '0.75rem 0',
                  color: '#000000',
                  outline: 'none',
                  fontSize: '1.05rem',
                  fontFamily: 'serif',
                  resize: 'none',
                  transition: 'border-color 0.3s ease',
                  lineHeight: '1.6'
                }}
                onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                ></textarea>
              </div>

              <button className="animate-input" type="submit" style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                padding: '1.25rem 3rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '0.8rem',
                cursor: 'pointer',
                alignSelf: 'flex-start',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                fontFamily: 'sans-serif',
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
                Send Message
              </button>
            </form>
          </div>

          {/* Details Side */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '3.5rem', justifyContent: 'flex-start', paddingTop: '1rem' }}>
            <div className="animate-info-block" style={{ borderLeft: '2px solid #000000', paddingLeft: '1.5rem' }}>
              <h4 style={{ color: '#888888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.75rem', fontWeight: '600', fontFamily: 'sans-serif' }}>Office Location</h4>
              <p style={{ color: '#000000', fontSize: '1.05rem', margin: 0, lineHeight: '1.6', fontWeight: '300', fontFamily: 'serif' }}>
                100 Creative Boulevard,<br />
                Suite 400, Paris 75001
              </p>
            </div>

            <div className="animate-info-block" style={{ borderLeft: '2px solid #000000', paddingLeft: '1.5rem' }}>
              <h4 style={{ color: '#888888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.75rem', fontWeight: '600', fontFamily: 'sans-serif' }}>Contact Methods</h4>
              <div style={{ color: '#000000', fontSize: '1.05rem', margin: 0, lineHeight: '2.1', fontWeight: '300', fontFamily: 'serif' }}>
                <div><strong>Email:</strong> <a href="mailto:Info.risingmediaworks@gmail.com" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed #666' }}>Info.risingmediaworks@gmail.com</a></div>
                <div><strong>Phone:</strong> <a href="tel:+918741975000" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed #666' }}>+91 87419 75000</a></div>
                <div><strong>WhatsApp:</strong> <a href="https://wa.me/918741975000" target="_blank" rel="noreferrer" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid #25D366', paddingBottom: '1px' }}>Chat with us</a></div>
              </div>
            </div>

            <div className="animate-info-block" style={{ borderLeft: '2px solid #000000', paddingLeft: '1.5rem' }}>
              <h4 style={{ color: '#888888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.75rem', fontWeight: '600', fontFamily: 'sans-serif' }}>Project Enquiry</h4>
              <p style={{ color: '#000000', fontSize: '1.05rem', margin: 0, lineHeight: '1.65', fontWeight: '300', fontFamily: 'serif' }}>
                Ready to <strong>Start a Project</strong>? <br />
                Fill out the contact form or reach out via WhatsApp for a faster response. We usually reply within 24 hours.
              </p>
            </div>

            <div className="animate-info-block" style={{ borderLeft: '2px solid #000000', paddingLeft: '1.5rem' }}>
              <h4 style={{ color: '#888888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.75rem', fontWeight: '600', fontFamily: 'sans-serif' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/risingmediaworks?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==' },
                  { name: 'LinkedIn', url: '#linkedin' },
                  { name: 'Twitter', url: '#twitter' }
                ].map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noreferrer" style={{
                    fontSize: '0.95rem',
                    color: '#000000',
                    fontFamily: 'serif',
                    transition: 'border-bottom 0.2s ease',
                    borderBottom: '1px solid transparent',
                    paddingBottom: '2px'
                  }}
                  onMouseEnter={(e) => e.target.style.borderBottomColor = '#000000'}
                  onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
