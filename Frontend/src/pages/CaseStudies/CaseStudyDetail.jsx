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

  const study = caseStudiesData.find((s) => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
          // If the section top is close to the top of viewport, mark it active
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
      <div style={{ padding: '120px 2rem', textAlign: 'center', color: '#fff' }}>
        <h2>Case Study Not Found</h2>
        <Link to="/case-studies" style={{ color: '#c5a880', textDecoration: 'underline' }}>Back to All Case Studies</Link>
      </div>
    );
  }

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

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '120px 2rem 60px 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Header Block */}
        <div className="animate-header" style={{ marginBottom: '4rem', borderBottom: '1px solid #111', paddingBottom: '3rem' }}>
          <Link
            to="/case-studies"
            style={{
              fontSize: '0.8rem',
              color: '#c5a880',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            ← Back to All Case Studies
          </Link>
          <span style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#c5a880',
            fontWeight: '600',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Case Study: {study.client}
          </span>
          <h1 style={{
            fontSize: 'calc(2rem + 1.5vw)',
            fontWeight: '300',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '0.02em',
            lineHeight: '1.2'
          }}>
            {study.title}
          </h1>
        </div>

        {/* Layout Grid */}
        <div style={{ display: 'flex', gap: '4rem', position: 'relative' }}>
          {/* Left Sidebar Table of Contents */}
          <aside
            className="animate-sidebar"
            style={{
              width: '280px',
              position: 'sticky',
              top: '120px',
              height: 'calc(100vh - 180px)',
              overflowY: 'auto',
              flexShrink: 0,
              paddingRight: '1rem',
              borderRight: '1px solid #111'
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sections.map((sect) => (
                <a
                  key={sect.id}
                  href={`#${sect.id}`}
                  onClick={(e) => handleSidebarClick(e, sect.id)}
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                    color: activeSection === sect.id ? '#c5a880' : '#555',
                    fontWeight: activeSection === sect.id ? '600' : '400',
                    transition: 'color 0.3s ease',
                    paddingLeft: activeSection === sect.id ? '0.5rem' : '0',
                    borderLeft: activeSection === sect.id ? '2px solid #c5a880' : '2px solid transparent'
                  }}
                >
                  {sect.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Scrollable Content */}
          <div ref={scrollContainerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {sections.map((sect) => {
              if (sect.isBeforeAfter) {
                return (
                  <section
                    key={sect.id}
                    id={sect.id}
                    className="animate-content-section"
                    style={{ scrollMarginTop: '120px' }}
                  >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '300', textTransform: 'uppercase', color: '#c5a880', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                      {sect.title}
                    </h2>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 200px', backgroundColor: '#090909', border: '1px solid #111', padding: '2rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#666', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Before</span>
                        <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{study.beforeAfter?.before}</p>
                      </div>
                      <div style={{ flex: '1 1 200px', backgroundColor: '#090909', border: '1px solid #111', padding: '2rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#c5a880', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>After</span>
                        <p style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{study.beforeAfter?.after}</p>
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
                    style={{ scrollMarginTop: '120px', borderTop: '1px solid #111', paddingTop: '4rem' }}
                  >
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '300', textTransform: 'uppercase', color: '#c5a880', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
                      {sect.title}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                      {relatedProjects.map((proj) => (
                        <div key={proj.id} style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden' }}>
                          <div style={{ height: '140px' }}>
                            <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ padding: '1.25rem' }}>
                            <span style={{ fontSize: '0.65rem', color: '#c5a880', textTransform: 'uppercase' }}>{proj.category}</span>
                            <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#fff', margin: '0.25rem 0' }}>{proj.title}</h4>
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
                  style={{ scrollMarginTop: '120px' }}
                >
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '300', textTransform: 'uppercase', color: '#c5a880', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                    {sect.title}
                  </h2>
                  <p style={{
                    color: '#ccc',
                    fontSize: '1.05rem',
                    lineHeight: '1.7',
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
