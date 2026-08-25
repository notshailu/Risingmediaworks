import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { caseStudiesData } from '../../data/dummyData';

const AllCaseStudies = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '120px 3rem 60px 3rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        <div style={{ marginBottom: '4rem', textAlign: 'left' }}>
          <span className="animate-label" style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#c5a880',
            fontWeight: '600',
            display: 'block',
            marginBottom: '0.5rem'
          }}>
            Case Studies
          </span>
          <h1 className="animate-title" style={{
            fontSize: '3rem',
            fontWeight: '300',
            textTransform: 'uppercase',
            margin: 0,
            letterSpacing: '0.02em',
            lineHeight: '1.1'
          }}>
            In-depth project analysis
          </h1>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '3rem',
          width: '100%',
          marginTop: '2rem'
        }}>
          {caseStudiesData.map((study) => (
            <Link
              key={study.id}
              to={`/case-studies/${study.id}`}
              className="case-study-card"
              style={{
                display: 'block',
                backgroundColor: '#0d0d0d',
                border: '1px solid #1a1a1a',
                borderRadius: '12px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.4s ease, border-color 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#c5a880';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#1a1a1a';
              }}
            >
              <div style={{ width: '100%', height: '240px', overflow: 'hidden' }}>
                <img
                  src={study.image}
                  alt={study.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '2rem' }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#c5a880',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600'
                }}>
                  {study.client}
                </span>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  margin: '0.75rem 0 1rem 0',
                  lineHeight: '1.3'
                }}>
                  {study.title}
                </h3>
                <p style={{
                  color: '#888',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {study.overview}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCaseStudies;
