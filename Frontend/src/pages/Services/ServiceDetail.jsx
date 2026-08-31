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
        src="https://i.pinimg.com/736x/12/a3/81/12a381aa8035415c33511ae7d0c76edf.jpg" 
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
          src="https://i.pinimg.com/736x/12/a3/81/12a381aa8035415c33511ae7d0c76edf.jpg" 
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
    // Enforce dark black theme for dynamic service detail pages
    document.body.classList.remove('light-theme');
  }, [serviceId]);

  // Mobile Active Scroll Highlight for Process Methodology Steps - Strictly ONE item at a time (rAF throttled)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (window.innerWidth > 1024) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const steps = document.querySelectorAll('.process-step-col');
          if (steps.length > 0) {
            const viewportCenter = window.innerHeight / 2;
            let closestStep = null;
            let minDistance = Infinity;

            steps.forEach((col) => {
              const rect = col.getBoundingClientRect();
              if (rect.bottom > 50 && rect.top < window.innerHeight - 50) {
                const colCenter = rect.top + rect.height / 2;
                const distance = Math.abs(colCenter - viewportCenter);
                if (distance < minDistance) {
                  minDistance = distance;
                  closestStep = col;
                }
              }
            });

            steps.forEach((col) => {
              const numEl = col.querySelector('span');
              const labelEl = col.querySelector('div');

              if (col === closestStep) {
                col.style.backgroundColor = '#ffffff';
                col.style.border = '2.5px solid #000000';
                col.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
                col.style.transform = 'translateY(-4px) scale(1.02)';
                col.style.borderRadius = '18px';
                if (numEl) { numEl.style.color = '#18181b'; numEl.style.transform = 'scale(1.05)'; }
                if (labelEl) {
                  labelEl.style.color = '#18181b';
                  const childDivs = labelEl.querySelectorAll('div');
                  childDivs.forEach(d => d.style.color = '#18181b');
                }
              } else {
                col.style.backgroundColor = 'transparent';
                col.style.border = '2px solid transparent';
                col.style.boxShadow = 'none';
                col.style.transform = 'none';
                if (numEl) { numEl.style.color = '#18181b'; numEl.style.transform = 'none'; }
                if (labelEl) {
                  labelEl.style.color = '#52525b';
                  const childDivs = labelEl.querySelectorAll('div');
                  if (childDivs[0]) childDivs[0].style.color = '#18181b';
                  if (childDivs[1]) childDivs[1].style.color = '#52525b';
                }
              }
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const scrollContainer = document.getElementById('service-content-scroll-container');
    const target = scrollContainer || window;

    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => target.removeEventListener('scroll', handleScroll);
  }, [serviceId]);

  if (!service) {
    return (
      <div style={{ padding: '120px 2rem', textAlign: 'center', backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
        <h2 style={{ fontFamily: 'serif', fontWeight: '300', fontSize: '2rem' }}>Service Not Found</h2>
        <Link to="/services" style={{ color: '#ffffff', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>Back to All Services</Link>
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

  // Set up active section observer on right panel scroll
  useEffect(() => {
    const scrollContainer = document.getElementById('service-content-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollTop + 150;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i].id);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial trigger
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [sections]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.animate-header', {
      opacity: 0,
      y: 20,
      duration: 0.8
    })
    .from('.animate-sidebar', {
      opacity: 0,
      x: -20,
      duration: 0.8,
      clearProps: 'transform'
    }, '-=0.5')
    .from('.animate-content-section', {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8
    }, '-=0.5');

  }, { scope: containerRef });

  const handleSidebarClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    const scrollContainer = document.getElementById('service-content-scroll-container');

    if (targetElement && scrollContainer) {
      const topOffset = targetElement.offsetTop - 20;
      scrollContainer.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
      setActiveSection(targetId);
    }
  };

  // Capabilities content resolver based on service database shape
  const renderCapabilitiesContent = () => {
    const list = service.servicesInclude || service.whatWeCreate || service.editingServices;
    const keyVals = service.motionDetails || service.designAreas || service.contentTypes || service.shootElements || service.filmCategories || service.designElements;

    if (list) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
          {list.map((item, idx) => (
            <div key={idx} style={{ borderLeft: '2px solid #ffffff', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600', fontFamily: 'monospace' }}>{`0${idx + 1}`}</span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '600', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif", margin: 0, color: '#ffffff' }}>
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
            <div key={key} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'baseline', flex: '1 1 250px' }}>
                <span style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'monospace' }}>{`0${idx + 1}`}</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '500', textTransform: 'uppercase', margin: 0, fontFamily: "'Manrope', sans-serif", color: '#ffffff' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
              </div>
              <p style={{ flex: '1 1 350px', fontSize: '1rem', lineHeight: '1.65', color: 'rgba(255, 255, 255, 0.75)', margin: 0, fontWeight: '300', fontFamily: "'Manrope', sans-serif" }}>
                {Array.isArray(val) ? val.join(', ') : val}
              </p>
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
      className="service-detail-container"
      style={{
        width: '100%',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '110px 2rem 20px 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <div className="service-detail-wrapper" style={{ maxWidth: '1200px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Fixed Back navigation & header banner */}
        <div className="animate-header" style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '1.5rem', flexShrink: 0 }}>
          <Link
            to="/services"
            style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              fontWeight: '700',
              fontFamily: 'monospace'
            }}
          >
            ← Back to All Services
          </Link>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888888', display: 'block', marginBottom: '0.5rem', fontFamily: 'monospace', fontWeight: '700' }}>
            SERVICE DETAIL
          </span>
          <h1 className="service-detail-title" style={{
            fontSize: 'calc(2.2rem + 1.8vw)',
            fontWeight: '700',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            fontFamily: "'Manrope', sans-serif",
            color: '#ffffff'
          }}>
            {service.title}
          </h1>
        </div>

        {/* Fixed Sidebar + Independently Scrollable Right Panel */}
        <div className="service-detail-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '4rem', position: 'relative', width: '100%', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          
          {/* Fixed Left Sidebar Navigation */}
          <aside
            className="animate-sidebar service-detail-sidebar"
            style={{
              width: '100%',
              paddingRight: '1.5rem',
              borderRight: '1px solid rgba(255, 255, 255, 0.15)',
              height: '100%',
              flexShrink: 0
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
                    color: activeSection === sect.id ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                    fontWeight: activeSection === sect.id ? '700' : '400',
                    fontFamily: 'monospace',
                    transition: 'all 0.3s ease',
                    paddingLeft: activeSection === sect.id ? '0.75rem' : '0',
                    borderLeft: activeSection === sect.id ? '2px solid #ffffff' : '2px solid transparent'
                  }}
                >
                  {sect.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Content Panel - INDEPENDENT SCROLL AREA */}
          <div 
            id="service-content-scroll-container"
            className="service-detail-content"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{ 
              width: '100%', 
              height: '100%', 
              overflowY: 'auto', 
              WebkitOverflowScrolling: 'touch',
              paddingRight: '1rem',
              boxSizing: 'border-box'
            }}
          >
            
            {/* Overview Section */}
            <section
              id="overview"
              className="animate-content-section"
              style={{
                width: '100%',
                scrollMarginTop: '120px',
                paddingBottom: '6rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '6rem'
              }}
            >
              <h2 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '2.5rem', fontFamily: 'monospace' }}>
                01 / Overview
              </h2>
              <p style={{
                color: '#ffffff',
                fontSize: '1.4rem',
                lineHeight: '1.8',
                fontWeight: '300',
                margin: 0,
                fontFamily: "'Manrope', sans-serif",
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
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '6rem'
              }}
            >
              <h2 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '3.5rem', fontFamily: 'monospace' }}>
                02 / Capabilities
              </h2>
              {renderCapabilitiesContent()}
            </section>

            {/* Process / Production Journey Section with 7-Step Methodology Diagram */}
            <section
              id="process"
              className="animate-content-section"
              style={{
                width: '100%',
                scrollMarginTop: '120px',
                paddingBottom: '6rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '6rem'
              }}
            >
              <h2 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '2.5rem', fontFamily: 'monospace' }}>
                03 / Production Journey & Methodology
              </h2>
              
              {/* 100% Exact 7-Step Methodology Diagram Card matching reference UI */}
              <div 
                style={{
                  backgroundColor: '#fafaf9',
                  borderRadius: '24px',
                  padding: '4.5rem 1.5rem',
                  color: '#1a1a1a',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3.5rem',
                  fontFamily: "'Manrope', sans-serif"
                }}
              >
                {/* ROW 1: 5 ITEMS (01 - 05) */}
                <div 
                  className="process-row-top"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    width: '100%',
                    maxWidth: '1100px'
                  }}
                >
                  {[
                    { num: '01', line1: processSteps[0]?.label || 'Product :', line2: processSteps[0]?.desc?.substring(0, 30) || 'Problem and task.' },
                    { num: '02', line1: processSteps[1]?.label || 'Research', line2: processSteps[1]?.desc?.substring(0, 30) || '& Discovery.' },
                    { num: '03', line1: processSteps[2]?.label || 'UX Strategy.', line2: processSteps[2]?.desc?.substring(0, 30) || '' },
                    { num: '04', line1: processSteps[3]?.label || 'UI Design.', line2: processSteps[3]?.desc?.substring(0, 30) || '' },
                    { num: '05', line1: processSteps[4]?.label || 'MVP.', line2: processSteps[4]?.desc?.substring(0, 30) || '' }
                  ].map((step, idx) => (
                    <div 
                      key={step.num}
                      className="process-step-col"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0 0.75rem',
                        position: 'relative',
                        borderRight: idx < 4 ? '1px solid #d4d4d8' : 'none',
                        minHeight: '130px',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <span 
                        style={{
                          fontSize: 'clamp(2.8rem, 4.5vw, 4.2rem)',
                          fontWeight: '600',
                          color: '#18181b',
                          lineHeight: '1',
                          marginBottom: '1rem',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {step.num}
                      </span>

                      <div style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.35',
                        color: '#52525b',
                        fontWeight: '400',
                        maxWidth: '150px'
                      }}>
                        <div style={{ color: '#18181b', fontWeight: '600' }}>{step.line1}</div>
                        {step.line2 && <div>{step.line2}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ROW 2: 2 ITEMS CENTERED (06 - 07) */}
                <div 
                  className="process-row-bottom"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    maxWidth: '440px',
                    width: '100%'
                  }}
                >
                  {[
                    { num: '06', line1: processSteps[5]?.label || 'Metrics.', line2: processSteps[5]?.desc?.substring(0, 30) || '' },
                    { num: '07', line1: processSteps[6]?.label || 'How do I', line2: processSteps[6]?.desc?.substring(0, 30) || 'really work?' }
                  ].map((step, idx) => (
                    <div 
                      key={step.num}
                      className="process-step-col"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0 1.25rem',
                        borderRight: idx === 0 ? '1px solid #d4d4d8' : 'none',
                        minHeight: '130px',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <span 
                        style={{
                          fontSize: 'clamp(2.8rem, 4.5vw, 4.2rem)',
                          fontWeight: '600',
                          color: '#18181b',
                          lineHeight: '1',
                          marginBottom: '1rem',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {step.num}
                      </span>

                      <div style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.35',
                        color: '#52525b',
                        fontWeight: '400',
                        maxWidth: '150px'
                      }}>
                        <div style={{ color: '#18181b', fontWeight: '600' }}>{step.line1}</div>
                        {step.line2 && <div>{step.line2}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Before/After Drag Slider Widget for Video Editing */}
            {service.id === 'video-editing' && (
              <section
                id="before-after"
                className="animate-content-section"
                style={{
                  width: '100%',
                  scrollMarginTop: '120px',
                  paddingBottom: '6rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  marginBottom: '6rem'
                }}
              >
                <h2 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '3rem', fontFamily: 'monospace' }}>
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
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                marginBottom: '6rem'
              }}
            >
              <h2 style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#888888', letterSpacing: '0.2em', marginBottom: '3.5rem', fontFamily: 'monospace' }}>
                Featured Projects
              </h2>
              {featuredProjects.length === 0 ? (
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'serif', fontStyle: 'italic' }}>Publications or projects currently under NDA.</p>
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
                          backgroundColor: 'rgba(255, 255, 255, 0.04)', 
                          border: '1px solid rgba(255, 255, 255, 0.12)', 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#ffffff';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#111111', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.1em', fontFamily: 'monospace' }}>{proj.category.replace('-', ' ')}</span>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: '400', color: '#ffffff', margin: 0, fontFamily: "'Manrope', sans-serif" }}>{proj.title}</h4>
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
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '4.5rem 3rem', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <h2 style={{ fontSize: 'calc(1.8rem + 1vw)', fontWeight: '300', textTransform: 'uppercase', color: '#ffffff', margin: 0, fontFamily: "'Manrope', sans-serif", lineHeight: '1.2', maxWidth: '650px' }}>
                  Have a Project in Mind? <br />
                  <span style={{ fontStyle: 'italic', borderBottom: '2px solid #ffffff', paddingBottom: '3px' }}>Let's Create Something Remarkable.</span>
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.05rem', maxWidth: '550px', margin: '0 0 1rem 0', lineHeight: '1.7', fontWeight: '300', fontFamily: "'Manrope', sans-serif" }}>
                  Have an idea, a brand launch, or a complex publishing challenge? Collaborate with Rising Media Works to bring it into the real world.
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link
                    to="/contact"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '1px solid #ffffff',
                      padding: '1.2rem 3rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontFamily: 'sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                      e.currentTarget.style.borderColor = '#ffffff';
                    }}
                  >
                    Start Your Project
                  </Link>
                  <Link
                    to="/work"
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'transparent',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '1.2rem 3rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontFamily: 'sans-serif',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                      e.currentTarget.style.borderColor = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
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
