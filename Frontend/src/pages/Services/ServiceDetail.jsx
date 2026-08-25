import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { servicesData, projectsData } from '../../data/dummyData';

// Before/After Drag Slider Component for Video Editing
const BeforeAfterSlider = () => {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={(e) => { if (isDragging) handleMove(e.clientX); }}
      onTouchMove={handleTouchMove}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        overflow: 'hidden',
        cursor: 'ew-resize',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        userSelect: 'none',
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* Before Image (Raw footage) */}
      <img 
        src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop" 
        alt="Before Post Production" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(100%) contrast(0.7) brightness(0.9)', // Simulated raw flat profile
          pointerEvents: 'none'
        }}
      />
      <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.4rem 0.8rem', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '2px', zIndex: 10 }}>
        RAW FOOTAGE
      </div>

      {/* After Image (Graded / Edited) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${sliderPos}%`,
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <img 
          src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop" 
          alt="After Post Production" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: containerRef.current ? containerRef.current.getBoundingClientRect().width : '600px',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
        />
      </div>
      <div style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#000', color: '#fff', padding: '0.4rem 0.8rem', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '2px', zIndex: 10 }}>
        FINAL COLOR GRADED
      </div>

      {/* Drag Handle Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${sliderPos}%`,
        width: '2px',
        backgroundColor: '#ffffff',
        zIndex: 5,
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
      }}>
        {/* Central Handler Badge */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#000000',
          border: '2px solid #ffffff',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}>
          ↔
        </div>
      </div>
    </div>
  );
};

// Featured Book Card with 3D open hover for Book Design Detail Page
const FeaturedBookCard = ({ book }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        textDecoration: 'none',
        color: 'inherit',
        perspective: '1200px',
        marginBottom: '2rem'
      }}
    >
      <div 
        style={{
          width: '100%',
          height: '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fcfcfc',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.4s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#000000';
          const cover = e.currentTarget.querySelector('.detail-book-cover');
          if (cover) {
            cover.style.transform = 'rotateY(-45deg)';
            cover.style.boxShadow = '20px 25px 50px rgba(0, 0, 0, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e0e0e0';
          const cover = e.currentTarget.querySelector('.detail-book-cover');
          if (cover) {
            cover.style.transform = 'rotateY(0deg)';
            cover.style.boxShadow = '5px 10px 20px rgba(0, 0, 0, 0.08)';
          }
        }}
      >
        <div 
          style={{
            width: '150px',
            height: '220px',
            position: 'relative',
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            transform: 'rotate(-5deg) translateY(0px)'
          }}
        >
          {/* Inside Page */}
          <div style={{
            position: 'absolute',
            width: '97%',
            height: '98%',
            top: '1%',
            left: '2%',
            backgroundColor: '#ffffff',
            boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1,
            borderRadius: '2px 8px 8px 2px',
            border: '1px solid #e0e0e0',
            borderLeft: 'none'
          }} />

          {/* Cover */}
          <div
            className="detail-book-cover"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              backgroundColor: '#111',
              borderRadius: '2px 6px 6px 2px',
              boxShadow: '5px 10px 20px rgba(0, 0, 0, 0.08)',
              transformOrigin: 'left center',
              transition: 'transform 0.5s ease, box-shadow 0.5s ease',
              zIndex: 2,
              overflow: 'hidden'
            }}
          >
            <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.7rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600' }}>
          {book.author}
        </span>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '300', margin: 0, fontFamily: 'serif', color: '#000' }}>
          {book.title}
        </h3>
      </div>
    </div>
  );
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('');

  const service = servicesData.find((s) => s.id === serviceId);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, [serviceId]);

  if (!service) {
    return (
      <div style={{ padding: '120px 2rem', textAlign: 'center', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
        <h2 style={{ fontFamily: 'serif', fontWeight: '300', fontSize: '2rem' }}>Service Not Found</h2>
        <Link to="/services" style={{ color: '#000000', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>Back to All Services</Link>
      </div>
    );
  }

  // Get custom process steps based on service type
  const getProcessSteps = () => {
    if (!service.process) return [];
    if (Array.isArray(service.process)) {
      return service.process.map((step, idx) => ({ label: `Step 0${idx + 1}`, desc: step }));
    }
    return Object.entries(service.process).map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      desc: value
    }));
  };

  const processSteps = getProcessSteps();

  // Load custom sections for navigation/rendering
  const getSectionsConfig = () => {
    const config = [
      { id: 'overview', title: 'Overview' },
      { id: 'capabilities', title: 'Capabilities' }
    ];
    if (processSteps.length > 0) config.push({ id: 'process', title: 'Our Process' });
    if (service.id === 'video-editing') config.push({ id: 'before-after', title: 'Before / After' });
    config.push({ id: 'featured-work', title: 'Featured Work' });
    config.push({ id: 'cta-block', title: 'Start Project' });
    return config;
  };

  const sections = getSectionsConfig();

  // Resolve projects Data matching dummyData IDs
  const featuredProjects = projectsData.filter((proj) =>
    service.featuredWorkIds?.includes(proj.id) || service.id === proj.category
  );

  // Set up active section observer on scroll
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection || 'overview');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.animate-header', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 0.1
    })
    .from('.animate-sidebar', {
      opacity: 0,
      x: -20,
      duration: 1
    }, '-=0.8')
    .from('.animate-content-section', {
      opacity: 0,
      y: 35,
      duration: 1.2,
      stagger: 0.1
    }, '-=0.8');
  }, { scope: containerRef });

  const handleSidebarClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Capabilities content resolver based on service database shape
  const renderCapabilitiesContent = () => {
    const list = service.whatWeCreate || service.editingServices;
    const keyVals = service.motionDetails || service.designAreas || service.contentTypes || service.shootElements || service.filmCategories || service.designElements;

    if (list) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
          {list.map((item, idx) => (
            <div key={idx} style={{ borderLeft: '2px solid #000', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#888888', fontWeight: '500' }}>{`0${idx + 1}`}</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '600', textTransform: 'uppercase', fontFamily: 'sans-serif', margin: 0, color: '#000000' }}>
                {item}
              </h4>
            </div>
          ))}
        </div>
      );
    }

    if (keyVals) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%' }}>
          {Object.entries(keyVals).map(([key, val], idx) => (
            <div key={key} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: '2rem', borderBottom: '1px solid #e0e0e0', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'baseline', flex: '1 1 250px' }}>
                <span style={{ fontSize: '1rem', color: '#888888', fontFamily: 'serif' }}>{`0${idx + 1}`}</span>
                <h4 style={{ fontSize: '1.4rem', fontWeight: '300', textTransform: 'uppercase', fontFamily: 'serif', margin: 0, color: '#000000' }}>
                  {key.replace(/([A-Z])/g, ' $1').replace('two D', '2D').replace('three D', '3D')}
                </h4>
              </div>
              <div style={{ flex: '1 1 450px' }}>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.65', color: '#444444', margin: 0, fontWeight: '300', fontFamily: 'serif' }}>
                  {val}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '120px 2rem 80px 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%', display: 'block' }}>
        
        {/* Back navigation & header banner */}
        <div className="animate-header" style={{ marginBottom: '5rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '3.5rem' }}>
          <Link
            to="/services"
            style={{
              fontSize: '0.75rem',
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '2rem',
              fontWeight: '600'
            }}
          >
            ← Back to All Services
          </Link>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888888', display: 'block', marginBottom: '0.75rem', fontFamily: 'sans-serif', fontWeight: '600' }}>
            SERVICE DETAIL
          </span>
          <h1 style={{
            fontSize: 'calc(2.2rem + 1.8vw)',
            fontWeight: '300',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            fontFamily: 'serif'
          }}>
            {service.title}
          </h1>
        </div>

        {/* Sidebar + Main Sections layout */}
        <div style={{ display: 'flex', gap: '5rem', position: 'relative', flexWrap: 'wrap' }}>
          
          {/* Sticky Left Sidebar Navigation */}
          <aside
            className="animate-sidebar"
            style={{
              width: '240px',
              position: 'sticky',
              top: '120px',
              height: 'calc(80vh - 120px)',
              overflowY: 'auto',
              flexShrink: 0,
              paddingRight: '1.5rem',
              borderRight: '1px solid #e0e0e0',
              marginBottom: '2rem'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {sections.map((sect) => (
                <a
                  key={sect.id}
                  href={`#${sect.id}`}
                  onClick={(e) => handleSidebarClick(e, sect.id)}
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    textDecoration: 'none',
                    color: activeSection === sect.id ? '#000000' : '#888888',
                    fontWeight: activeSection === sect.id ? '600' : '400',
                    transition: 'all 0.3s ease',
                    paddingLeft: activeSection === sect.id ? '0.75rem' : '0',
                    borderLeft: activeSection === sect.id ? '2px solid #000000' : '2px solid transparent'
                  }}
                >
                  {sect.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Scrollable Content Blocks */}
          <div style={{ flex: 1, display: 'block', minWidth: '320px' }}>
            
            {/* Overview Section */}
            <section
              id="overview"
              className="animate-content-section"
              style={{
                width: '100%',
                scrollMarginTop: '120px',
                paddingBottom: '6rem',
                borderBottom: '1px solid #e0e0e0',
                marginBottom: '6rem'
              }}
            >
              <h2 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '2.5rem', fontFamily: 'sans-serif' }}>
                01 / Overview
              </h2>
              <p style={{
                color: '#111111',
                fontSize: '1.4rem',
                lineHeight: '1.8',
                fontWeight: '300',
                margin: 0,
                fontFamily: 'serif',
                maxWidth: '800px'
              }}>
                {service.overview}
              </p>
            </section>

            {/* Capabilities Section */}
            <section
              id="capabilities"
              className="animate-content-section"
              style={{
                width: '100%',
                scrollMarginTop: '120px',
                paddingBottom: '6rem',
                borderBottom: '1px solid #e0e0e0',
                marginBottom: '6rem'
              }}
            >
              <h2 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '3.5rem', fontFamily: 'sans-serif' }}>
                02 / Capabilities
              </h2>
              {renderCapabilitiesContent()}
            </section>

            {/* Process Section */}
            {processSteps.length > 0 && (
              <section
                id="process"
                className="animate-content-section"
                style={{
                  width: '100%',
                  scrollMarginTop: '120px',
                  paddingBottom: '6rem',
                  borderBottom: '1px solid #e0e0e0',
                  marginBottom: '6rem'
                }}
              >
                <h2 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '3.5rem', fontFamily: 'sans-serif' }}>
                  03 / Production Journey
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {processSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '300', color: '#888888', width: '60px', fontFamily: 'serif' }}>
                        {`0${idx + 1}`}
                      </span>
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '500', color: '#000000', margin: '0 0 0.5rem 0', textTransform: 'uppercase', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>{step.label}</h4>
                        <p style={{ color: '#555555', fontSize: '1rem', lineHeight: '1.65', margin: 0, fontWeight: '300', fontFamily: 'serif' }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Before/After Drag Slider Widget for Video Editing */}
            {service.id === 'video-editing' && (
              <section
                id="before-after"
                className="animate-content-section"
                style={{
                  width: '100%',
                  scrollMarginTop: '120px',
                  paddingBottom: '6rem',
                  borderBottom: '1px solid #e0e0e0',
                  marginBottom: '6rem'
                }}
              >
                <h2 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '3rem', fontFamily: 'sans-serif' }}>
                  04 / Interactive Comparison
                </h2>
                <BeforeAfterSlider />
              </section>
            )}

            {/* Featured Work Grid */}
            <section
              id="featured-work"
              className="animate-content-section"
              style={{
                width: '100%',
                scrollMarginTop: '120px',
                paddingBottom: '6rem',
                borderBottom: '1px solid #e0e0e0',
                marginBottom: '6rem'
              }}
            >
              <h2 style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '3.5rem', fontFamily: 'sans-serif' }}>
                Featured Projects
              </h2>
              {featuredProjects.length === 0 ? (
                <p style={{ color: '#888888', fontFamily: 'serif', fontStyle: 'italic' }}>Publications or projects currently under NDA.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem' }}>
                  {featuredProjects.map((proj) => {
                    // Check if book layout rendering applies
                    if (service.id === 'book-design') {
                      return <FeaturedBookCard key={proj.id} book={proj} />;
                    }

                    return (
                      <div 
                        key={proj.id} 
                        style={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e0e0e0', 
                          borderRadius: '4px', 
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#000000';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e0e0e0';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0', borderBottom: '1px solid #e0e0e0' }}>
                          <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', color: '#888888', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.1em' }}>{proj.category.replace('-', ' ')}</span>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '400', color: '#000000', margin: 0, fontFamily: 'serif' }}>{proj.title}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Call To Action Block */}
            <section
              id="cta-block"
              className="animate-content-section"
              style={{
                width: '100%',
                scrollMarginTop: '120px',
                paddingBottom: '4rem'
              }}
            >
              <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', padding: '4.5rem 3rem', borderRadius: '4px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <h2 style={{ fontSize: 'calc(1.8rem + 1vw)', fontWeight: '300', textTransform: 'uppercase', color: '#000000', margin: 0, fontFamily: 'serif', lineHeight: '1.2', maxWidth: '650px' }}>
                  Have a Project in Mind? <br />
                  <span style={{ fontStyle: 'italic', borderBottom: '2px solid #000', paddingBottom: '3px' }}>Let's Create Something Remarkable.</span>
                </h2>
                <p style={{ color: '#555555', fontSize: '1.05rem', maxWidth: '550px', margin: '0 0 1rem 0', lineHeight: '1.7', fontWeight: '300', fontFamily: 'serif' }}>
                  Have an idea, a brand launch, or a complex publishing challenge? Collaborate with Rising Media Works to bring it into the real world.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link
                    to="/contact"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      padding: '1.2rem 3rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
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
                    Start Your Project
                  </Link>
                  <Link
                    to="/work"
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'transparent',
                      color: '#000000',
                      border: '1px solid #000000',
                      padding: '1.2rem 3rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#000000';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Explore Our Work
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
