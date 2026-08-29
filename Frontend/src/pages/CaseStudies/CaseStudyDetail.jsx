import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { caseStudiesData, projectsData } from '../../data/dummyData';

const CaseStudyDetail = () => {
  const { id } = useParams();
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('');

  const [study, setStudy] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rmw_case_studies') || '[]');
      const all = [...saved, ...caseStudiesData];
      return all.find((s) => s.id === id) || caseStudiesData.find((s) => s.id === id);
    } catch {
      return caseStudiesData.find((s) => s.id === id);
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
      // Audio context silenced
    }
  };

  // Map 18 sections configuration
  const sections = [
    { id: 'overview', title: 'Project Overview', content: study?.overview },
    { id: 'problem', title: 'Client Problem', content: study?.problem },
    { id: 'objective', title: 'Client Objective', content: study?.objective },
    { id: 'challenges', title: 'Challenges', content: study?.challenges },
    { id: 'research', title: 'Research', content: study?.research },
    { id: 'strategy', title: 'Strategy', content: study?.strategy },
    { id: 'creativeDirection', title: 'Creative Direction', content: study?.creativeDirection },
    { id: 'script', title: 'Script', content: study?.script },
    { id: 'storyboard', title: 'Storyboard', content: study?.storyboard },
    { id: 'preProduction', title: 'Pre-Production', content: study?.preProduction },
    { id: 'production', title: 'Production', content: study?.production },
    { id: 'editing', title: 'Editing', content: study?.editing },
    { id: 'motionGraphics', title: 'Motion Graphics', content: study?.motionGraphics },
    { id: 'soundDesign', title: 'Sound Design', content: study?.soundDesign },
    { id: 'finalOutput', title: 'Final Output', content: study?.finalOutput },
    { id: 'beforeAfter', title: 'Before / After', isBeforeAfter: true },
    { id: 'results', title: 'Results', content: study?.results },
    { id: 'relatedProjects', title: 'Related Projects', isRelatedProjects: true }
  ];

  // Resolve related projects
  const relatedProjects = projectsData.filter((proj) =>
    study?.relatedProjectIds?.includes(proj.id)
  );

  // Set up dynamic active link tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 180) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection || 'overview');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.animate-header', {
      opacity: 0,
      y: 30,
      duration: 1.2,
      delay: 0.2
    })
    .from('.animate-sidebar', {
      opacity: 0,
      x: -30,
      duration: 1
    }, '-=0.8')
    .from('.animate-content-section', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.1
    }, '-=0.8');
  }, { scope: containerRef });

  if (!study) {
    return (
      <div style={{ padding: '140px 2rem', textAlign: 'center', color: '#000', backgroundColor: '#ffffff', minHeight: '100vh' }}>
        <h2>Case Study Not Found</h2>
        <Link to="/case-studies" style={{ color: '#0052ff', textDecoration: 'underline' }}>Back to All Case Studies</Link>
      </div>
    );
  }

  const handleSidebarClick = (e, sectionId) => {
    e.preventDefault();
    playHoverSound();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '140px 6vw 100px 6vw',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header Block */}
        <div className="animate-header" style={{ marginBottom: '5rem', borderBottom: '1px solid rgba(0, 0, 0, 0.12)', paddingBottom: '3.5rem' }}>
          <Link
            to="/case-studies"
            onMouseEnter={playHoverSound}
            style={{
              fontSize: '0.8rem',
              color: '#0052ff',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '2rem',
              fontFamily: 'monospace'
            }}
          >
            ← BACK TO ALL CASE STUDIES
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#0052ff',
              boxShadow: '0 0 10px rgba(0, 82, 255, 0.4)',
              display: 'inline-block'
            }} />
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.5)',
              fontWeight: '600',
              fontFamily: 'monospace'
            }}>
              CLIENT // {study.client}
            </span>
          </div>

          <h1 style={{
            fontSize: 'calc(2.2rem + 2vw)',
            fontWeight: '300',
            fontFamily: 'serif',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '0.02em',
            lineHeight: '1.15',
            color: '#000000'
          }}>
            {study.title}
          </h1>
        </div>

        {/* Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '5rem', position: 'relative' }}>
          
          {/* Left Sidebar Table of Contents */}
          <aside
            className="animate-sidebar"
            style={{
              position: 'sticky',
              top: '140px',
              maxHeight: 'calc(100vh - 180px)',
              overflowY: 'auto',
              paddingRight: '1.5rem',
              borderRight: '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            <span style={{
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(0, 0, 0, 0.4)',
              fontFamily: 'monospace',
              display: 'block',
              marginBottom: '1.5rem'
            }}>
              CONTENTS INDEX
            </span>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {sections.map((sect) => (
                <a
                  key={sect.id}
                  href={`#${sect.id}`}
                  onClick={(e) => handleSidebarClick(e, sect.id)}
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    textDecoration: 'none',
                    color: activeSection === sect.id ? '#0052ff' : 'rgba(0, 0, 0, 0.5)',
                    fontWeight: activeSection === sect.id ? '600' : '400',
                    transition: 'all 0.3s ease',
                    paddingLeft: activeSection === sect.id ? '0.6rem' : '0',
                    borderLeft: activeSection === sect.id ? '2px solid #0052ff' : '2px solid transparent',
                    fontFamily: 'monospace'
                  }}
                >
                  {sect.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Scrollable Content */}
          <div ref={scrollContainerRef} style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {sections.map((sect) => {
              if (sect.isBeforeAfter) {
                return (
                  <section
                    key={sect.id}
                    id={sect.id}
                    className="animate-content-section"
                    style={{ scrollMarginTop: '140px', borderTop: '1px solid rgba(0, 0, 0, 0.12)', paddingTop: '3rem' }}
                  >
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '400', fontFamily: 'serif', color: '#000000', marginBottom: '2rem', letterSpacing: '0.02em' }}>
                      {sect.title}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)', border: '1px solid rgba(0, 0, 0, 0.12)', padding: '2.5rem', borderRadius: '16px' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(0, 0, 0, 0.5)', letterSpacing: '0.15em', display: 'block', marginBottom: '0.8rem', fontFamily: 'monospace' }}>
                          BEFORE // LEGACY STATE
                        </span>
                        <p style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: '1rem', lineHeight: '1.7', margin: 0, fontWeight: '300' }}>
                          {study.beforeAfter?.before}
                        </p>
                      </div>
                      <div style={{ backgroundColor: 'rgba(0, 82, 255, 0.04)', border: '1px solid #0052ff', padding: '2.5rem', borderRadius: '16px' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#0052ff', letterSpacing: '0.15em', display: 'block', marginBottom: '0.8rem', fontFamily: 'monospace' }}>
                          AFTER // RISING MEDIA TRANSFORMATION
                        </span>
                        <p style={{ color: '#000000', fontSize: '1rem', lineHeight: '1.7', margin: 0, fontWeight: '300' }}>
                          {study.beforeAfter?.after}
                        </p>
                      </div>
                    </div>
                  </section>
                );
              }

              if (sect.isRelatedProjects) {
                return (
                  <section
                    key={sect.id}
                    id={sect.id}
                    className="animate-content-section"
                    style={{ scrollMarginTop: '140px', borderTop: '1px solid rgba(0, 0, 0, 0.12)', paddingTop: '4rem' }}
                  >
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '400', fontFamily: 'serif', color: '#000000', marginBottom: '2rem', letterSpacing: '0.02em' }}>
                      {sect.title}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                      {relatedProjects.map((proj) => (
                        <div key={proj.id} style={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: '14px', overflow: 'hidden' }}>
                          <div style={{ height: '160px' }}>
                            <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <span style={{ fontSize: '0.68rem', color: '#0052ff', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{proj.category}</span>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: '500', color: '#000', margin: '0.4rem 0 0 0', fontFamily: 'sans-serif' }}>{proj.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              }

              return (
                <section
                  key={sect.id}
                  id={sect.id}
                  className="animate-content-section"
                  style={{ scrollMarginTop: '140px', borderTop: '1px solid rgba(0, 0, 0, 0.1)', paddingTop: '2.5rem' }}
                >
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '400', fontFamily: 'serif', textTransform: 'uppercase', color: '#0052ff', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                    {sect.title}
                  </h2>
                  <p style={{
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '1.1rem',
                    lineHeight: '1.8',
                    fontWeight: '300',
                    margin: 0
                  }}>
                    {sect.content}
                  </p>
                </section>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CaseStudyDetail;

