import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projectsData } from '../../data/dummyData';

const AllProjects = () => {
  const containerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [works, setWorks] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('light-theme');
    
    const fetchWorks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/works');
        if (response.ok) {
          const data = await response.json();
          setWorks(data);
        } else {
          setWorks(projectsData);
        }
      } catch (error) {
        console.error('Error fetching works:', error);
        setWorks(projectsData);
      }
    };
    fetchWorks();

    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.animate-header', {
      opacity: 0,
      y: 30,
      duration: 1.2
    })
    .from('.animate-filters', {
      opacity: 0,
      y: 15,
      duration: 0.8
    }, '-=0.6')
    .from('.animate-division', {
      opacity: 0,
      y: 40,
      duration: 1.4,
      stagger: 0.15
    }, '-=0.6');
  }, { scope: containerRef });

  const getYoutubeId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch')) {
      return new URL(url).searchParams.get('v');
    } else if (url.includes('youtube.com/shorts/')) {
      return url.split('shorts/')[1]?.split('?')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    }
    return null;
  };

  const handleCardClick = (project) => {
    const ytId = getYoutubeId(project.videoUrl);
    if (ytId) {
      setSelectedVideo(ytId);
    } else if (project.videoUrl) {
      window.open(project.videoUrl, '_blank');
    }
  };

  // Filter categories config
  const filterCategories = [
    { id: 'all', label: 'All Works' },
    { id: 'ai-videos', label: 'AI Videos' },
    { id: 'motion-graphics', label: 'Motion Graphics' },
    { id: 'greaves', label: 'Greaves Cotton' },
    { id: 'itoty', label: 'ITOTY Campaigns' },
    { id: 'nh-work', label: 'NH Group' }
  ];

  // Filter divisions based on activeCategory
  const aiProjects = works.filter((p) => p.category === 'ai-videos');
  const motionProjects = works.filter((p) => p.category === 'motion-graphics');
  const greavesProjects = works.filter((p) => p.category === 'greaves');
  const nhProjects = works.filter((p) => p.category === 'nh-work');
  const itotyProjects = works.filter((p) => p.category === 'itoty');

  const showAi = activeCategory === 'all' || activeCategory === 'ai-videos';
  const showMotion = activeCategory === 'all' || activeCategory === 'motion-graphics';
  const showGreaves = activeCategory === 'all' || activeCategory === 'greaves';
  const showItoty = activeCategory === 'all' || activeCategory === 'itoty';
  const showNh = activeCategory === 'all' || activeCategory === 'nh-work';

  return (
    <div
      ref={containerRef}
      className="all-projects-page"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '120px 4rem 80px 4rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Manrope', sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* Title Header */}
      <div className="animate-header all-projects-header" style={{ marginBottom: '2.5rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '2.5rem' }}>
        <span style={{
          fontSize: '0.75rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#666666',
          fontWeight: '700',
          display: 'block',
          marginBottom: '0.8rem',
          fontFamily: "'Manrope', sans-serif"
        }}>
          SELECTED WORKS
        </span>
        <h1 className="all-projects-title" style={{
          fontSize: 'calc(2.2rem + 2.2vw)',
          fontWeight: '700',
          textTransform: 'uppercase',
          margin: '0 0 1.2rem 0',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          fontFamily: "'Manrope', sans-serif"
        }}>
          Ideas Brought To Life.
        </h1>
        <p className="all-projects-desc" style={{
          fontSize: '1.1rem',
          lineHeight: '1.7',
          color: '#555555',
          maxWidth: '720px',
          margin: 0,
          fontFamily: "'Manrope', sans-serif",
          fontWeight: '300'
        }}>
          Explore selected projects across video, branding, design, motion graphics, digital experiences, and publishing.
        </p>
      </div>

      {/* Interactive Category Filter Bar */}
      <div className="animate-filters all-projects-filter-bar" style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '4rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888888', marginRight: '0.5rem', fontFamily: "'Manrope', sans-serif" }}>
          Filter By:
        </span>
        {filterCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '30px',
                border: isActive ? '1px solid #000000' : '1px solid #e0e0e0',
                backgroundColor: isActive ? '#000000' : '#ffffff',
                color: isActive ? '#ffffff' : '#444444',
                fontSize: '0.8rem',
                fontWeight: isActive ? '700' : '500',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                fontFamily: "'Manrope', sans-serif",
                boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#0052ff';
                  e.currentTarget.style.color = '#0052ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.color = '#444444';
                }
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
        
        {/* DIVISION 1: AI CINEMATICS */}
        {showAi && aiProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', fontFamily: "'Manrope', sans-serif" }}>
                Division 01 // AI Videos
              </span>
              <h2 className="division-main-title" style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: "'Manrope', sans-serif" }}>
                Generative AI Cinematics
              </h2>
            </div>
            <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {aiProjects.map((proj) => (
                <div key={proj.id} onClick={() => handleCardClick(proj)} style={{ cursor: 'pointer' }} className="project-card">
                  <div style={{ width: '100%', height: '220px', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                    <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif" }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 2: MOTION GRAPHICS */}
        {showMotion && motionProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', fontFamily: "'Manrope', sans-serif" }}>
                Division 02 // Motion Graphics
              </span>
              <h2 className="division-main-title" style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: "'Manrope', sans-serif" }}>
                Motion Explainer & 3D Simulations
              </h2>
            </div>
            <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {motionProjects.map((proj) => (
                <div key={proj.id} onClick={() => handleCardClick(proj)} style={{ cursor: 'pointer' }} className="project-card">
                  <div style={{ width: '100%', height: '220px', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                    <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif" }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 3: GREAVES COTTON */}
        {showGreaves && greavesProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', fontFamily: "'Manrope', sans-serif" }}>
                Division 03 // Greaves Cotton
              </span>
              <h2 className="division-main-title" style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: "'Manrope', sans-serif" }}>
                Greaves Campaigns & Mobility Highlights
              </h2>
            </div>
            <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {greavesProjects.map((proj) => (
                <div key={proj.id} onClick={() => handleCardClick(proj)} style={{ cursor: 'pointer' }} className="project-card">
                  <div style={{ width: '100%', height: '220px', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                    <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif" }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 4: ITOTY VIDEOS */}
        {showItoty && itotyProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', fontFamily: "'Manrope', sans-serif" }}>
                Division 04 // ITOTY Campaigns
              </span>
              <h2 className="division-main-title" style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: "'Manrope', sans-serif" }}>
                ITOTY Visual & Commercial Showcase
              </h2>
            </div>
            <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {itotyProjects.map((proj) => (
                <div key={proj.id} onClick={() => handleCardClick(proj)} style={{ cursor: 'pointer' }} className="project-card">
                  <div style={{ width: '100%', height: '220px', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                    <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif" }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 5: NH GROUP WORK */}
        {showNh && nhProjects.length > 0 && (
          <div className="animate-division" style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '700', fontFamily: "'Manrope', sans-serif" }}>
                Division 05 // NH Group Work
              </span>
              <h2 className="division-main-title" style={{ fontSize: '2rem', fontWeight: '700', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: "'Manrope', sans-serif" }}>
                NH Infrastructure & Corporate Productions
              </h2>
            </div>
            <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {nhProjects.map((proj) => (
                <div key={proj.id} onClick={() => handleCardClick(proj)} style={{ cursor: 'pointer' }} className="project-card">
                  <div style={{ width: '100%', height: '220px', backgroundColor: '#fafafa', border: '1px solid #e5e5e5', overflow: 'hidden', borderRadius: '8px', position: 'relative' }}>
                    <img src={proj.image} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase', fontFamily: "'Manrope', sans-serif" }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0, fontFamily: "'Manrope', sans-serif" }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Video Lightbox Modal Overlay */}
      {selectedVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={() => setSelectedVideo(null)}
        >
          {/* Close Button */}
          <div style={{ position: 'absolute', top: '25px', right: '25px', color: '#ffffff', cursor: 'pointer', fontSize: '1.8rem', fontFamily: 'sans-serif' }}>
            &times;
          </div>

          {/* Iframe player container */}
          <div style={{ width: '85%', maxWidth: '960px', aspectRatio: '16/9', backgroundColor: '#000000', boxShadow: '0 20px 80px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProjects;
