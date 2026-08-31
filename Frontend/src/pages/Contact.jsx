import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { notifyNativeNewInquiry } from '../utils/nativeBridge';

const Contact = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'Video Production',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please enter your name and email address.');
      return;
    }

    const newInquiry = {
      id: 'inq-' + Date.now(),
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      projectType: formData.projectType,
      details: formData.details,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    try {
      const existing = JSON.parse(localStorage.getItem('rmw_inquiries') || '[]');
      existing.unshift(newInquiry);
      localStorage.setItem('rmw_inquiries', JSON.stringify(existing));

      // 1. Real-time Broadcast to Admin across browser tabs & windows
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('rmw_inquiries_channel');
        channel.postMessage({ type: 'NEW_INQUIRY', inquiry: newInquiry });
        channel.close();
      }

      // 2. Trigger React Native Mobile App Container Event & Haptics
      notifyNativeNewInquiry(newInquiry);

      // 3. Trigger Browser Native Push Notification if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('📩 New Project Inquiry Received!', {
          body: `${newInquiry.name} requested ${newInquiry.projectType}`,
          icon: '/favicon.svg'
        });
      }

      // 3. Post to backend API endpoint
      fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInquiry)
      }).catch(err => console.warn('Backend inquiry sync:', err.message));

    } catch (err) {
      console.error('Error saving inquiry:', err);
    }

    setSubmitted(true);
  };

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
        <div style={{ marginBottom: '4rem', textAlign: 'left' }}>
          <span className="animate-label" style={{
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#666666',
            fontWeight: '700',
            display: 'block',
            marginBottom: '1rem',
            fontFamily: "'Manrope', sans-serif"
          }}>
            START A PROJECT
          </span>
          <h1 className="animate-title" style={{
            fontSize: 'calc(2.4rem + 2vw)',
            fontWeight: '700',
            textTransform: 'uppercase',
            margin: '0 0 1.2rem 0',
            letterSpacing: '-0.02em',
            lineHeight: '1.15',
            color: '#000000',
            fontFamily: "'Manrope', sans-serif"
          }}>
            Have An Idea? <br />
            <span style={{ fontStyle: 'italic', fontWeight: '300', borderBottom: '2px solid #000', paddingBottom: '4px' }}>Let's Build It.</span>
          </h1>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.75',
            color: '#555555',
            maxWidth: '720px',
            margin: 0,
            fontFamily: "'Manrope', sans-serif",
            fontWeight: '300'
          }}>
            Whether you need a brand video, website, social media content, motion graphics, branding, or book design, tell us what you're working on. We'll help you shape the idea into a clear creative direction.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5rem',
          marginTop: '2rem'
        }}>
          {/* Form Side */}
          <div style={{ flex: '1 1 550px' }}>
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#000000', fontWeight: '700', fontFamily: "'Manrope', sans-serif", marginBottom: '2.5rem' }}>
              TELL US ABOUT YOUR PROJECT.
            </h3>

            {submitted ? (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2.5rem', borderRadius: '16px', color: '#166534' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Enquiry Received!</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Thank you, <strong>{formData.name}</strong>. Your project details have been successfully submitted to our team. We'll review your enquiry and get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', company: '', email: '', phone: '', projectType: 'Video Production', details: '' }); }}
                  style={{ marginTop: '1.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#166534', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                  <div className="animate-input" style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: "'Manrope', sans-serif", fontWeight: '700' }}>Name *</label>
                    <input 
                      type="text" 
                      placeholder="Your Full Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        padding: '0.75rem 0',
                        color: '#000000',
                        outline: 'none',
                        fontSize: '1.05rem',
                        fontFamily: "'Manrope', sans-serif",
                        transition: 'border-color 0.3s ease'
                      }} 
                      onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                    />
                  </div>
                  <div className="animate-input" style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: "'Manrope', sans-serif", fontWeight: '700' }}>Company / Brand</label>
                    <input 
                      type="text" 
                      placeholder="Your Brand Name" 
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        padding: '0.75rem 0',
                        color: '#000000',
                        outline: 'none',
                        fontSize: '1.05rem',
                        fontFamily: "'Manrope', sans-serif",
                        transition: 'border-color 0.3s ease'
                      }} 
                      onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                  <div className="animate-input" style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: "'Manrope', sans-serif", fontWeight: '700' }}>Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="name@domain.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        padding: '0.75rem 0',
                        color: '#000000',
                        outline: 'none',
                        fontSize: '1.05rem',
                        fontFamily: "'Manrope', sans-serif",
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                    />
                  </div>
                  <div className="animate-input" style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: "'Manrope', sans-serif", fontWeight: '700' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid #e0e0e0',
                        padding: '0.75rem 0',
                        color: '#000000',
                        outline: 'none',
                        fontSize: '1.05rem',
                        fontFamily: "'Manrope', sans-serif",
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                      onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                  <div className="animate-input" style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: "'Manrope', sans-serif", fontWeight: '700' }}>Project Type</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <select 
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        style={{
                          width: '100%',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid #e0e0e0',
                          padding: '0.75rem 0',
                          color: '#000000',
                          outline: 'none',
                          fontSize: '1.05rem',
                          fontFamily: "'Manrope', sans-serif",
                          transition: 'border-color 0.3s ease',
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                        onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                      >
                        <option value="Video Production">Video Production</option>
                        <option value="Video Editing">Video Editing</option>
                        <option value="Motion Graphics">Motion Graphics</option>
                        <option value="Branding & Identity">Branding & Identity</option>
                        <option value="Web Design & Development">Web Design & Development</option>
                        <option value="Digital Content & Social Media">Digital Content & Social Media</option>
                        <option value="Photography & Visual Production">Photography & Visual Production</option>
                        <option value="Book Design & Publishing">Book Design & Publishing</option>
                      </select>
                      <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#000000', fontSize: '0.8rem' }}>▼</div>
                    </div>
                  </div>
                </div>

                <div className="animate-input" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000000', fontFamily: "'Manrope', sans-serif", fontWeight: '700' }}>Project Details</label>
                  <textarea 
                    rows="4" 
                    placeholder="Tell us about your brand goals, target audience, and timeline..." 
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      padding: '0.75rem 0',
                      color: '#000000',
                      outline: 'none',
                      fontSize: '1.05rem',
                      fontFamily: "'Manrope', sans-serif",
                      resize: 'none',
                      transition: 'border-color 0.3s ease',
                      lineHeight: '1.6'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                    onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: '1px solid #000000',
                    padding: '1.25rem 3rem',
                    borderRadius: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Manrope', sans-serif",
                    marginTop: '1.5rem',
                    opacity: 1,
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0052ff';
                    e.currentTarget.style.borderColor = '#0052ff';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,82,255,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Submit Project Enquiry →
                </button>
              </form>
            )}
          </div>

          {/* Direct Details Side */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '3.5rem', justifyContent: 'flex-start', paddingTop: '1rem' }}>
            <div className="animate-info-block" style={{ borderLeft: '2px solid #000000', paddingLeft: '1.5rem' }}>
              <h4 style={{ color: '#888888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '1rem', fontWeight: '700', fontFamily: "'Manrope', sans-serif" }}>Contact Directly</h4>
              <div style={{ color: '#000000', fontSize: '1.05rem', margin: 0, lineHeight: '2.2', fontWeight: '400', fontFamily: "'Manrope', sans-serif" }}>
                <div><strong>Email:</strong> <a href="mailto:Info.risingmediaworks@gmail.com" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed #666' }}>Info.risingmediaworks@gmail.com</a></div>
                <div><strong>Phone:</strong> <a href="tel:+918741975000" style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed #666' }}>+91 87419 75000</a></div>
                <div style={{ marginTop: '0.5rem' }}><strong>WhatsApp:</strong> <a href="https://wa.me/918741975000" target="_blank" rel="noreferrer" style={{ color: '#000000', textDecoration: 'none', fontWeight: '700', borderBottom: '2px solid #000000', paddingBottom: '2px' }}>Chat with us →</a></div>
              </div>
            </div>

            <div className="animate-info-block" style={{ borderLeft: '2px solid #000000', paddingLeft: '1.5rem' }}>
              <h4 style={{ color: '#888888', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '1rem', fontWeight: '700', fontFamily: "'Manrope', sans-serif" }}>Connect With Us</h4>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/risingmediaworks?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==' },
                  { name: 'LinkedIn', url: '#linkedin' },
                  { name: 'Twitter', url: '#twitter' }
                ].map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noreferrer" style={{
                    fontSize: '1rem',
                    color: '#000000',
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: '500',
                    transition: 'border-bottom 0.2s ease',
                    borderBottom: '1px solid transparent',
                    paddingBottom: '2px',
                    textDecoration: 'none'
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
