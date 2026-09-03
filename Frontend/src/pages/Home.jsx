import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { servicesData, projectsData, booksData } from '../data/dummyData';
import Footer from '../components/Footer';
import { useProjectLaunch } from '../components/ProjectLaunchPortal';

gsap.registerPlugin(ScrollTrigger);

const brandLogos = [
  { name: 'Mahindra & Mahindra', src: '/logo/Mahindra-Mahindra-Logo-2012.webp' },
  { name: 'Tata Motors', src: '/logo/tata-logo-tata-icon-transparent-free-png.webp' },
  { name: 'JCB', src: '/logo/JCB_(J.C._Bamford_Excavators_Limited)_logo.svg.webp' },
  { name: 'John Deere', src: '/logo/John-Deere-Emblem.webp' },
  { name: 'Ather Energy', src: '/logo/Ather_New_Logo.webp' },
  { name: 'Piaggio', src: '/logo/Piaggio-Logo.webp' },
  { name: 'New Holland', src: '/logo/New Holland.webp' },
  { name: 'Greaves Cotton', src: '/logo/Greaves 3 Wheeler Logo-03.webp' },
  { name: 'JK Tyre', src: '/logo/jk-tyre-logo-present-scaled.webp' },
  { name: 'Brand Partner', src: '/logo/312215907_553521910110595_1889743859625241028_n.webp' },
  { name: 'Brand Partner', src: '/logo/80612d717e3e8d70fe1c456f2235a5dc.webp' },
  { name: 'Brand Partner', src: '/logo/images.webp' },
  { name: 'Brand Partner', src: '/logo/Logo (1).webp' },
  { name: 'Brand Partner', src: '/logo/te8f-dKV_400x400.webp' }
];

const Home = () => {
  const { triggerLaunch } = useProjectLaunch();
  const containerRef = useRef(null);
  const secondSectionRef = useRef(null);
  const canvasRef = useRef(null);
  const handsSectionRef = useRef(null);
  const handsCanvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [handsImages, setHandsImages] = useState([]);
  const [works, setWorks] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hoveredWhyUsImage, setHoveredWhyUsImage] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeProcessStep, setActiveProcessStep] = useState('01');
  const [activeShowcaseFilter, setActiveShowcaseFilter] = useState('ALL');

  // Fetch real works from the database (fallback gracefully if offline)
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/works').catch(() => null);
        if (response && response.ok) {
          const data = await response.json();
          setWorks(data);
        } else {
          setWorks(projectsData);
        }
      } catch (error) {
        setWorks(projectsData);
      }
    };
    fetchWorks();
  }, []);

  // Mobile Active Scroll Highlight for Process Methodology Steps - Strictly ONE blue item at a time (rAF throttled)
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

            if (closestStep) {
              const stepNum = closestStep.getAttribute('data-step-num');
              if (stepNum) {
                setActiveProcessStep(stepNum);
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth GSAP micro-animation when user switches project category filters
  useEffect(() => {
    if (document.querySelector('.selected-case-card')) {
      gsap.fromTo('.selected-case-card',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [activeShowcaseFilter]);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|\/shorts\/|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const handleCardClick = (project) => {
    const ytId = getYoutubeId(project.videoUrl);
    if (ytId) {
      setSelectedVideo(ytId);
    } else if (project.videoUrl) {
      window.open(project.videoUrl, '_blank');
    }
  };

  // Single AudioContext reference for hover sound
  const audioCtxRef = useRef(null);
  const playHoverSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
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
      // Ignore audio block
    }
  };

  // High performance 60fps continuous image sequence preloader
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
      img.src = `/Animation/frame_${pad(i, 4)}.webp`;
      if (img.decode) {
        img.decode().catch(() => {});
      }
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Preload Hands image sequence for continuous 60fps touch scroll
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
      img.src = `/Hands/frame_${pad(i, 4)}.webp`;
      if (img.decode) {
        img.decode().catch(() => {});
      }
      loadedImages.push(img);
    }
    setHandsImages(loadedImages);
  }, []);

  // Landing / Entrance animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    if (document.querySelector('.header')) {
      tl.from('.header', { opacity: 0, y: -30, duration: 1.2 }, 0.2);
    }
    if (document.querySelector('.hero-eyebrow')) {
      tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 1.2 }, 0.4);
    }
    if (document.querySelector('.hero-title')) {
      tl.from('.hero-title', { opacity: 0, y: 40, duration: 1.6 }, 0.5);
    }
    if (document.querySelector('.hero-subtitle')) {
      tl.from('.hero-subtitle', { opacity: 0, y: 25, duration: 1.2 }, 0.65);
    }
    if (document.querySelector('.hero-ctas')) {
      tl.from('.hero-ctas', { opacity: 0, y: 30, duration: 1.2 }, 0.8);
    }
    if (document.querySelector('.scroll-down-btn')) {
      tl.from('.scroll-down-btn', { opacity: 0, y: 15, duration: 1.2 }, 0.95);
    }

    // Infinite loop animation for scroll down line
    if (document.querySelector('.scroll-line-indicator')) {
      gsap.to('.scroll-line-indicator', {
        top: '100%',
        duration: 1.5,
        repeat: -1,
        ease: 'power1.inOut'
      });
    }

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

    // Staggered ScrollTrigger entrance animation when entering Selected Cases section
    if (document.querySelector('#featured-work-showcase')) {
      gsap.fromTo('.selected-cases-header',
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#featured-work-showcase',
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.selected-case-card',
        { opacity: 0, y: 65, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.selected-cases-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Contact Section Animations (Only execute if present in DOM)
    if (document.querySelector('#contact')) {
      if (document.querySelector('.contact-title')) {
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
      }

      if (document.querySelector('.contact-btn')) {
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
      }

      if (document.querySelector('.contact-social-link')) {
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
      }

      if (document.querySelector('.footer-giant-word')) {
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
      }
    }
  }, []);

  // Cursor trailing image gallery effect in the Hero section (Desktop only)
  useEffect(() => {
    if (window.innerWidth <= 1024) return;
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

  // Set up canvas drawing on scroll pinned to second section (Ultra-smooth 60fps)
  useGSAP(() => {
    if (!canvasRef.current || !secondSectionRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    const sequence = { frame: 0 };
    let lastDrawnFrame = -1;

    const drawSingleImage = (img) => {
      if (!img || !img.complete || !img.naturalWidth) return false;
      const isMobile = window.innerWidth <= 768;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = img.naturalWidth || img.width;
      const imageHeight = img.naturalHeight || img.height;

      if (!canvasWidth || !canvasHeight || !imageWidth || !imageHeight) return false;

      const r = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
      const nw = imageWidth * r;
      const nh = imageHeight * r;
      const cx = (canvasWidth - nw) / 2;
      const cyOffset = isMobile ? 0 : 80;
      const cy = ((canvasHeight - nh) / 2) + cyOffset;

      context.drawImage(img, cx, cy, nw, nh);
      return true;
    };

    const drawImage = (frameIndex) => {
      if (!images || images.length === 0) return;
      const targetFrame = Math.round(frameIndex);
      const maxIdx = images.length - 1;
      const clampedIdx = Math.max(0, Math.min(maxIdx, targetFrame));

      if (clampedIdx === lastDrawnFrame) return;

      const img = images[clampedIdx];
      let drawn = drawSingleImage(img);

      if (!drawn) {
        for (let offset = 1; offset < 25; offset++) {
          const prev = images[clampedIdx - offset];
          if (prev && drawSingleImage(prev)) {
            drawn = true;
            break;
          }
          const next = images[clampedIdx + offset];
          if (next && drawSingleImage(next)) {
            drawn = true;
            break;
          }
        }
      }

      if (drawn) {
        lastDrawnFrame = clampedIdx;
      }
    };

    const handleResize = () => {
      const isMobile = window.innerWidth <= 1024;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = isMobile ? 'medium' : 'high';
      lastDrawnFrame = -1;
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

    const isMobile = window.innerWidth <= 1024 || (typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

    // Timeline for the pinned second section with smooth mobile scrub dampening
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: secondSectionRef.current,
        start: 'top top',
        end: isMobile ? '+=600' : '+=1400',
        pin: true,
        scrub: 0.1, // Zero-lag smooth direct scroll tracking
        anticipatePin: 1,
        refreshPriority: 2
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

  // Set up canvas drawing on scroll pinned to Hands section (Zero-Lag 60fps)
  useGSAP(() => {
    if (!handsCanvasRef.current || !handsSectionRef.current || handsImages.length === 0) return;

    const canvas = handsCanvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    const sequence = { frame: 0 };
    let lastDrawnFrame = -1;

    const drawSingleImage = (img) => {
      if (!img || !img.complete || !img.naturalWidth) return false;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = img.naturalWidth || img.width;
      const imageHeight = img.naturalHeight || img.height;

      if (!canvasWidth || !canvasHeight || !imageWidth || !imageHeight) return false;

      // Fill screen proportionally covering canvas dimensions cleanly on mobile and desktop
      const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);

      const nw = imageWidth * scale;
      const nh = imageHeight * scale;
      const cx = (canvasWidth - nw) / 2;
      const cy = (canvasHeight - nh) / 2;

      context.drawImage(img, cx, cy, nw, nh);

      // Mask Gemini Logo at bottom right corner seamlessly on canvas
      const logoX = cx + nw * 0.908;
      const logoY = cy + nh * 0.88;
      const logoRadius = Math.max(nw * 0.05, 45);

      context.save();
      context.fillStyle = '#000000';
      context.beginPath();
      context.arc(logoX, logoY, logoRadius, 0, Math.PI * 2);
      context.fill();
      context.restore();

      return true;
    };

    const drawImage = (frameIndex) => {
      if (!handsImages || handsImages.length === 0) return;
      const targetFrame = Math.round(frameIndex);
      const maxIdx = handsImages.length - 1;
      const clampedIdx = Math.max(0, Math.min(maxIdx, targetFrame));

      if (clampedIdx === lastDrawnFrame) return;

      const img = handsImages[clampedIdx];
      let drawn = drawSingleImage(img);

      // Mobile network fallback: if target frame is still downloading, find closest loaded frame
      if (!drawn) {
        for (let offset = 1; offset < 25; offset++) {
          const prev = handsImages[clampedIdx - offset];
          if (prev && drawSingleImage(prev)) {
            drawn = true;
            break;
          }
          const next = handsImages[clampedIdx + offset];
          if (next && drawSingleImage(next)) {
            drawn = true;
            break;
          }
        }
      }

      if (drawn) {
        lastDrawnFrame = clampedIdx;
      }
    };

    const handleResize = () => {
      const isMobile = window.innerWidth <= 1024;
      const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = isMobile ? 'medium' : 'high';
      lastDrawnFrame = -1;
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

    const isMobile = window.innerWidth <= 1024 || (typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    const maxHandFrame = Math.min(205, handsImages.length - 1);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: handsSectionRef.current,
        start: 'top top',
        end: isMobile ? '+=650' : '+=1400',
        pin: true,
        scrub: 0.1, // Zero-lag smooth direct scroll tracking
        anticipatePin: 1,
        refreshPriority: 1
      }
    });

    tl.to(sequence, {
      frame: maxHandFrame,
      ease: 'none',
      duration: 0.70,
      onUpdate: () => {
        drawImage(sequence.frame);
      }
    }, 0);

    // Text overlay fades in and completes right as the handshake sequence reaches its final position
    tl.fromTo('.hands-showcase-text',
      { opacity: 0, y: 25, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.20, ease: 'power2.out' },
      0.50
    );

    // Refresh and sort all ScrollTriggers after layout metrics stabilize
    setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 150);

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

  // One-scroll snap from Section 1 (Hero) to Section 2 (#showcase)
  useEffect(() => {
    let isSnapping = false;

    const handleWheel = (e) => {
      if (window.scrollY < 120 && e.deltaY > 5 && !isSnapping) {
        const secondSec = document.querySelector('#showcase');
        if (secondSec) {
          e.preventDefault();
          isSnapping = true;
          window.scrollTo({
            top: secondSec.offsetTop,
            behavior: 'smooth'
          });
          setTimeout(() => {
            isSnapping = false;
          }, 900);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Unified Global Active Scroll Highlight - ONLY ONE item blue across the ENTIRE viewport at any time
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const capRows = Array.from(document.querySelectorAll('#services-overview .cap-item-row'));
          const whyRows = Array.from(document.querySelectorAll('#why-rising-media-works .why-row-item'));
          const allRows = [...capRows, ...whyRows];

          if (allRows.length > 0) {
            const viewportCenter = window.innerHeight / 2;
            let closestRow = null;
            let minDistance = Infinity;

            allRows.forEach((row) => {
              const rect = row.getBoundingClientRect();
              if (rect.bottom > 40 && rect.top < window.innerHeight - 40) {
                const rowCenter = rect.top + rect.height / 2;
                const distance = Math.abs(rowCenter - viewportCenter);
                if (distance < minDistance) {
                  minDistance = distance;
                  closestRow = row;
                }
              }
            });

            // Update all capability rows
            capRows.forEach((row) => {
              if (window.innerWidth > 1024 && row.matches(':hover')) return;

              const capId = row.querySelector('.cap-id');
              const capVal = row.querySelector('.cap-val-text');
              const capArrow = row.querySelector('.cap-arrow');
              const capLabel = row.querySelector('.cap-label');
              const mobileImg = row.querySelector('.mobile-active-img');

              if (row === closestRow) {
                row.style.backgroundColor = '#0052ff';
                row.style.boxShadow = '0 8px 25px rgba(0, 82, 255, 0.45)';
                row.style.transform = window.innerWidth <= 1024 ? 'scale(1.02)' : 'translateX(10px)';
                row.style.borderBottomColor = '#ffffff';
                if (capId) { capId.style.color = '#ffffff'; capId.style.opacity = '0.95'; }
                if (capLabel) { capLabel.style.color = '#ffffff'; }
                if (capVal) { capVal.style.color = 'rgba(255, 255, 255, 0.95)'; capVal.style.opacity = '1'; }
                if (capArrow) { capArrow.style.opacity = '1'; capArrow.style.transform = 'translateX(4px)'; }
                if (mobileImg && window.innerWidth <= 1024) {
                  mobileImg.style.maxHeight = '200px';
                  mobileImg.style.opacity = '1';
                  mobileImg.style.marginTop = '1rem';
                }
              } else {
                row.style.backgroundColor = 'transparent';
                row.style.boxShadow = 'none';
                row.style.transform = 'none';
                row.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
                if (capId) { capId.style.color = 'rgba(255, 255, 255, 0.5)'; capId.style.opacity = '1'; }
                if (capLabel) { capLabel.style.color = '#ffffff'; }
                if (capVal) { capVal.style.color = 'rgba(255, 255, 255, 0.7)'; capVal.style.opacity = '0.85'; }
                if (capArrow) { capArrow.style.opacity = '0'; capArrow.style.transform = 'none'; }
                if (mobileImg) {
                  mobileImg.style.maxHeight = '0px';
                  mobileImg.style.opacity = '0';
                  mobileImg.style.marginTop = '0px';
                }
              }
            });

            // Update all why us rows
            whyRows.forEach((row) => {
              if (window.innerWidth > 1024 && row.matches(':hover')) return;

              const numEl = row.querySelector('.row-num');
              const titleEl = row.querySelector('.row-title');
              const descEl = row.querySelector('.why-row-desc');
              const mobileImg = row.querySelector('.mobile-active-img');

              if (row === closestRow) {
                row.style.backgroundColor = '#0052ff';
                row.style.boxShadow = '0 8px 25px rgba(0, 82, 255, 0.45)';
                row.style.transform = window.innerWidth <= 1024 ? 'scale(1.02)' : 'translateX(10px)';
                if (numEl) { numEl.style.color = '#ffffff'; numEl.style.opacity = '0.95'; }
                if (titleEl) { titleEl.style.color = '#ffffff'; }
                if (descEl) { descEl.style.color = 'rgba(255, 255, 255, 0.95)'; }
                if (mobileImg && window.innerWidth <= 1024) {
                  mobileImg.style.maxHeight = '200px';
                  mobileImg.style.opacity = '1';
                  mobileImg.style.marginTop = '1.2rem';
                }
              } else {
                row.style.backgroundColor = 'transparent';
                row.style.boxShadow = 'none';
                row.style.transform = 'none';
                if (numEl) { numEl.style.color = 'rgba(255, 255, 255, 0.4)'; numEl.style.opacity = '1'; }
                if (titleEl) { titleEl.style.color = 'rgba(255, 255, 255, 0.9)'; }
                if (descEl) { descEl.style.color = 'rgba(255, 255, 255, 0.6)'; }
                if (mobileImg) {
                  mobileImg.style.maxHeight = '0px';
                  mobileImg.style.opacity = '0';
                  mobileImg.style.marginTop = '0px';
                }
              }
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile Active Scroll Highlight for Process Methodology Steps (.process-step-col) - ONE item at a time (rAF throttled)
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
              const numEl = col.querySelector('.method-num') || col.querySelector('span');
              const labelEl = col.querySelector('.method-label') || col.querySelector('div');

              if (col === closestStep) {
                col.style.backgroundColor = '#0052ff';
                col.style.boxShadow = '0 10px 30px rgba(0, 82, 255, 0.45)';
                col.style.transform = 'translateY(-4px) scale(1.03)';
                col.style.borderRadius = '16px';
                if (numEl) { numEl.style.color = '#ffffff'; numEl.style.transform = 'scale(1.08)'; }
                if (labelEl) {
                  labelEl.style.color = '#ffffff';
                  const childDivs = labelEl.querySelectorAll('div');
                  childDivs.forEach(d => d.style.color = '#ffffff');
                }
              } else {
                col.style.backgroundColor = 'transparent';
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.8rem', maxWidth: '1100px' }}>
          <span className="hero-eyebrow eyebrow" style={{
            fontSize: '0.8rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#666666',
            fontWeight: '600',
            fontFamily: 'sans-serif'
          }}>
            CREATIVE AGENCY & DIGITAL PRODUCTION STUDIO
          </span>

          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
            fontWeight: '300',
            lineHeight: '1.08',
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            margin: 0,
            fontFamily: 'serif',
            color: '#000000'
          }}>
            We Don’t Just Create Content.<br />
            <span style={{ fontStyle: 'italic', fontWeight: '400' }}>We Build Brands.</span>
          </h1>

          <p className="hero-subtitle" style={{
            maxWidth: '750px',
            fontSize: 'calc(0.95rem + 0.3vw)',
            lineHeight: '1.7',
            color: '#555555',
            fontWeight: '300',
            fontFamily: 'sans-serif',
            margin: '0.5rem 0 1.2rem 0'
          }}>
            Rising Media Works is a creative agency helping businesses, brands, and ideas become more visible, memorable, and meaningful through strategy, design, storytelling, and digital experiences.
          </p>

          <div className="hero-ctas" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="hero-btn" to="/contact" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '1.1rem 2.6rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              borderRadius: '50px',
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: '600',
              transition: 'all 0.35s ease',
              textDecoration: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              playHoverSound();
              e.currentTarget.style.backgroundColor = '#0052ff';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,82,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            }}
            onClick={(e) => triggerLaunch(e, '/contact')}
            >
              Start A Project →
            </Link>

            <Link className="hero-btn-secondary" to="/work" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '1.1rem 2.4rem',
              backgroundColor: 'transparent',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              color: '#000000',
              borderRadius: '50px',
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: '600',
              transition: 'all 0.35s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              playHoverSound();
              e.currentTarget.style.borderColor = '#000000';
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.25)';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'none';
            }}
            >
              Explore Our Works ↗
            </Link>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <a 
          href="#showcase" 
          className="scroll-down-btn" 
          onClick={(e) => {
            e.preventDefault();
            const secondSec = document.querySelector('#showcase');
            if (secondSec) {
              window.scrollTo({ top: secondSec.offsetTop, behavior: 'smooth' });
            }
          }}
          style={{
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
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            imageRendering: '-webkit-optimize-contrast'
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
        {/* Top Blend Overlay (Subtle Edge Fade) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100px',
          background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
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
            willChange: 'transform',
            transform: 'translate3d(0,0,0)',
            imageRendering: '-webkit-optimize-contrast'
          }}
        />

        {/* Bottom Subtle Edge Blend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100px',
          background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
          zIndex: 4,
          pointerEvents: 'none'
        }} />

        {/* Text overlay appearing near the end of the handshake sequence (Positioned cleanly above the hands) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '12vh',
          paddingLeft: '5vw',
          paddingRight: '5vw',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 6
        }}>
          <div className="hands-showcase-text" style={{
            textAlign: 'center',
            maxWidth: '860px',
            opacity: 0
          }}>
            <p style={{
              fontSize: 'calc(1.1rem + 0.5vw)',
              lineHeight: '1.5',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: '300',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.95)'
            }}>
              WE PARTNER WITH INDUSTRY LEADERS TO BUILD SOMETHING WORTH REMEMBERING
            </p>
          </div>
        </div>
      </section>

      {/* BRAND PARTNERS SHOWCASE SECTION (Showcasing all 14 brand logos right after handshake sequence) */}
      <section id="brand-partners" style={{
        width: '100%',
        padding: '6vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative',
        borderTop: 'none',
        borderBottom: 'none'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          
          {/* Top Description Text */}
          <div style={{ marginBottom: '3rem', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <p style={{
              maxWidth: '820px',
              fontSize: 'calc(0.95rem + 0.35vw)',
              lineHeight: '1.75',
              color: 'rgba(255, 255, 255, 0.78)',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: '300',
              letterSpacing: '0.01em'
            }}>
              Partnering with global leaders in automotive, engineering, mobility, and industrial innovation to deliver high-impact visual campaigns and production.
            </p>
          </div>

          {/* Infinite Auto-Scrolling Marquee Ticker */}
          <div className="brand-marquee-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
            {/* Row 1: Moving Left */}
            <div className="brand-marquee-track-left">
              {[...brandLogos, ...brandLogos].map((brand, idx) => (
                <div
                  key={idx}
                  className="brand-logo-card"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    height: '105px',
                    width: '210px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    playHoverSound();
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 82, 255, 0.4)';
                    e.currentTarget.style.borderColor = '#0052ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <img
                    src={brand.src}
                    alt={brand.name}
                    style={{
                      maxHeight: '60px',
                      maxWidth: '85%',
                      objectFit: 'contain',
                      filter: 'contrast(1.05)'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Row 2: Moving Right */}
            <div className="brand-marquee-track-right">
              {[...brandLogos.slice().reverse(), ...brandLogos.slice().reverse()].map((brand, idx) => (
                <div
                  key={idx}
                  className="brand-logo-card"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    height: '105px',
                    width: '210px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    playHoverSound();
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 82, 255, 0.4)';
                    e.currentTarget.style.borderColor = '#0052ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <img
                    src={brand.src}
                    alt={brand.name}
                    style={{
                      maxHeight: '60px',
                      maxWidth: '85%',
                      objectFit: 'contain',
                      filter: 'contrast(1.05)'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
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
          <div className="services-eyebrow-row" style={{
            paddingTop: '2.5rem',
            marginBottom: '6vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                fontSize: '0.75rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: '700',
                color: '#ffffff',
                fontFamily: "'Valley Sans', 'Manrope', sans-serif"
              }}>
                CAPABILITIES
              </span>
            </div>

            <Link 
              to="/services" 
              className="services-explore-link"
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: '#0052ff',
                padding: '0.6rem 1.4rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontFamily: "'Valley Sans', 'Manrope', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 20px rgba(0, 82, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0052ff';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 82, 255, 0.45)';
              }}
            >
              EXPLORE ALL SERVICES →
            </Link>
          </div>

          {/* Massive Mixed Typography Statement */}
          <div style={{ maxWidth: '1300px', marginBottom: '6vh' }}>
            <Link to="/services" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2 
                className="services-main-headline"
                style={{
                  fontSize: 'calc(2.4rem + 2vw)',
                  fontWeight: '300',
                  lineHeight: '1.2',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  color: '#ffffff',
                  fontFamily: 'serif',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Creative Work <br />
                <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#ffffff' }}>With A Purpose.</span>
              </h2>
            </Link>
          </div>

          {/* Indented Right Paragraph Block */}
          <div className="services-paragraph-wrapper" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '10vh'
          }}>
            <p style={{
              maxWidth: '620px',
              fontSize: '1.05rem',
              lineHeight: '1.75',
              color: 'rgba(255, 255, 255, 0.75)',
              margin: 0,
              fontFamily: 'sans-serif',
              fontWeight: '300'
            }}>
              We combine strategy, creativity, technology, and production to create communication that looks distinctive and works for your business.
            </p>
          </div>

          {/* Bottom Capabilities / Team Metadata Row */}
          <div 
            className="capabilities-grid-layout"
            style={{
              borderTop: 'none',
              paddingTop: '4rem',
              display: 'grid',
              gridTemplateColumns: '1fr 2.5fr',
              gap: '4rem'
            }}
          >
            {/* Left Header with Glowing Dot Badge */}
            <div className="services-what-we-do-header" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', height: 'fit-content' }}>
              <span style={{
                fontSize: '0.8rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: '700',
                color: '#ffffff',
                fontFamily: "'Valley Sans', 'Manrope', sans-serif"
              }}>
                WHAT WE DO
              </span>
            </div>

            {/* Right Capabilities Table List with Interactive Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { id: '[01]', serviceId: 'video-production', label: 'Video Production:', val: 'Brand Films, Corporate, Commercial & Social Media Video Experiences', image: 'https://i.pinimg.com/1200x/df/03/93/df0393965c6fdce90e8843efd9a9bc69.jpg' },
                { id: '[02]', serviceId: 'video-editing', label: 'Video Editing:', val: 'Short-Form Reels, YouTube, Colour Grading & Post-Production', image: 'https://i.pinimg.com/736x/12/a3/81/12a381aa8035415c33511ae7d0c76edf.jpg' },
                { id: '[03]', serviceId: 'motion-graphics', label: 'Motion Graphics:', val: '2D/3D Motion, Logo Animation, Explainer Videos & Title Sequences', image: 'https://i.pinimg.com/736x/17/32/a2/1732a2c3d3af087ba755a97b145c3103.jpg' },
                { id: '[04]', serviceId: 'branding', label: 'Branding & Creative Design:', val: 'Brand Identity, Logo Design, Guidelines & Campaign Design', image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?auto=format&fit=crop&w=800&q=80' },
                { id: '[05]', serviceId: 'web-design', label: 'Web Design & Development:', val: 'Modern UI/UX, Custom Web Architectures & High-Conversion Landing Pages', image: 'https://i.pinimg.com/736x/0c/e8/08/0ce80850ca4f8ca3b3c367e370323a0e.jpg' },
                { id: '[06]', serviceId: 'digital-content', label: 'Digital Content & Social Media:', val: 'Content Strategy, Social Media Management & Creative Promotion', image: 'https://i.pinimg.com/736x/1b/f0/b7/1bf0b79fc9d6a8c78bf528f83ccdb316.jpg' },
                { id: '[07]', serviceId: 'photography', label: 'Photography & Visual Production:', val: 'Product, Campaign & Marketing Visual Photography', image: 'https://i.pinimg.com/736x/92/fd/f8/92fdf83f9ba8db832d81d0b486a2490d.jpg' },
                { id: '[08]', serviceId: 'book-design', label: 'Book Design & Publishing:', val: 'Cover Design, Interior Layout, Print-Ready Files & KDP Publishing', image: 'https://i.pinimg.com/1200x/3c/e7/4b/3ce74bc3ae3f60eeac738835773f2f47.jpg' }
              ].map((item) => (
                <Link
                  key={item.id}
                  to={`/services/${item.serviceId}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div 
                    className="cap-item-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '55px 210px 1fr auto',
                      alignItems: 'center',
                      fontSize: '0.95rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontFamily: 'sans-serif',
                      padding: '1.2rem 1.5rem',
                      borderRadius: '12px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      playHoverSound();
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(10px)';
                      e.currentTarget.style.borderBottomColor = '#ffffff';
                      const idxEl = e.currentTarget.querySelector('.cap-id');
                      if (idxEl) idxEl.style.color = '#ffffff';
                      const labelEl = e.currentTarget.querySelector('.cap-label');
                      if (labelEl) labelEl.style.color = '#ffffff';
                      const arrowEl = e.currentTarget.querySelector('.cap-arrow');
                      if (arrowEl) {
                        arrowEl.style.opacity = '1';
                        arrowEl.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
                      const idxEl = e.currentTarget.querySelector('.cap-id');
                      if (idxEl) idxEl.style.color = 'rgba(255, 255, 255, 0.5)';
                      const labelEl = e.currentTarget.querySelector('.cap-label');
                      if (labelEl) labelEl.style.color = '#ffffff';
                      const arrowEl = e.currentTarget.querySelector('.cap-arrow');
                      if (arrowEl) {
                        arrowEl.style.opacity = '0';
                        arrowEl.style.transform = 'none';
                      }
                    }}
                  >
                    <span className="cap-id" style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: '600', fontFamily: 'monospace', fontSize: '0.9rem', transition: 'color 0.3s' }}>
                      {item.id}
                    </span>
                    <span className="cap-label" style={{ fontWeight: '600', color: '#ffffff', fontSize: '1rem', transition: 'color 0.3s' }}>
                      {item.label}
                    </span>
                    <span className="cap-val-text" style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: '300', fontSize: '0.95rem' }}>
                      {item.val}
                    </span>
                    <span className="cap-arrow" style={{ opacity: 0, color: '#ffffff', transition: 'all 0.3s ease', fontSize: '1.1rem', fontWeight: 'bold' }}>
                      →
                    </span>

                    {/* Mobile Phone View Active Image Highlight Container */}
                    <div className="mobile-active-img" style={{
                      width: '100%',
                      maxHeight: '0px',
                      opacity: 0,
                      overflow: 'hidden',
                      borderRadius: '10px',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      marginTop: '0px',
                      gridColumn: '1 / -1'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.label} 
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          display: 'block'
                        }} 
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* WHY RISING MEDIA WORKS SECTION (Kinetic Typographic List with Hover Image Reveal UI) */}
      <section 
        id="why-rising-media-works" 
        className="scroll-fade-in" 
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        style={{
          width: '100%',
          minHeight: '100vh',
          padding: '14vh 6vw',
          boxSizing: 'border-box',
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
          borderTop: 'none'
        }}
      >
        <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
          
          {/* Eyebrow and Section Header */}
          <div className="why-header-wrapper" style={{ marginBottom: '10vh' }}>
            <div className="why-eyebrow-container" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.5)',
                fontFamily: "'Valley Sans', 'Manrope', sans-serif"
              }}>
                WHY RISING MEDIA WORKS
              </span>
            </div>

            <h2 className="why-main-title" style={{
              fontSize: 'calc(2.4rem + 2vw)',
              fontWeight: '300',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.02em',
              color: '#ffffff'
            }}>
              The Rising Standards
            </h2>
          </div>

          {/* Non-Card Typographic Rows List */}
          <div style={{ borderTop: 'none' }}>
            {[
              {
                num: '01',
                title: 'STRATEGY MEETS CREATIVITY',
                desc: 'We combine strategic thinking with creative execution to ensure that every visual decision supports a larger business objective.',
                image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
              },
              {
                num: '02',
                title: 'BUILT AROUND YOUR BRAND',
                desc: 'No one-size-fits-all creative. We develop concepts, visuals, and content around your brand identity, audience, and goals.',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
              },
              {
                num: '03',
                title: 'ONE CREATIVE PARTNER',
                desc: 'From strategy and design to production, editing, motion, web, and digital content, we bring multiple creative capabilities together.',
                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
              },
              {
                num: '04',
                title: 'DETAIL MATTERS',
                desc: 'Typography, composition, pacing, colour, sound, movement, layout, and consistency — we pay attention to the details that make creative work feel finished.',
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
              },
              {
                num: '05',
                title: 'MADE FOR THE DIGITAL WORLD',
                desc: "We create content and experiences designed for today's platforms while keeping the core brand identity consistent across every touchpoint.",
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="why-row-item"
                style={{
                  padding: '3.5rem 2rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 1.2fr',
                  alignItems: 'center',
                  gap: '3rem',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  playHoverSound();
                  setHoveredWhyUsImage(item.image);
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.paddingLeft = '3rem';
                  const title = e.currentTarget.querySelector('.row-title');
                  if (title) title.style.color = '#ffffff';
                  const num = e.currentTarget.querySelector('.row-num');
                  if (num) num.style.color = '#0052ff';
                }}
                onMouseLeave={(e) => {
                  setHoveredWhyUsImage(null);
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.paddingLeft = '2rem';
                  const title = e.currentTarget.querySelector('.row-title');
                  if (title) title.style.color = 'rgba(255, 255, 255, 0.9)';
                  const num = e.currentTarget.querySelector('.row-num');
                  if (num) num.style.color = 'rgba(255, 255, 255, 0.4)';
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
                  {item.num}
                </span>

                {/* Title */}
                <h3 className="row-title" style={{
                  fontSize: 'calc(1.3rem + 0.5vw)',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  margin: 0,
                  fontFamily: "'Valley Sans', 'Manrope', sans-serif",
                  color: 'rgba(255, 255, 255, 0.9)',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.4s ease'
                }}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className="why-row-desc" style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.65',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                  fontFamily: 'sans-serif',
                  fontWeight: '300'
                }}>
                  {item.desc}
                </p>

                {/* Mobile Phone View Active Image Highlight Container */}
                <div className="mobile-active-img" style={{
                  width: '100%',
                  maxHeight: '0px',
                  opacity: 0,
                  overflow: 'hidden',
                  borderRadius: '10px',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  marginTop: '0px',
                  gridColumn: '1 / -1'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      display: 'block'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Floating Cursor-Following Image Preview */}
        <div 
          className="why-hover-preview"
          style={{
            position: 'fixed',
            top: mousePos.y - 110,
            left: mousePos.x + 30,
            width: '320px',
            height: '210px',
            borderRadius: '16px',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 99999,
            opacity: hoveredWhyUsImage ? 1 : 0,
            transform: hoveredWhyUsImage ? 'scale(1) rotate(2deg)' : 'scale(0.8) rotate(0deg)',
            transition: 'opacity 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.4)'
          }}
        >
          {hoveredWhyUsImage && (
            <img 
              src={hoveredWhyUsImage} 
              alt="Preview" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          )}
        </div>
      </section>

      {/* FEATURED WORK / SELECTED CASES SECTION (Light Minimalist Editorial Design) */}
      <section id="featured-work-showcase" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative',
        borderTop: 'none'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          
          {/* Header Row: Category List + Selected Cases Title */}
          <div className="selected-cases-header" style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr auto',
            alignItems: 'flex-start',
            marginBottom: '10vh',
            gap: '2.5rem'
          }}>
            {/* Category Counts Column - Dynamically calculated from real project cases */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: '600',
              fontFamily: 'monospace',
              color: '#18181b',
              paddingTop: '0.8rem'
            }}>
              {[
                { 
                  key: 'ALL', 
                  label: 'ALL', 
                  count: [
                    { id: 'case-mahindra-1', category: 'BRANDING' },
                    { id: 'case-mahindra-2', category: 'PRODUCT' },
                    { id: 'case-greaves', category: 'BRANDING' },
                    { id: 'case-ather', category: 'BRANDING' },
                    { id: 'case-publishing', category: 'PRODUCT' },
                    { id: 'case-nh', category: 'WEB' }
                  ].length 
                },
                { 
                  key: 'BRANDING', 
                  label: 'BRANDING', 
                  count: [
                    { id: 'case-mahindra-1', category: 'BRANDING' },
                    { id: 'case-mahindra-2', category: 'PRODUCT' },
                    { id: 'case-greaves', category: 'BRANDING' },
                    { id: 'case-ather', category: 'BRANDING' },
                    { id: 'case-publishing', category: 'PRODUCT' },
                    { id: 'case-nh', category: 'WEB' }
                  ].filter(i => i.category === 'BRANDING').length 
                },
                { 
                  key: 'WEB', 
                  label: 'WEB & APP', 
                  count: [
                    { id: 'case-mahindra-1', category: 'BRANDING' },
                    { id: 'case-mahindra-2', category: 'PRODUCT' },
                    { id: 'case-greaves', category: 'BRANDING' },
                    { id: 'case-ather', category: 'BRANDING' },
                    { id: 'case-publishing', category: 'PRODUCT' },
                    { id: 'case-nh', category: 'WEB' }
                  ].filter(i => i.category === 'WEB').length 
                },
                { 
                  key: 'PRODUCT', 
                  label: 'PRODUCT & MOTION', 
                  count: [
                    { id: 'case-mahindra-1', category: 'BRANDING' },
                    { id: 'case-mahindra-2', category: 'PRODUCT' },
                    { id: 'case-greaves', category: 'BRANDING' },
                    { id: 'case-ather', category: 'BRANDING' },
                    { id: 'case-publishing', category: 'PRODUCT' },
                    { id: 'case-nh', category: 'WEB' }
                  ].filter(i => i.category === 'PRODUCT').length 
                }
              ].map(cat => (
                <div 
                  key={cat.key}
                  onClick={() => setActiveShowcaseFilter(cat.key)}
                  style={{
                    cursor: 'pointer',
                    color: activeShowcaseFilter === cat.key ? '#000000' : '#71717a',
                    fontWeight: activeShowcaseFilter === cat.key ? '700' : '500',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {cat.label} ({cat.count})
                  {activeShowcaseFilter === cat.key && (
                    <span style={{ fontSize: '0.8rem', color: '#10b981' }}>●</span>
                  )}
                </div>
              ))}
            </div>

            {/* Giant Title + Accent Dot */}
            <div>
              <h2 style={{
                fontSize: 'clamp(3rem, 6.5vw, 6.2rem)',
                fontWeight: '500',
                fontFamily: "'Manrope', sans-serif",
                margin: 0,
                letterSpacing: '-0.035em',
                lineHeight: '1.05',
                color: '#000000'
              }}>
                Selected Cases
              </h2>

              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)',
                  display: 'inline-block'
                }} />
              </div>
            </div>

            {/* Top Right Link */}
            <Link 
              to="/work" 
              style={{
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: '700',
                color: '#000000',
                border: '1.5px solid #000000',
                padding: '0.75rem 1.8rem',
                borderRadius: '50px',
                textDecoration: 'none',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ffffff',
                marginTop: '0.8rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.transform = 'none';
              }}
            >
              ALL CASES →
            </Link>
          </div>

          {/* Staggered Asymmetric Cases Cards Grid */}
          <div className="selected-cases-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4rem 2.5rem',
            alignItems: 'start'
          }}>
            {[
              {
                id: 'case-mahindra-1',
                title: 'MAHINDRA & MAHINDRA',
                subtitle: 'Electric Vehicle Commercial Launch & Tractor Plant Film',
                category: 'BRANDING',
                image: 'https://img.youtube.com/vi/w_xOxPuBmjk/hqdefault.jpg',
                videoUrl: 'https://www.youtube.com/watch?v=w_xOxPuBmjk',
                aspectRatio: '16/10',
                staggerOffset: '0px'
              },
              {
                id: 'case-mahindra-2',
                title: 'MAHINDRA BRAND CAMPAIGN',
                subtitle: 'Featured Commercial Video Production & Industrial Showcase',
                category: 'PRODUCT',
                image: 'https://img.youtube.com/vi/JR5Ay3Du1SQ/hqdefault.jpg',
                videoUrl: 'https://www.youtube.com/watch?v=JR5Ay3Du1SQ',
                aspectRatio: '1/1',
                staggerOffset: '4rem' // Staggered vertical displacement matching reference
              },
              {
                id: 'case-greaves',
                title: 'GREAVES COTTON',
                subtitle: 'Corporate Brand Film & Future Clean Mobility Showcase',
                category: 'BRANDING',
                image: 'https://img.youtube.com/vi/nc7Dn7nzjHk/hqdefault.jpg',
                videoUrl: 'https://www.youtube.com/watch?v=nc7Dn7nzjHk&t=73s',
                bgColor: '#e6eff7', // Soft sky blue background container matching reference
                aspectRatio: '4/5',
                staggerOffset: '0px'
              },
              {
                id: 'case-ather',
                title: 'ATHER ENERGY',
                subtitle: 'Clean Electric Scooter Visual Campaign & Motion Series',
                category: 'BRANDING',
                image: 'https://img.youtube.com/vi/SGcGnys014E/hqdefault.jpg',
                videoUrl: 'https://www.youtube.com/watch?v=SGcGnys014E',
                aspectRatio: '16/10',
                staggerOffset: '0px'
              },
              {
                id: 'case-publishing',
                title: 'RISING PUBLISHING // VOL. 01',
                subtitle: '3D Book Cover Art, Typesetting & Kindle Publishing',
                category: 'PRODUCT',
                image: 'https://i.pinimg.com/736x/59/8b/b5/598bb5309e1cac0e08e0b18dc4f4b6af.jpg',
                linkUrl: '/special-books',
                aspectRatio: '1/1',
                staggerOffset: '4rem'
              },
              {
                id: 'case-nh',
                title: 'NEW HOLLAND (NH GROUP)',
                subtitle: 'Industrial Heavy Machinery Corporate Documentary',
                category: 'WEB',
                image: 'https://img.youtube.com/vi/A1pwtdmXWtk/hqdefault.jpg',
                videoUrl: 'https://www.youtube.com/watch?v=A1pwtdmXWtk',
                aspectRatio: '4/5',
                staggerOffset: '0px'
              }
            ]
            .filter(item => activeShowcaseFilter === 'ALL' || item.category === activeShowcaseFilter)
            .map((item) => (
              <div
                key={item.id}
                className="selected-case-card"
                onClick={() => {
                  if (item.linkUrl) {
                    window.location.href = item.linkUrl;
                  } else {
                    handleCardClick(item);
                  }
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  marginTop: item.staggerOffset,
                  cursor: 'pointer',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  playHoverSound();
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  const img = e.currentTarget.querySelector('.case-img');
                  if (img) img.style.transform = 'scale(1.06)';
                  const title = e.currentTarget.querySelector('.case-title');
                  if (title) title.style.color = '#0052ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  const img = e.currentTarget.querySelector('.case-img');
                  if (img) img.style.transform = 'scale(1)';
                  const title = e.currentTarget.querySelector('.case-title');
                  if (title) title.style.color = '#000000';
                }}
              >
                {/* Media Wrapper */}
                <div style={{
                  width: '100%',
                  aspectRatio: item.aspectRatio || '16/10',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  backgroundColor: item.bgColor || '#f4f4f5',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    className="case-img"
                    src={item.image} 
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'block'
                    }} 
                  />
                </div>

                {/* Typography Label Underneath matching Reference Screenshot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <h3 
                    className="case-title"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#000000',
                      margin: 0,
                      fontFamily: 'monospace',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {item.title}
                  </h3>
                  <div style={{
                    fontSize: '0.88rem',
                    color: '#52525b',
                    fontWeight: '400',
                    lineHeight: '1.4'
                  }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* OUR PROCESS SECTION (08. OUR PROCESS) */}
      <section id="our-process" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative',
        borderTop: 'none'
      }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
          
          {/* Elegant Centered Header */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <span style={{
              fontSize: '0.8rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              display: 'block',
              marginBottom: '0.6rem'
            }}>
              OUR PROCESS & METHODOLOGY
            </span>
            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.65)',
              margin: '0 auto',
              maxWidth: '620px',
              fontWeight: '300',
              fontFamily: "'Manrope', sans-serif"
            }}>
              A structured creative roadmap turning raw brand vision into high-impact digital products, immersive design, and measurable growth.
            </p>
          </div>

          {/* 100% Exact Methodology UI matching reference image */}
          <div 
            className="process-card-container"
            style={{
              backgroundColor: '#fafaf9',
              borderRadius: '24px',
              padding: '6rem 2rem',
              color: '#1a1a1a',
              marginTop: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4.5rem',
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
                maxWidth: '1200px'
              }}
            >
              {[
                { num: '01', line1: 'Product :', line2: 'Problem and task.' },
                { num: '02', line1: 'Research', line2: '& Discovery.' },
                { num: '03', line1: 'UX Strategy.', line2: '' },
                { num: '04', line1: 'UI Design.', line2: '' },
                { num: '05', line1: 'MVP.', line2: '' }
              ].map((step, idx) => {
                return (
                  <div 
                    key={step.num}
                    className="process-step-col"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '1.25rem 1rem',
                      position: 'relative',
                      borderRight: idx < 4 ? '1px solid #d4d4d8' : 'none',
                      minHeight: '140px',
                      justifyContent: 'flex-start',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <span 
                      className="method-num"
                      style={{
                        fontSize: 'clamp(3.2rem, 5vw, 4.8rem)',
                        fontWeight: '600',
                        color: '#18181b',
                        lineHeight: '1',
                        marginBottom: '1.2rem',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {step.num}
                    </span>

                    <div 
                      className="method-label"
                      style={{
                        fontSize: '1rem',
                        lineHeight: '1.35',
                        color: '#52525b',
                        fontWeight: '400',
                        maxWidth: '160px'
                      }}
                    >
                      <div>{step.line1}</div>
                      {step.line2 && <div>{step.line2}</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ROW 2: 2 ITEMS CENTERED (06 - 07) */}
            <div 
              className="process-row-bottom"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                maxWidth: '480px',
                width: '100%'
              }}
            >
              {[
                { num: '06', line1: 'Metrics.', line2: '' },
                { num: '07', line1: 'How do I', line2: 'really work?' }
              ].map((step, idx) => {
                return (
                  <div 
                    key={step.num}
                    className="process-step-col"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '1.25rem 1.5rem',
                      position: 'relative',
                      borderRight: idx === 0 ? '1px solid #d4d4d8' : 'none',
                      minHeight: '140px',
                      justifyContent: 'flex-start',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <span 
                      className="method-num"
                      style={{
                        fontSize: 'clamp(3.2rem, 5vw, 4.8rem)',
                        fontWeight: '600',
                        color: '#18181b',
                        lineHeight: '1',
                        marginBottom: '1.2rem',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {step.num}
                    </span>

                    <div 
                      className="method-label"
                      style={{
                        fontSize: '1rem',
                        lineHeight: '1.35',
                        color: '#52525b',
                        fontWeight: '400',
                        maxWidth: '160px'
                      }}
                    >
                      <div>{step.line1}</div>
                      {step.line2 && <div>{step.line2}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="scroll-fade-in" style={{
        width: '100%',
        minHeight: '100vh',
        padding: '10vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative',
        borderTop: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          
          {/* Testimonial Editorial Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '4rem'
          }}>
            {[
              {
                num: '01',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                quote: '“Rising Media Works transformed our brand narrative with cinematic direction that doubled our audience engagement within 30 days.”',
                author: 'Alexander Vance',
                role: 'Creative Director',
                company: 'Apex Studio'
              },
              {
                num: '02',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
                quote: '“Their engineering-grade web interfaces and 3D motion artwork command absolute authority. The single highest standard in modern production.”',
                author: 'Elena Rostova',
                role: 'Managing Director',
                company: 'Lumina Capital'
              },
              {
                num: '03',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                quote: '“From storyboards to final master color grading, working with Rising Media Works was flawless execution. They deliver true luxury aesthetics.”',
                author: 'Marcus Thorne',
                role: 'Chief Executive Officer',
                company: 'Thorne & Co.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="t-editorial-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '2.8rem',
                  paddingBottom: '3rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  playHoverSound();
                  const num = e.currentTarget.querySelector('.t-num');
                  if (num) num.style.color = '#0052ff';
                  const img = e.currentTarget.querySelector('.t-img');
                  if (img) {
                    img.style.filter = 'grayscale(0%) contrast(1)';
                    img.style.borderColor = '#0052ff';
                  }
                  const quote = e.currentTarget.querySelector('.t-quote');
                  if (quote) quote.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  const num = e.currentTarget.querySelector('.t-num');
                  if (num) num.style.color = 'rgba(255, 255, 255, 0.4)';
                  const img = e.currentTarget.querySelector('.t-img');
                  if (img) {
                    img.style.filter = 'grayscale(100%) contrast(1.15) brightness(0.95)';
                    img.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }
                  const quote = e.currentTarget.querySelector('.t-quote');
                  if (quote) quote.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                {/* Header Row: B&W Portrait & Index Number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={item.avatar} 
                      alt={item.author}
                      className="t-img"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        filter: 'grayscale(100%) contrast(1.15) brightness(0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: '#ffffff', margin: '0 0 0.2rem 0', fontFamily: 'sans-serif' }}>
                        {item.author}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', margin: 0, fontFamily: 'sans-serif', fontWeight: '300' }}>
                        {item.role} — <span style={{ color: 'rgba(255, 255, 255, 0.75)' }}>{item.company}</span>
                      </p>
                    </div>
                  </div>

                  <span className="t-num" style={{
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    color: 'rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.1em',
                    transition: 'color 0.4s'
                  }}>
                    {item.num}
                  </span>
                </div>

                {/* Main Quote Content */}
                <p className="t-quote" style={{
                  fontSize: '1.2rem',
                  lineHeight: '1.7',
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  transition: 'color 0.4s ease'
                }}>
                  {item.quote}
                </p>

                {/* Rating Footer Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem'
                }}>
                  <div style={{ color: '#ffc107', fontSize: '0.85rem', letterSpacing: '3px', textShadow: '0 0 12px rgba(255, 193, 7, 0.6)' }}>
                    ★★★★★
                  </div>
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
                    VERIFIED CLIENT
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA SECTION (11. FINAL CTA SECTION) */}
      <section id="cta-section" className="scroll-fade-in" style={{
        width: '100%',
        minHeight: '100vh',
        padding: '12vh 6vw 6vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'sans-serif',
        position: 'relative',
        borderTop: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        {/* Soft Ambient Radial Electric Blue Aura (Behind CTA Text) */}
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(0, 82, 255, 0.14) 0%, rgba(0, 82, 255, 0.04) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <div style={{ maxWidth: '1400px', width: '100%', margin: 'auto 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          
          <span style={{
            fontSize: '0.78rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#0052ff',
            fontWeight: '700',
            fontFamily: 'monospace',
            display: 'block',
            marginBottom: '1.5rem'
          }}>
            READY WHEN YOU ARE
          </span>

          {/* Main Giant Kinetic Editorial Statement */}
          <h2 style={{
            fontSize: 'calc(2.6rem + 3vw)',
            fontWeight: '800',
            fontFamily: "'Manrope', sans-serif",
            textTransform: 'uppercase',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 2rem 0'
          }}>
            Build Something <br />
            <span style={{ color: '#ffffff' }}>
              Worth Remembering.
            </span>
          </h2>

          {/* Subtitle Paragraph */}
          <p style={{
            maxWidth: '680px',
            margin: '0 auto 3.5rem auto',
            fontSize: '1.05rem',
            lineHeight: '1.75',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '300',
            fontFamily: "'Manrope', sans-serif"
          }}>
            Partner with Rising Media Works for strategic creative, powerful storytelling, and digital experiences designed around your brand.
          </p>

          {/* Magnetic CTA Action Buttons */}
          <div className="cta-buttons-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '1.8rem', flexWrap: 'wrap' }}>
            <Link 
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.2rem',
                padding: '1.35rem 3.5rem',
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '0.95rem',
                fontWeight: '600',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 10px 40px rgba(255, 255, 255, 0.15)'
              }}
              onMouseEnter={(e) => {
                playHoverSound();
                e.currentTarget.style.backgroundColor = '#0052ff';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(0, 82, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 255, 255, 0.15)';
              }}
              onClick={(e) => triggerLaunch(e, '/contact')}
            >
              Start A Project →
            </Link>

            <Link 
              to="/work"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.35rem 3rem',
                borderRadius: '50px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: '500',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                playHoverSound();
                e.currentTarget.style.borderColor = '#0052ff';
                e.currentTarget.style.color = '#0052ff';
                e.currentTarget.style.backgroundColor = 'rgba(0, 82, 255, 0.08)';
                e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Explore Our Works ↗
            </Link>
          </div>

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

      {/* Main Page Footer */}
      <Footer />
    </div>
  );
};

export default Home;
