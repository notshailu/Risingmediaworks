import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { caseStudiesData } from '../../data/dummyData';

const AllCaseStudies = () => {
  const containerRef = useRef(null);
  const [caseStudies, setCaseStudies] = useState(() => {
    try {
      const saved = localStorage.getItem('rmw_case_studies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return caseStudiesData;
    } catch {
      return caseStudiesData;
    }
  });

  const displayStudies = caseStudies && caseStudies.length > 0 ? caseStudies : caseStudiesData;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchStudies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/case-studies');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCaseStudies(data);
            localStorage.setItem('rmw_case_studies', JSON.stringify(data));
          }
        }
      } catch {
        // Fallback to local storage
      }
    };
    fetchStudies();
  }, []);

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

  useGSAP(() => {
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
      duration: 1.2
    }, '-=0.8')
    .from('.case-study-card', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.15
    }, '-=0.8');
  }, { scope: containerRef });

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
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Eyebrow & Header */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#0052ff',
              boxShadow: '0 0 10px rgba(0, 82, 255, 0.4)',
              display: 'inline-block'
            }} />
            <span className="animate-label" style={{
              fontSize: '0.75rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontWeight: '700',
              color: '#666666',
              fontFamily: 'monospace'
            }}>
              CASE STUDIES
            </span>
          </div>

          <h1 className="animate-title" style={{
            fontSize: 'calc(2.4rem + 2.5vw)',
            fontWeight: '300',
            fontFamily: 'serif',
            textTransform: 'uppercase',
            margin: '0 0 1.2rem 0',
            letterSpacing: '0.02em',
            lineHeight: '1.05',
            color: '#000000'
          }}>
            The Thinking Behind The Work.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: '1.75',
            color: '#555555',
            maxWidth: '750px',
            margin: 0,
            fontFamily: 'serif',
            fontWeight: '300'
          }}>
            Every successful creative project begins with a challenge. Our case studies explore the problem, the strategy, the creative direction, the execution, and the final outcome behind selected projects.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '3.5rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          paddingTop: '4rem'
        }}>
          {displayStudies.map((study, idx) => (
            <Link
              key={study.id}
              to={`/case-studies/${study.id}`}
              className="case-study-card"
              onMouseEnter={playHoverSound}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: '20px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#0052ff';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.08)';
                const img = e.currentTarget.querySelector('.cs-img');
                if (img) img.style.transform = 'scale(1.05)';
                const num = e.currentTarget.querySelector('.cs-num');
                if (num) num.style.color = '#0052ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
                const img = e.currentTarget.querySelector('.cs-img');
                if (img) img.style.transform = 'scale(1)';
                const num = e.currentTarget.querySelector('.cs-num');
                if (num) num.style.color = 'rgba(0, 0, 0, 0.4)';
              }}
            >
              <div style={{ width: '100%', height: '280px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={study.image}
                  alt={study.title}
                  className="cs-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
                <span className="cs-num" style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: 'rgba(0, 0, 0, 0.5)',
                  transition: 'color 0.4s'
                }}>
                  // 0{idx + 1}
                </span>
              </div>

              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{
                    fontSize: '0.72rem',
                    color: '#0052ff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {study.client}
                  </span>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: '400',
                    margin: '0.6rem 0 1rem 0',
                    lineHeight: '1.25',
                    fontFamily: 'serif',
                    color: '#000000'
                  }}>
                    {study.title}
                  </h3>
                  <p style={{
                    color: 'rgba(0, 0, 0, 0.65)',
                    fontSize: '0.95rem',
                    lineHeight: '1.65',
                    margin: 0,
                    fontWeight: '300'
                  }}>
                    {study.overview}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                  color: '#000000',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  letterSpacing: '0.08em'
                }}>
                  <span>EXPLORE CASE STUDY</span>
                  <span style={{ color: '#0052ff', fontSize: '1.1rem' }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AllCaseStudies;

