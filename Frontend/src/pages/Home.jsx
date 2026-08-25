import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { servicesData, projectsData, booksData } from '../data/dummyData';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);
  const secondSectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [works, setWorks] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fetch real works from the database
  useEffect(() => {
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
  }, []);

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

  const playHoverSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (error) {
      console.warn('Audio context blocked or unsupported:', error);
    }
  };

  // Preload image sequence in background
  useEffect(() => {
    const totalFrames = 250;
    const loadedImages = [];

    const pad = (num, size) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/Animation/frame_${pad(i, 4)}.jpeg`;
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Landing / Entrance animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.header', {
      opacity: 0,
      y: -30,
      duration: 1.2
    }, 0.2);

    tl.from('.hero-eyebrow', {
      opacity: 0,
      y: 20,
      duration: 1.2
    }, 0.4);

    tl.from('.hero-title', {
      opacity: 0,
      y: 40,
      letterSpacing: '0.3em',
      duration: 1.6
    }, 0.5);

    tl.from('.hero-btn', {
      opacity: 0,
      y: 30,
      duration: 1.2
    }, 0.7);

    tl.from('.scroll-down-btn', {
      opacity: 0,
      y: 15,
      duration: 1.2
    }, 0.85);

    // Infinite loop animation for scroll down line
    gsap.to('.scroll-line-indicator', {
      top: '100%',
      duration: 1.5,
      repeat: -1,
      ease: 'power1.inOut'
    });

    // ScrollTrigger animations for Selected Work editorial sections
    gsap.utils.toArray('.editorial-title').forEach((title) => {
      gsap.fromTo(title,
        {
          letterSpacing: '0.18em',
          opacity: 0,
          y: 70,
          scale: 0.96
        },
        {
          letterSpacing: '-0.02em',
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray('.editorial-divider').forEach((line) => {
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: 'center center' },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.utils.toArray('.editorial-grid').forEach((grid) => {
      gsap.fromTo(grid,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Contact Section Animations
    gsap.fromTo('.contact-title',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.contact-btn',
      { scale: 0.9, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.contact-social-link',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.footer-giant-word',
      { y: 120, scale: 0.93 },
      {
        y: 0,
        scale: 1.03,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1.2
        }
      }
    );
  }, []);

  // Cursor trailing image gallery effect in the Hero section
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero || images.length === 0) return;

    const trailImages = booksData.map(book => book.image);

    const imageElements = hero.querySelectorAll('.trail-image');
    let imageIndex = 0;
    let poolIndex = 0;
    let lastMousePos = { x: 0, y: 0 };
    const threshold = 75;

    const getDistance = (p1, p2) => {
      return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    };

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const currentMousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      if (lastMousePos.x === 0 && lastMousePos.y === 0) {
        lastMousePos = currentMousePos;
        return;
      }

      const distance = getDistance(lastMousePos, currentMousePos);

      if (distance > threshold) {
        const el = imageElements[poolIndex];
        if (el) {
          const img = el.querySelector('img');
          img.src = trailImages[imageIndex];

          const rotation = (Math.random() - 0.5) * 15;

          gsap.killTweensOf(el);
          
          gsap.set(el, {
            left: currentMousePos.x,
            top: currentMousePos.y,
            rotation: rotation,
            scale: 0.5,
            opacity: 0,
            zIndex: 10 + poolIndex
          });

          gsap.timeline()
            .to(el, {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            })
            .to(el, {
              opacity: 0,
              scale: 0.85,
              y: '+=15',
              duration: 0.5,
              ease: 'power2.in',
              delay: 0.2
            });

          poolIndex = (poolIndex + 1) % imageElements.length;
          imageIndex = (imageIndex + 1) % trailImages.length;
        }

        lastMousePos = currentMousePos;
      }
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
    };
  }, [images]);

  // Set up canvas drawing on scroll pinned to second section
  useGSAP(() => {
    if (!canvasRef.current || !secondSectionRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const sequence = { frame: 0 };

    const drawImage = (frameIndex) => {
      const roundedIndex = Math.round(frameIndex);
      const img = images[roundedIndex];
      if (!img || !img.complete) return; // Only draw if loaded

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      context.clearRect(0, 0, canvas.width, canvas.height);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = img.width;
      const imageHeight = img.height;

      const r = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const nw = imageWidth * r;
      const nh = imageHeight * r;
      const cx = (canvasWidth - nw) / 2;
      const cy = ((canvasHeight - nh) / 2) + 80;

      context.drawImage(img, cx, cy, nw, nh);
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      drawImage(sequence.frame);
    };

    window.addEventListener('resize', handleResize);
    
    if (images[0]) {
      if (images[0].complete) {
        handleResize();
      } else {
        images[0].onload = () => {
          handleResize();
        };
      }
    }

    // Timeline for the pinned second section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: secondSectionRef.current,
        start: 'top top',
        end: '+=2500', // Pinned scroll length
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
      }
    });

    // Animate the image frames across the full timeline duration
    tl.to(sequence, {
      frame: images.length - 1,
      ease: 'none',
      duration: 1,
      onUpdate: () => {
        drawImage(sequence.frame);
      }
    }, 0);

    // Text fade-in triggers exactly when the phone zoom movement completes at frame 230 (timeline progress 0.85 to 1.0)
    tl.fromTo('.showcase-text', 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 0.15, ease: 'power3.out' }, 
      0.85
    );

    // General scroll animations for subsequent sections
    gsap.utils.toArray('.scroll-fade-in').forEach((element) => {
      gsap.fromTo(element, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [images]);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative', overflowX: 'hidden' }}>
      


      {/* HERO SECTION */}
      <section id="hero" style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 2rem',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <span className="hero-eyebrow eyebrow" style={{
            fontSize: '0.8rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#888888',
            fontWeight: '600',
            fontFamily: 'sans-serif'
          }}>
            Creative Agency & Publishing House
          </span>
          <h1 className="hero-title" style={{
            fontSize: 'calc(4rem + 8vw)',
            fontWeight: '300',
            lineHeight: '0.9',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            margin: 0,
            fontFamily: 'serif',
            color: '#000000'
          }}>
            Rising
          </h1>
          <a className="hero-btn" href="#showcase" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 2.5rem',
            backgroundColor: '#000000',
            color: '#ffffff',
            borderRadius: '50px',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: '500',
            transition: 'opacity 0.3s ease',
            marginTop: '1.5rem',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => e.target.style.opacity = 0.8}
          onMouseLeave={(e) => e.target.style.opacity = 1}
          >
            Explore Work
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>

        {/* Scroll Down Indicator */}
        <a href="#showcase" className="scroll-down-btn" style={{
          position: 'absolute',
          bottom: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.8rem',
          textDecoration: 'none',
          color: '#888888',
          zIndex: 5,
          cursor: 'pointer'
        }}>
          <span style={{
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: '600',
            fontFamily: 'sans-serif'
          }}>
            Scroll Down
          </span>
          <div style={{
            width: '1px',
            height: '40px',
            backgroundColor: '#e0e0e0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="scroll-line-indicator" style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              position: 'absolute',
              top: '-100%'
            }} />
          </div>
        </a>

        {/* Image Trail Pool */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="trail-image"
            style={{
              position: 'absolute',
              width: '160px',
              height: '210px',
              overflow: 'hidden',
              borderRadius: '8px',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: 1,
              transform: 'translate(-50%, -50%) scale(0.5)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              willChange: 'transform, opacity'
            }}
          >
            <img
              src=""
              alt="trail"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </section>

      {/* SECOND SECTION: Pinned 3D Image Sequence Animation */}
      <section ref={secondSectionRef} id="showcase" style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}>
        {/* Soft Radial White Glow (Behind Canvas) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '70vw',
          background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 45%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Top Gradient Blend Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '160px',
          background: 'linear-gradient(to bottom, #ffffff 15%, rgba(255,255,255,0.8) 40%, transparent 100%)',
          zIndex: 4,
          pointerEvents: 'none'
        }} />

        {/* Canvas to render images */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            zIndex: 2,
            filter: 'drop-shadow(0 0 60px rgba(255, 255, 255, 0.95))'
          }}
        />

        {/* Dynamic Fog & Glow Overlay (On Top of Canvas) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.65) 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* Bottom Gradient Blend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '160px',
          background: 'linear-gradient(to top, #ffffff 15%, rgba(255,255,255,0.8) 40%, transparent 100%)',
          zIndex: 4,
          pointerEvents: 'none'
        }} />

        {/* Text overlay appearing only after rotation and zoom completes */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 10vw',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 5
        }}>
          <div className="showcase-text" style={{
            textAlign: 'center',
            maxWidth: '850px',
            opacity: 0
          }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#666666', display: 'block', marginBottom: '1.5rem', fontFamily: 'sans-serif' }}>Endless Refinement</span>
            <h2 style={{ fontSize: 'calc(1.8rem + 2vw)', fontWeight: '300', fontFamily: 'serif', color: '#000000', margin: 0, lineHeight: '1.25' }}>
              Shaping cinematic narratives and bespoke digital architectures that demand attention.
            </h2>
          </div>
        </div>
      </section>

      {/* WORKS SECTION (WSJ Editorial Redesign) */}
      <section id="work" style={{
        width: '100%',
        minHeight: '100vh',
        padding: '16vh 8vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff', // Clean white background
        borderTop: '1px solid #eeeeee',
        borderBottom: '1px solid #eeeeee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'baseline', 
            marginBottom: '12vh', 
            borderBottom: '1px solid #eeeeee',
            paddingBottom: '2rem'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#77756f', fontWeight: '600', display: 'block', marginBottom: '0.8rem', fontFamily: 'sans-serif' }}>
                Featured Archive
              </span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'sans-serif', margin: 0, letterSpacing: '0.05em', color: '#000000' }}>
                Selected Work
              </h2>
            </div>
            <Link to="/work" style={{ 
              fontSize: '0.75rem', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: '#000000', 
              fontWeight: '700', 
              textDecoration: 'none',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = 0.6}
            onMouseLeave={(e) => e.target.style.opacity = 1}
            >
              View All Works
            </Link>
          </div>

          {/* Editorial Project Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16vh' }}>
            {works.slice(0, 3).map((project, idx) => (
              <div key={project.id} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* Massive Condensed Headline */}
                <h3 className="editorial-title" style={{
                  fontSize: 'calc(3.5rem + 5vw)',
                  fontWeight: '400',
                  lineHeight: '0.85',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  margin: 0,
                  color: '#000000',
                  fontFamily: 'var(--font-editorial)'
                }}>
                  {project.title}
                </h3>

                {/* Horizontal Separator */}
                <div className="editorial-divider" style={{ width: '100%', height: '1px', backgroundColor: '#000000' }} />

                {/* Uppercase Summary Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
                  <h4 style={{
                    fontSize: 'calc(0.85rem + 0.3vw)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontFamily: 'sans-serif',
                    lineHeight: '1.4',
                    margin: 0,
                    maxWidth: '850px',
                    color: '#000000'
                  }}>
                    {project.client ? `${project.client.toUpperCase()} PARTNERS WITH RISING MEDIA WORKS FOR AN ADVANCED ${project.category.replace('-', ' ').toUpperCase()} CAMPAIGN.` : 'RISING MEDIA WORKS EDITORIAL PRODUCTION AND DESIGN SERVICES.'}
                  </h4>
                  <span style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#77756f',
                    fontWeight: '700',
                    fontFamily: 'sans-serif'
                  }}>
                    // {project.category.replace('-', ' ')}
                  </span>
                </div>

                {/* Two Column Layout Grid */}
                <div className="editorial-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 0.8fr',
                  gap: '3rem',
                  width: '100%',
                  marginTop: '1rem'
                }}>
                  
                  {/* High Contrast B&W Image */}
                  <div style={{
                    width: '100%',
                    height: '420px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #eeeeee'
                  }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="editorial-project-img"
                      onClick={() => handleCardClick(project)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(1) contrast(1.15) brightness(0.95)',
                        transition: 'filter 0.5s ease, transform 0.8s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.filter = 'none';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.filter = 'grayscale(1) contrast(1.15) brightness(0.95)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>

                  {/* Descriptive Text Columns */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1.5rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.65',
                    color: '#2a2927',
                    fontFamily: 'serif',
                    fontWeight: '400',
                    justifyContent: 'flex-start'
                  }}>
                    <p style={{ margin: 0 }}>
                      {project.description}
                    </p>
                    <p style={{ margin: 0, color: '#55534f' }}>
                      {project.client} Campaign — Directed by Rising Media Works.
                    </p>
                    <div onClick={() => handleCardClick(project)} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      fontWeight: '700',
                      color: '#000000',
                      textDecoration: 'none',
                      fontFamily: 'sans-serif',
                      cursor: 'pointer'
                    }}>
                      {project.videoUrl ? 'Watch Campaign Video' : 'Read Full Case Study'}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Responsive CSS inject */}
        <style>{`
          @media (max-width: 768px) {
            .editorial-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
            .editorial-project-img {
              filter: none !important; /* Keep color on mobile for rich look */
            }
            .editorial-grid div:first-child {
              height: 280px !important;
            }
          }
        `}</style>
      </section>

      {/* SERVICES SECTION (Premium Grid Cell Redesign) */}
      <section id="services" style={{
        width: '100%',
        minHeight: '100vh',
        padding: '16vh 8vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #dcdad4',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ marginBottom: '10vh' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#888888', fontWeight: '600', display: 'block', marginBottom: '0.8rem' }}>
              Our Capabilities
            </span>
            <h2 style={{ fontSize: 'calc(2.2rem + 1.2vw)', fontWeight: '300', textTransform: 'uppercase', fontFamily: 'serif', margin: 0, letterSpacing: '0.02em' }}>
              Creative Expertise
            </h2>
          </div>

          {/* Grid Cells Container */}
          <div className="capabilities-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            borderTop: '1px solid #000000',
            borderLeft: '1px solid #000000'
          }}>
            {servicesData.slice(0, 6).map((service, index) => (
              <div 
                key={service.id} 
                className="capability-cell"
                style={{
                  padding: '4.5rem 3.5rem',
                  borderRight: '1px solid #000000',
                  borderBottom: '1px solid #000000',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  playHoverSound();
                  e.currentTarget.style.backgroundColor = '#0052ff';
                  e.currentTarget.style.color = '#ffffff';
                  const arrow = e.currentTarget.querySelector('.cell-arrow');
                  if (arrow) arrow.style.transform = 'rotate(45deg) translate(2px, -2px)';
                  const num = e.currentTarget.querySelector('.cell-number');
                  if (num) num.style.color = 'rgba(255, 255, 255, 0.4)';
                  const desc = e.currentTarget.querySelector('.cell-desc');
                  if (desc) desc.style.color = 'rgba(255, 255, 255, 0.85)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#000000';
                  const arrow = e.currentTarget.querySelector('.cell-arrow');
                  if (arrow) arrow.style.transform = 'none';
                  const num = e.currentTarget.querySelector('.cell-number');
                  if (num) num.style.color = '#888888';
                  const desc = e.currentTarget.querySelector('.cell-desc');
                  if (desc) desc.style.color = '#555555';
                }}
              >
                {/* Cell Header: Number and Arrow */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="cell-number" style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#888888', letterSpacing: '0.1em', transition: 'color 0.4s' }}>
                    // 0{index + 1}
                  </span>
                  <div className="cell-arrow" style={{ fontSize: '1.2rem', fontWeight: '300', transition: 'transform 0.4s ease' }}>
                    →
                  </div>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <h3 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '400', 
                    textTransform: 'uppercase', 
                    margin: 0,
                    letterSpacing: '-0.02em',
                    fontFamily: 'var(--font-editorial)'
                  }}>
                    {service.title}
                  </h3>
                  <p className="cell-desc" style={{ 
                    fontSize: '1rem', 
                    lineHeight: '1.7', 
                    color: '#555555', 
                    fontFamily: 'serif', 
                    fontWeight: '400', 
                    margin: 0,
                    transition: 'color 0.4s'
                  }}>
                    {service.overview}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Responsive Capability styles */}
        <style>{`
          @media (max-width: 768px) {
            .capabilities-grid {
              grid-template-columns: 1fr !important;
            }
            .capability-cell {
              padding: 3rem 2rem !important;
            }
          }
        `}</style>
      </section>

      {/* BOOKS SECTION */}
      <section id="books" className="scroll-fade-in" style={{
        width: '100%',
        minHeight: '100vh',
        padding: '16vh 8vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #eeeeee'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '10vh', 
            flexWrap: 'wrap', 
            gap: '2rem', 
            borderBottom: '1px solid #eeeeee',
            paddingBottom: '2.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#888888', fontWeight: '600', display: 'block', marginBottom: '0.8rem', fontFamily: 'sans-serif' }}>
                Publishing Works
              </span>
              <h2 style={{ fontSize: 'calc(2.2rem + 1.2vw)', fontWeight: '300', textTransform: 'uppercase', fontFamily: 'serif', margin: 0 }}>
                Special Books
              </h2>
            </div>
            <Link to="/special-books" style={{ 
              fontSize: '0.8rem', 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase', 
              color: '#000000', 
              fontWeight: '700', 
              textDecoration: 'none',
              borderBottom: '2px solid #000000',
              paddingBottom: '6px',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = 0.6;
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.transform = 'none';
            }}
            >
              View Books Catalog
              <span>→</span>
            </Link>
          </div>

          {/* Books Premium Asymmetric Showcase */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '4rem',
            perspective: '2000px',
            marginTop: '2rem'
          }}>
            {booksData.slice(0, 3).map((book, idx) => (
              <Link 
                to={`/special-books/${book.id}`} 
                key={book.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  textDecoration: 'none', 
                  color: 'inherit',
                  position: 'relative',
                  group: 'true'
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget.querySelector('.book-3d-wrap');
                  const glow = e.currentTarget.querySelector('.book-ambient-glow');
                  const badge = e.currentTarget.querySelector('.book-badge');
                  if (card) {
                    card.style.transform = 'translateY(-15px) rotateY(-22deg) rotateX(8deg) scale(1.03)';
                  }
                  if (glow) {
                    glow.style.opacity = '0.75';
                    glow.style.transform = 'scale(1.15) translateZ(-10px)';
                  }
                  if (badge) {
                    badge.style.transform = 'translateY(-4px) scale(1.05)';
                    badge.style.boxShadow = '0 8px 20px rgba(191, 144, 0, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget.querySelector('.book-3d-wrap');
                  const glow = e.currentTarget.querySelector('.book-ambient-glow');
                  const badge = e.currentTarget.querySelector('.book-badge');
                  if (card) {
                    card.style.transform = 'rotateY(-8deg) rotateX(2deg)';
                  }
                  if (glow) {
                    glow.style.opacity = '0';
                    glow.style.transform = 'scale(1) translateZ(-10px)';
                  }
                  if (badge) {
                    badge.style.transform = 'none';
                    badge.style.boxShadow = 'none';
                  }
                }}
              >
                {/* 3D Book Interactive Wrapper */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '420px',
                  backgroundColor: '#fbfbfa',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '3rem 2rem',
                  boxSizing: 'border-box',
                  overflow: 'visible',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  {/* Ambient Glow using blurred book image colors */}
                  <div 
                    className="book-ambient-glow"
                    style={{
                      position: 'absolute',
                      top: '15%',
                      left: '15%',
                      right: '15%',
                      bottom: '15%',
                      backgroundImage: `url(${book.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(35px) saturate(1.8)',
                      opacity: 0,
                      zIndex: 1,
                      pointerEvents: 'none',
                      transform: 'translateZ(-10px)',
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} 
                  />

                  {/* 3D Standing Book Structure */}
                  <div 
                    className="book-3d-wrap"
                    style={{
                      width: '190px',
                      height: '270px',
                      position: 'relative',
                      transformStyle: 'preserve-3d',
                      transform: 'rotateY(-8deg) rotateX(2deg)',
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      zIndex: 2
                    }}
                  >
                    {/* Simulated Book Spine Thickness (Left 3D side) */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '24px',
                      transform: 'rotateY(-90deg) translateX(-12px)',
                      transformOrigin: 'left center',
                      background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 20%, rgba(255,255,255,0.1) 60%, rgba(0,0,0,0.2) 100%)',
                      backgroundColor: '#1a1a1a',
                      zIndex: 3
                    }} />

                    {/* Simulated Page Edge Thickness (Right 3D side) */}
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '2px',
                      bottom: '2px',
                      width: '20px',
                      transform: 'rotateY(90deg) translateX(10px)',
                      transformOrigin: 'right center',
                      background: 'repeating-linear-gradient(to right, #f4f3ef 0px, #f4f3ef 2px, #e8e7e1 3px, #e8e7e1 4px)',
                      borderRight: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.08)',
                      zIndex: 1
                    }} />

                    {/* Book Front Cover */}
                    <div 
                      className="book-front-cover"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${book.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '2px 5px 5px 2px',
                        boxShadow: 'inset 4px 0 8px rgba(255,255,255,0.15), -4px 6px 15px rgba(0,0,0,0.15)',
                        zIndex: 4,
                        transform: 'translateZ(1px)'
                      }}
                    >
                      {/* Spine Crease Line overlay */}
                      <div style={{
                        position: 'absolute',
                        left: '10px',
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',
                        boxShadow: '0 0 3px rgba(255,255,255,0.2)'
                      }} />
                    </div>

                    {/* Back Cover shadow anchor */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      boxShadow: '-12px 18px 30px rgba(0,0,0,0.28)',
                      transform: 'translateZ(-12px)',
                      borderRadius: '2px 5px 5px 2px',
                      zIndex: 0
                    }} />
                  </div>

                  {/* Collector Badge Overlay */}
                  <span 
                    className="book-badge"
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      fontSize: '0.6rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#9a7b56',
                      border: '1px solid rgba(154, 123, 86, 0.3)',
                      backgroundColor: 'rgba(251, 251, 250, 0.8)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      zIndex: 5,
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {idx === 0 ? 'Collector\'s Edit' : idx === 1 ? 'Hardcover' : 'First Edition'}
                  </span>
                </div>

                {/* Typography Metadata Redesign */}
                <div style={{ marginTop: '1.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '400', 
                      fontFamily: 'serif', 
                      margin: 0,
                      lineHeight: '1.3',
                      color: '#1a1a1a',
                      letterSpacing: '-0.01em'
                    }}>
                      {book.title}
                    </h3>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: '#9a7b56',
                      fontWeight: '300'
                    }}>
                      →
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      color: '#888888', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em',
                      fontWeight: '600',
                      fontFamily: 'sans-serif'
                    }}>
                      By {book.author}
                    </span>
                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#cccccc' }} />
                    <span style={{ 
                      fontSize: '0.68rem', 
                      color: '#9a7b56',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: '600',
                      fontFamily: 'sans-serif'
                    }}>
                      {book.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="scroll-fade-in" style={{
        width: '100%',
        minHeight: '80vh',
        padding: '12vh 8vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888888', fontWeight: '600', display: 'block', marginBottom: '1.5rem', fontFamily: 'sans-serif' }}>
            Who We Are
          </span>
          <h2 style={{ fontSize: 'calc(2rem + 1.5vw)', fontWeight: '300', fontFamily: 'serif', marginBottom: '2.5rem', lineHeight: '1.3' }}>
            We bridge the gap between cinematic visual art and technical publishing frameworks.
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#666666', fontFamily: 'serif', fontWeight: '300', marginBottom: '3rem' }}>
            Rising Media Works is built upon a philosophy of strategic refinement. We obsess over page margins, typographic pairings, and color timing to tell stories that are both authentic and unforgettable.
          </p>
          <Link to="/about" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.8rem 2rem',
            border: '1px solid #000000',
            color: '#000000',
            borderRadius: '50px',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: '600',
            textDecoration: 'none'
          }}>
            Our Story
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CONTACT SECTION (Premium Dark Footer UI) */}
      <section id="contact" style={{
        width: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '18vh 8vw 6vh 8vw',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '10vh' }}>
          
          {/* Top Row: Call To Action and Socials Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
              <h2 className="contact-title" style={{ 
                fontSize: 'calc(3.5rem + 3.2vw)', 
                fontWeight: '500', 
                lineHeight: '1.05', 
                margin: 0, 
                letterSpacing: '-0.03em',
                maxWidth: '900px',
                fontFamily: 'sans-serif'
              }}>
                Let’s start<br />from nothin’
              </h2>
              
              {/* Pill Button CTAs */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <a href="https://calendly.com/risingmediaworks" className="contact-btn" target="_blank" rel="noreferrer" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.2rem 2.8rem',
                  border: '1.2px solid rgba(255, 255, 255, 0.45)',
                  color: '#ffffff',
                  borderRadius: '100px',
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.borderColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                }}
                >
                  Book A Call 
                  <span style={{ fontSize: '1.1rem' }}>→</span>
                </a>
                <a href="mailto:Info.risingmediaworks@gmail.com" className="contact-btn" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.2rem 2.8rem',
                  border: '1.2px solid rgba(255, 255, 255, 0.45)',
                  color: '#ffffff',
                  borderRadius: '100px',
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: '700',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.borderColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                }}
                >
                  Drop us an email 
                  <span style={{ fontSize: '1rem' }}>@</span>
                </a>
              </div>
            </div>
 
            {/* Right Socials Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '2.2rem', fontWeight: '500', textAlign: 'right', minWidth: '220px', lineHeight: '1.4' }}>
              <a href="https://www.instagram.com/risingmediaworks?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==" className="contact-social-link" target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = 0.5} onMouseLeave={(e) => e.target.style.opacity = 1}>Instagram</a>
              <a href="https://wa.me/918741975000" className="contact-social-link" target="_blank" rel="noreferrer" style={{ color: '#ffffff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = 0.5} onMouseLeave={(e) => e.target.style.opacity = 1}>WhatsApp</a>
              <a href="mailto:Info.risingmediaworks@gmail.com" className="contact-social-link" style={{ color: '#ffffff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = 0.5} onMouseLeave={(e) => e.target.style.opacity = 1}>Email</a>
            </div>
          </div>

          <h1 className="footer-giant-word" style={{
            fontSize: '28vw',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '-0.07em',
            lineHeight: '0.75',
            margin: '8vh -8vw -6vh -8vw',
            textAlign: 'left',
            color: '#ffffff',
            userSelect: 'none',
            fontFamily: 'sans-serif',
            width: '100vw',
            display: 'block'
          }}>
            Rising
          </h1>

        </div>
      </section>

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

export default Home;
