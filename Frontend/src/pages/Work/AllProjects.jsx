import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projectsData } from '../../data/dummyData';

const AllProjects = () => {
  const containerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
    .from('.animate-division', {
      opacity: 0,
      y: 40,
      duration: 1.4,
      stagger: 0.15
    }, '-=0.8');
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

  // Filter divisions
  const aiProjects = works.filter((p) => p.category === 'ai-videos');
  const motionProjects = works.filter((p) => p.category === 'motion-graphics');
  const greavesProjects = works.filter((p) => p.category === 'greaves');
  const nhProjects = works.filter((p) => p.category === 'nh-work');
  const itotyProjects = works.filter((p) => p.category === 'itoty');

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '120px 4rem 80px 4rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* Title Header */}
      <div className="animate-header" style={{ marginBottom: '5rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '2rem' }}>
        <span style={{
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#888888',
          fontWeight: '600',
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          Creative Divisions
        </span>
        <h1 style={{
          fontSize: 'calc(2.2rem + 2.2vw)',
          fontWeight: '300',
          textTransform: 'uppercase',
          margin: 0,
          letterSpacing: '0.02em',
          lineHeight: '1.1',
          fontFamily: 'serif'
        }}>
          Selected Works & Portfolios
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
        
        {/* DIVISION 1: AI CINEMATICS */}
        {aiProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600' }}>
                Division 01 // AI Videos
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '300', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: 'serif' }}>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '500', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase' }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 2: MOTION GRAPHICS */}
        {motionProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600' }}>
                Division 02 // Motion Graphics
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '300', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: 'serif' }}>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '500', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase' }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 3: GREAVES COTTON */}
        {greavesProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600' }}>
                Division 03 // Greaves Cotton
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '300', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: 'serif' }}>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '500', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase' }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 4: ITOTY VIDEOS */}
        {itotyProjects.length > 0 && (
          <div className="animate-division" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '6rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600' }}>
                Division 04 // ITOTY Campaigns
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '300', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: 'serif' }}>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '500', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase' }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIVISION 5: NH GROUP WORK */}
        {nhProjects.length > 0 && (
          <div className="animate-division" style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#888888', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '600' }}>
                Division 05 // NH Group Work
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: '300', textTransform: 'uppercase', margin: '0.5rem 0 0 0', fontFamily: 'serif' }}>
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '500', margin: '1rem 0 0.25rem 0', textTransform: 'uppercase' }}>{proj.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#666666', margin: 0 }}>{proj.description}</p>
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
