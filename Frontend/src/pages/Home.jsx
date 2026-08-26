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
  const handsSectionRef = useRef(null);
  const handsCanvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [handsImages, setHandsImages] = useState([]);
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

  // Preload Hands image sequence in background
  useEffect(() => {
    const totalFrames = 150;
    const loadedImages = [];

    const pad = (num, size) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/Hands/frame_${pad(i, 4)}.jpeg`;
      loadedImages.push(img);
    }
    setHandsImages(loadedImages);
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

  // Set up canvas drawing on scroll pinned to Hands section (Identical to iPhone animation setup)
  useGSAP(() => {
    if (!handsCanvasRef.current || !handsSectionRef.current || handsImages.length === 0) return;

    const canvas = handsCanvasRef.current;
    const context = canvas.getContext('2d');
    const sequence = { frame: 0 };

    const drawImage = (frameIndex) => {
      const roundedIndex = Math.round(frameIndex);
      const img = handsImages[roundedIndex];
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
      const cy = (canvasHeight - nh) / 2;

      context.drawImage(img, cx, cy, nw, nh);
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      drawImage(sequence.frame);
    };

    window.addEventListener('resize', handleResize);

    if (handsImages[0]) {
      if (handsImages[0].complete) {
        handleResize();
      } else {
        handsImages[0].onload = () => {
          handleResize();
        };
      }
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: handsSectionRef.current,
        start: 'top top',
        end: '+=3500', // Expanded scroll distance for ultra-smooth frame steps
        pin: true,
        scrub: 2, // Enhanced cinematic inertia smoothing
        anticipatePin: 1,
      }
    });

    tl.to(sequence, {
      frame: handsImages.length - 1,
      ease: 'none',
      duration: 1,
      onUpdate: () => {
        drawImage(sequence.frame);
      }
    }, 0);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handsImages]);

  // Why Us ScrollTrigger Stagger Entrance Animation
  useGSAP(() => {
    const section = document.querySelector('#why-us');
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#why-us',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo('#why-us .why-header', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    tl.fromTo('#why-us .capability-cell', 
      { opacity: 0, y: 60, scale: 0.96 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.8, 
        stagger: 0.15, 
        ease: 'power3.out' 
      },
      '-=0.6'
    );
  }, []);

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

      {/* HANDS SHOWCASE SECTION: Pinned 3D Image Sequence Animation */}
      <section ref={handsSectionRef} id="hands-showcase" style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#000000',
        overflow: 'hidden'
      }}>
        {/* Top Blend Overlay (Pure Black Fog) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200px',
          background: 'linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0.85) 65%, transparent 100%)',
          zIndex: 4,
          pointerEvents: 'none'
        }} />

        {/* Canvas to render Hands images */}
        <canvas
          ref={handsCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            zIndex: 2,
            filter: 'contrast(1.08) brightness(1.02) saturate(1.08)',
            imageRendering: '-webkit-optimize-contrast'
          }}
        />

        {/* Bottom Black Shade Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '220px',
          background: 'linear-gradient(to top, #000000 40%, rgba(0,0,0,0.85) 75%, transparent 100%)',
          zIndex: 4,
          pointerEvents: 'none'
        }} />

        {/* Corner Mask to Hide Gemini AI Logo */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '320px',
          height: '180px',
          background: 'radial-gradient(circle at 100% 100%, #000000 65%, rgba(0,0,0,0.95) 85%, transparent 100%)',
          zIndex: 5,
          pointerEvents: 'none'
        }} />
      </section>

      {/* SERVICES / AGENCY OVERVIEW SECTION (Modern Editorial UI matching Reference) */}
      <section id="services-overview" className="scroll-fade-in" style={{
        width: '100%',
        minHeight: '100vh',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          
          {/* Top Eyebrow Header Row */}
          <div style={{
            paddingTop: '2.5rem',
            marginBottom: '8vh',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'inline-block'
            }} />
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: '600',
              color: '#ffffff',
              fontFamily: 'sans-serif'
            }}>
              ABOUT THE SERVICES
            </span>
          </div>

          {/* Massive Mixed Typography Statement */}
          <div style={{ maxWidth: '1300px', marginBottom: '8vh' }}>
            <h2 style={{
              fontSize: 'calc(2.2rem + 2.2vw)',
              fontWeight: '300',
              lineHeight: '1.25',
              letterSpacing: '-0.02em',
              margin: 0,
              color: '#ffffff',
              fontFamily: 'sans-serif'
            }}>
              <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontWeight: '400' }}>Rising Media Works</span>, a revolutionary approach to digital creation. From expert-crafted video productions to clinically proven digital architectures, it’s the <span style={{ fontFamily: 'serif', fontStyle: 'italic', fontWeight: '400' }}>new standard</span> in visual excellence.
            </h2>
          </div>

          {/* Indented Right Paragraph Block */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '12vh'
          }}>
            <p style={{
              maxWidth: '560px',
              fontSize: '0.98rem',
              lineHeight: '1.75',
              color: 'rgba(255, 255, 255, 0.65)',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: '300'
            }}>
              At Rising Media Works, we craft unique, bespoke visual campaigns and digital platforms. Specifically designed for high-impact brand positioning and audience retention, our services deliver uncompromised creative quality and technical performance.
            </p>
          </div>

          {/* Bottom Capabilities / Team Metadata Row */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '3.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '4rem'
          }}>
            {/* Left Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', height: 'fit-content' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'inline-block'
              }} />
              <span style={{
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: '600',
                color: '#ffffff',
                fontFamily: 'sans-serif'
              }}>
                CAPABILITIES
              </span>
            </div>

            {/* Right Capabilities Table List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { id: '[01]', label: 'Video Production:', val: 'High-End Commercial Direction & Cinematic Storytelling' },
                { id: '[02]', label: 'UI/UX & Web Design:', val: 'Bespoke Digital Architectures & Interactive Systems' },
                { id: '[03]', label: '3D & Motion Graphics:', val: 'Dynamic 2D/3D Animations & Title Sequences' },
                { id: '[04]', label: 'Special Books:', val: 'Premium Hardbound Publishing & Fine Editorial Design' }
              ].map((item) => (
                <div key={item.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '45px 180px 1fr',
                  alignItems: 'baseline',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'sans-serif'
                }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontStyle: 'italic', fontFamily: 'serif' }}>
                    {item.id}
                  </span>
                  <span style={{ fontWeight: '600', color: '#ffffff' }}>
                    {item.label}
                  </span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontWeight: '300' }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile Responsive injected style */}
        <style>{`
          @media (max-width: 768px) {
            #services-overview {
              padding: 8vh 5vw !important;
            }
            #services-overview div[style*="gridTemplateColumns: '1fr 2fr'"] {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
            #services-overview div[style*="gridTemplateColumns: '45px 180px 1fr'"] {
              grid-template-columns: 45px 1fr !important;
              gap: 0.5rem !important;
            }
          }
        `}</style>
      </section>

      {/* WHY RISING MEDIA WORKS SECTION (Non-Card Kinetic Typographic List UI) */}
      <section id="why-rising-media-works" className="scroll-fade-in" style={{
        width: '100%',
        minHeight: '100vh',
        padding: '14vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
          
          {/* Eyebrow and Section Header */}
          <div style={{ marginBottom: '10vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'inline-block'
              }} />
              <span style={{
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: 'sans-serif'
              }}>
                WHY RISING MEDIA WORKS
              </span>
            </div>

            <h2 style={{
              fontSize: 'calc(2.4rem + 2vw)',
              fontWeight: '300',
              fontFamily: 'serif',
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.02em',
              color: '#ffffff'
            }}>
              The Rising Standards
            </h2>
          </div>

          {/* Non-Card Typographic Rows List */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
            {[
              {
                num: '01',
                title: 'Cinematic Visual Direction',
                desc: 'Bespoke narrative timing, master color grading, and high-production visual architectures that command absolute audience retention.'
              },
              {
                num: '02',
                title: 'Architectural Precision',
                desc: 'Obsessive grid systems, golden-ratio margins, and engineering-grade web interfaces crafted for high-end digital presence.'
              },
              {
                num: '03',
                title: 'High-Throughput Delivery',
                desc: 'Streamlined editorial production pipelines built for rapid global campaign launches without compromising frame perfection.'
              },
              {
                num: '04',
                title: 'Unrivaled Engagement',
                desc: 'Interactive 3D sequences, micro-animations, and dynamic motion art that convert passive viewers into loyal brand advocates.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="why-row-item"
                style={{
                  padding: '3.5rem 2rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1.2fr 40px',
                  alignItems: 'center',
                  gap: '3rem',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  playHoverSound();
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.paddingLeft = '3rem';
                  const title = e.currentTarget.querySelector('.row-title');
                  if (title) title.style.color = '#ffffff';
                  const num = e.currentTarget.querySelector('.row-num');
                  if (num) num.style.color = '#0052ff';
                  const arrow = e.currentTarget.querySelector('.row-arrow');
                  if (arrow) {
                    arrow.style.color = '#0052ff';
                    arrow.style.transform = 'rotate(45deg) translate(2px, -2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.paddingLeft = '2rem';
                  const title = e.currentTarget.querySelector('.row-title');
                  if (title) title.style.color = 'rgba(255, 255, 255, 0.9)';
                  const num = e.currentTarget.querySelector('.row-num');
                  if (num) num.style.color = 'rgba(255, 255, 255, 0.4)';
                  const arrow = e.currentTarget.querySelector('.row-arrow');
                  if (arrow) {
                    arrow.style.color = 'rgba(255, 255, 255, 0.6)';
                    arrow.style.transform = 'none';
                  }
                }}
              >
                {/* Number */}
                <span className="row-num" style={{
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: '0.1em',
                  transition: 'color 0.4s'
                }}>
                  // {item.num}
                </span>

                {/* Title */}
                <h3 className="row-title" style={{
                  fontSize: 'calc(1.4rem + 0.6vw)',
                  fontWeight: '400',
                  textTransform: 'uppercase',
                  margin: 0,
                  fontFamily: 'var(--font-editorial)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.4s ease'
                }}>
                  {item.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.65',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                  fontFamily: 'sans-serif',
                  fontWeight: '300'
                }}>
                  {item.desc}
                </p>

                {/* Arrow */}
                <div className="row-arrow" style={{
                  fontSize: '1.4rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  transition: 'transform 0.4s ease'
                }}>
                  →
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Mobile Responsive Rules */}
        <style>{`
          @media (max-width: 900px) {
            #why-rising-media-works .why-row-item {
              grid-template-columns: 50px 1fr 30px !important;
              gap: 1.5rem !important;
              padding: 2.5rem 1rem !important;
            }
            #why-rising-media-works .why-row-item p {
              display: none !important;
            }
          }
        `}</style>
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
