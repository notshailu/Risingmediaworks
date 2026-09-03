import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const floatingImageRef = useRef(null);

  // State for interactive sections
  const [activeCapability, setActiveCapability] = useState(0);

  // Swapping awards state & checkers
  const [positions, setPositions] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllAwards, setShowAllAwards] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const interval = setInterval(() => {
      setPositions((prev) => {
        // Shift cyclically: index i moves to slot (prev[i] + 2) % 10
        // Award 0 goes: 0 -> 2 -> 4 -> 6 -> 8 -> 0
        return prev.map((slotIdx) => (slotIdx + 2) % 10);
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const awardsData = [
    { id: 0, title: <>Addawards <br /> 2023</>, desc: <>1st place in the competition <br /> "Space", "Garden Ring"</> },
    { id: 1, title: <>Best Office <br /> Awards 2023 <br /> Office Next</>, desc: <>1st place in the nomination <br /> "Developers' Sales Office"</> },
    { id: 2, title: <>Beautiful Homes <br /> Press Fireplace <br /> Design 2024</>, desc: <>1st place in the nomination <br /> "Modern fireplace" — Pevchee</> },
    { id: 3, title: <>Interia Public <br /> Space Award <br /> 2024</>, desc: <>Top 100 best public spaces in <br /> Russia 2024 — Restaurant "Krasa" <br /> in Nizhny Novgorod</> },
    { id: 4, title: <>MosBuild <br /> Architecture & <br /> Design Award <br /> (MADA) 2025</>, desc: <>Finalist in the nomination "Public interiors <br /> HoReCa" — Restaurant "Krasa"</> },
    { id: 5, title: <>Kukha Design <br /> Award 2025</>, desc: <>1st place in the category "Public <br /> Building Architecture" — Riverside</> },
    { id: 6, title: <>Interia Public <br /> Space Award <br /> 2023</>, desc: <>1st place in the nomination "HoReCa" <br /> — Restaurant "Pevchee" in Nizhny Novgorod</> },
    { id: 7, title: <>MosBuild Design <br /> Award 2024</>, desc: <>Nominee in the category "Residential <br /> Building Architecture" — Modern Mansion</> },
    { id: 8, title: <>Beautiful Homes <br /> Design 2025</>, desc: <>Best Interior Concept nomination <br /> — The Glass Pavilion</> },
    { id: 9, title: <>ArchDaily <br /> Building of <br /> The Year 2026</>, desc: <>Nominated for Public Architecture <br /> — Media Library Center</> }
  ];

  const slots = [
    { left: '0%', top: '260px' },    // Slot 0 (Col 1)
    { left: '0%', top: '780px' },    // Slot 1 (Col 1)
    { left: '26%', top: '0px' },     // Slot 2 (Col 2 top)
    { left: '26%', top: '500px' },   // Slot 3 (Col 2 mid)
    { left: '26%', top: '980px' },   // Slot 4 (Col 2 bottom)
    { left: '52%', top: '320px' },   // Slot 5 (Col 3 top)
    { left: '52%', top: '820px' },   // Slot 6 (Col 3 bottom)
    { left: '78%', top: '40px' },    // Slot 7 (Col 4 top)
    { left: '78%', top: '550px' },   // Slot 8 (Col 4 mid)
    { left: '78%', top: '1050px' }   // Slot 9 (Col 4 bottom)
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('light-theme');
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  useGSAP(() => {

    // Entrance Animations
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.award-card', {
      opacity: 0,
      y: 40,
      stagger: 0.08,
      duration: 1.2,
      delay: 0.15
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
          });
          observer.unobserve(entry.target);
        }
      });
    };


    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const animElements = document.querySelectorAll('.scroll-reveal');
    animElements.forEach(el => {
      gsap.set(el, { opacity: 0, y: 40 });
      observer.observe(el);
    });

    // Pin and Parallax drift scroll timeline for interstitial typography section
    const typoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.interstitial-typo-section',
        start: 'top top',
        end: isMobile ? '+=300' : '+=450',
        pin: !isMobile,
        scrub: 0.2
      }
    });

    typoTl.fromTo('.typo-eyebrow',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: 1 }
    )
    .fromTo('.typo-bg-text', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: 1 }, 
      "-=0.3" // Overlap animations for continuous flow
    )
    .fromTo('.typo-fg-text', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: 1 }, 
      "-=0.3" // Overlap animations for continuous flow
    );

    // Cinematic Our Story Pinned Scroll
    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.cinematic-story-wrapper',
        start: 'top top',
        end: isMobile ? '+=900' : '+=1500',
        pin: true,
        scrub: 0.3
      }
    });
    
    const storyItems = gsap.utils.toArray('.cinematic-story-item');
    
    storyItems.forEach((item, i) => {
      // If it's not the first item, fade it in
      if (i !== 0) {
        storyTl.fromTo(item, 
          { opacity: 0, scale: 0.9, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power2.out' },
          "-=0.5" // crossfade with previous
        );
      }
      
      // If it's not the last item, fade it out
      if (i !== storyItems.length - 1) {
        // Hold for a moment, then fade out
        storyTl.to(item, { opacity: 0, scale: 1.1, y: -40, duration: 1, ease: 'power2.in' }, "+=1.5");
      }
    });
    
    // Progress bar fill (sync with entire timeline)
    storyTl.fromTo('.cinematic-progress-fill', 
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', duration: storyTl.duration() },
      0
    );

    // Continuous drift floating animation for award cards
    gsap.utils.toArray('.award-card').forEach((card, idx) => {
      gsap.to(card, {
        x: 'random(-25, 25)',
        y: 'random(-35, 35)',
        duration: 'random(7, 12)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        repeatRefresh: true,
        delay: idx * 0.4
      });
    });

    // Mouse ambient glow follow effect
    const handleMouseMove = (e) => {
      if (!glowRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(glowRef.current, {
        x: x,
        y: y,
        duration: 1.6,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, { scope: containerRef });

  const [hoveredPhilosophy, setHoveredPhilosophy] = useState(null);

  const handlePhilosophyMouseMove = (e) => {
    if (floatingImageRef.current) {
      gsap.to(floatingImageRef.current, {
        x: e.clientX + 20,
        y: e.clientY - 90,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  const storyMilestones = [
    {
      num: '01',
      title: 'The Beginning',
      description: 'Founded with a core belief that digital architecture and visual media should connect on a deeper human level. We set out to disrupt the standard agency templates.'
    },
    {
      num: '02',
      title: 'The Growth',
      description: 'Expanded our operations, merging strategy, high-end editorial layouts, and cutting-edge frontend engineering into a unified creative powerhouse.'
    },
    {
      num: '03',
      title: 'Today',
      description: 'Delivering world-class products, print publications, and digital landmarks for ambitious clients worldwide from our base of operations.'
    },
    {
      num: '04',
      title: "What's Next",
      description: 'Pioneering next-generation design systems and immersive visual storytelling platforms to shape the future of brand communication.'
    }
  ];

  const philosophyPrinciples = [
    {
      num: '01',
      title: 'Think Deeper',
      description: 'We believe strategy must always precede execution. We dive deep into the brand DNA and target audience dynamics before pushing a single pixel.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop'
    },
    {
      num: '02',
      title: 'Create With Purpose',
      description: 'Every layout parameter, typographic scale, and structural alignment must serve a logical goal. Decorative elements without reason are omitted.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop'
    },
    {
      num: '03',
      title: 'Stay Human',
      description: 'We construct designs that foster emotional connection. Empathy and visual storytelling are embedded in the code of everything we produce.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop'
    },
    {
      num: '04',
      title: 'Keep Evolving',
      description: 'We constantly challenge our established design frameworks. We experiment, refine, and improve endlessly to deliver bleeding-edge solutions.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop'
    }
  ];

  const capabilities = [
    {
      title: 'Brand Strategy',
      desc: 'Defining brand positioning, tone of voice, and competitive architecture to ensure long-term market authority.'
    },
    {
      title: 'Creative Direction',
      desc: 'Orchestrating visual systems, conceptual storytelling, and overall creative vision for campaigns and products.'
    },
    {
      title: 'Brand Identity',
      desc: 'Designing custom typography, logos, grids, guidelines, and visual languages that stand the test of time.'
    },
    {
      title: 'Web Design & Development',
      desc: 'Building bespoke, fast, responsive digital platforms with smooth interactions, pixel-perfect frontend, and solid architectures.'
    },
    {
      title: 'Digital Experiences',
      desc: 'Designing immersive interactive spaces, custom web apps, and modern interfaces tailored for engagement.'
    },
    {
      title: 'Content & Visual Production',
      desc: 'Creating high-fidelity editorial layouts, digital media, photography direction, and polished design systems.'
    },
    {
      title: 'Marketing & Campaigns',
      desc: 'Deploying strategic messaging, creative media assets, and systematic rollouts to scale brand awareness.'
    }
  ];



  const whyUs = [
    {
      title: 'Strategy Meets Creativity',
      desc: 'We combine rigorous analytical thinking with bold artistic direction to produce work that performs as beautifully as it looks.'
    },
    {
      title: 'Built Around Your Brand',
      desc: 'We don’t use generic templates. Every single layout, framework, and asset is engineered from scratch for your brand identity.'
    },
    {
      title: 'Attention to Detail',
      desc: 'From page margin ratios and typographic kerning to fluid grid systems, we obsess over variables that others leave behind.'
    },
    {
      title: 'Built for What\'s Next',
      desc: 'We avoid transient trends to focus on modern, scalable architectures and timeless designs that remain functional for years.'
    }
  ];

  return (
    <div
      ref={containerRef}
      className="about-hero-container"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '120px 2rem 80px 2rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Subtle Ambient Background Follow Glow */}
      <div 
        ref={glowRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, display: 'block', width: '100%' }}>
        
        <style>{`
          .philosophy-card {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 2.5rem 2rem;
            margin: 0 -2rem;
            border-bottom: 1px solid #e0e0e0;
            gap: 2rem;
            cursor: pointer;
            background-color: transparent;
            transition: background-color 0.3s ease, border-color 0.3s ease;
          }
          .philosophy-card:hover {
            background-color: #0f172a !important;
            border-bottom: 1px solid #0f172a !important;
          }
          .philosophy-card .phil-num {
            font-size: 1.25rem;
            font-weight: 300;
            color: #888888;
            font-family: serif;
            transition: color 0.3s ease;
          }
          .philosophy-card:hover .phil-num {
            color: #aaaaaa !important;
          }
          .philosophy-card .phil-title {
            font-size: 1.75rem;
            font-weight: 300;
            text-transform: uppercase;
            margin: 0;
            font-family: serif;
            color: #000000;
            transition: color 0.3s ease;
          }
          .philosophy-card:hover .phil-title {
            color: #ffffff !important;
          }
          .philosophy-card .phil-desc {
            font-size: 1rem;
            line-height: 1.65;
            color: #555555;
            margin: 0;
            font-weight: 300;
            font-family: serif;
            transition: color 0.3s ease;
          }
          .philosophy-card:hover .phil-desc {
            color: #cccccc !important;
          }
          
          /* RESPONSIVE CSS */
          @media (max-width: 768px) {
            .about-hero-container {
              padding: 90px 1.25rem 40px 1.25rem !important;
            }
            .typo-eyebrow { top: 26% !important; }
            .typo-bg-text { font-size: 16.5vw !important; top: 34% !important; left: 0 !important; }
            .typo-fg-text { font-size: 28vw !important; top: 46% !important; right: 0 !important; }
            
            .cinematic-story-wrapper {
              padding: 2rem 1.25rem !important;
            }
            .story-bg-num {
              font-size: 60vw !important;
              opacity: 0.04 !important;
            }
            .story-chapter-title {
              font-size: 2.2rem !important;
            }
            .story-chapter-desc {
              font-size: 0.95rem !important;
            }
            .cinematic-progress-bar-container, .cinematic-progress-label {
              display: none !important;
            }
            
            .philosophy-card {
              padding: 1.5rem 1rem !important;
              margin: 0 !important;
              gap: 0.75rem !important;
            }
            .philosophy-card > div {
              gap: 0.75rem !important;
              flex-direction: column !important;
            }
            .phil-title { font-size: 1.35rem !important; }
            
            .why-works-wrapper {
              padding: 3rem 1.25rem !important;
            }
            .why-works-title {
              font-size: 2.2rem !important;
            }
            .why-works-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            
            .final-cta-title {
              font-size: 1.8rem !important;
            }
            
            .floating-image-overlay {
              display: none !important;
            }
          }
        `}</style>

        {/* ================= HERO SECTION ================= */}
        <section style={{
          minHeight: isMobile ? 'auto' : '150vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          position: 'relative',
          marginBottom: isMobile ? '3.5rem' : '8rem',
          padding: isMobile ? '0' : '0 6vw',
          boxSizing: 'border-box'
        }}>

          {/* Mobile & Desktop Section Header */}
          <div style={{
            marginBottom: isMobile ? '1.75rem' : '3.5rem',
            textAlign: isMobile ? 'left' : 'center',
            maxWidth: '800px',
            margin: isMobile ? '0 0 1.75rem 0' : '0 auto 3.5rem auto'
          }}>
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#475569',
              fontWeight: '700',
              fontFamily: 'monospace',
              display: 'block',
              marginBottom: '0.65rem'
            }}>
              RECOGNITION & ACCOLADES
            </span>
            <h1 style={{
              fontSize: isMobile ? '2.2rem' : 'calc(2.5rem + 2vw)',
              fontWeight: '300',
              fontFamily: 'serif',
              color: '#000000',
              margin: '0 0 0.85rem 0',
              lineHeight: '1.15',
              letterSpacing: '-0.02em'
            }}>
              Award-Winning Craftsmanship
            </h1>
            <p style={{
              fontSize: isMobile ? '0.92rem' : '1.1rem',
              color: '#64748b',
              fontFamily: 'sans-serif',
              lineHeight: '1.6',
              margin: 0,
              fontWeight: '400'
            }}>
              A curated showcase of industry awards, architectural honors, and design publications.
            </p>
          </div>

          <div style={isMobile ? {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.1rem',
            width: '100%',
            marginTop: '0'
          } : {
            position: 'relative',
            width: '100%',
            height: '1300px',
            marginTop: '2rem'
          }}>
            {(isMobile && !showAllAwards ? awardsData.slice(0, 5) : awardsData).map((award, index) => {
              const currentSlotIdx = positions[index];
              const slot = slots[currentSlotIdx];
              return (
                <div
                  key={award.id}
                  className="award-card"
                  style={isMobile ? {
                    width: '100%',
                    padding: '1.35rem 1.25rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxSizing: 'border-box'
                  } : {
                    position: 'absolute',
                    left: slot.left,
                    top: slot.top,
                    width: '21%',
                    transition: 'left 2.5s cubic-bezier(0.76, 0, 0.24, 1), top 2.5s cubic-bezier(0.76, 0, 0.24, 1)',
                  }}
                >
                  <h3 style={isMobile ? {
                    fontSize: '1.3rem',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    lineHeight: '1.3',
                    color: '#0f172a',
                    margin: '0 0 0.5rem 0',
                    letterSpacing: '-0.01em'
                  } : {
                    fontSize: '1.75rem',
                    fontWeight: '300',
                    fontFamily: 'serif',
                    lineHeight: '1.25',
                    color: '#000000',
                    margin: '0 0 0.75rem 0',
                    letterSpacing: '-0.3px'
                  }}>
                    {award.title}
                  </h3>
                  <p style={{ fontSize: isMobile ? '0.85rem' : '0.85rem', color: '#64748b', fontFamily: 'sans-serif', lineHeight: '1.5', fontWeight: '400', margin: 0 }}>
                    {award.desc}
                  </p>
                </div>
              );
            })}
            
            {isMobile && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
                <button 
                  onClick={() => setShowAllAwards(!showAllAwards)}
                  style={{
                    padding: '0.85rem 2.5rem',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    fontWeight: '700',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)'
                  }}
                >
                  {showAllAwards ? 'Show Less' : 'See All 10 Awards'}
                </button>
              </div>
            )}
          </div>
        </section>


        {/* ================= INTERSTITIAL TYPOGRAPHY SECTION ================= */}
        <section 
          className="interstitial-typo-section"
          style={{ 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: '#000000', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'relative', 
            overflow: 'hidden',
            zIndex: 10,
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)'
          }}
        >
          {/* Eyebrow Label */}
          <span 
            className="typo-eyebrow"
            style={{
              position: 'absolute',
              top: '18%',
              left: 0,
              width: '100%',
              textAlign: 'center',
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#666666',
              fontFamily: 'sans-serif',
              zIndex: 5,
              opacity: 0
            }}
          >
            who we are
          </span>

          {/* Background text (Outlined/Dark Gray) */}
          <div 
            className="typo-bg-text"
            style={{
              fontSize: '17.5vw',
              fontWeight: '800',
              color: '#1a1a1a', // dark gray outline text
              textTransform: 'lowercase',
              fontFamily: "'Manrope', sans-serif",
              whiteSpace: 'nowrap',
              lineHeight: '0.9',
              letterSpacing: '-0.06em',
              position: 'absolute',
              top: '20%',
              left: 0,
              width: '100%',
              textAlign: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitTextStroke: '1.5px #333333'
            }}
          >
            rising media
          </div>

          {/* Foreground text (Dark Gray to match) */}
          <div 
            className="typo-fg-text"
            style={{
              fontSize: '25vw',
              fontWeight: '800',
              color: '#1a1a1a', // dark gray to match rising media
              WebkitTextStroke: '1.5px #333333',
              textTransform: 'lowercase',
              fontFamily: "'Manrope', sans-serif",
              whiteSpace: 'nowrap',
              lineHeight: '0.9',
              letterSpacing: '-0.06em',
              position: 'absolute',
              top: '44%',
              left: 0,
              width: '100%',
              textAlign: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 2
            }}
          >
            works
          </div>
        </section>

        {/* ================= OUR STORY (CINEMATIC) ================= */}
        <section 
          className="cinematic-story-wrapper" 
          style={{ 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: '#000000', 
            color: '#ffffff',
            position: 'relative',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            overflow: 'hidden',
            marginBottom: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Subtle Progress Bar */}
          <div className="cinematic-progress-bar-container" style={{ position: 'absolute', left: '4vw', top: '50%', transform: 'translateY(-50%)', width: '2px', height: '40vh', backgroundColor: '#333333', zIndex: 10 }}>
            <div className="cinematic-progress-fill" style={{ width: '100%', height: '100%', backgroundColor: '#ffffff', transformOrigin: 'top', transform: 'scaleY(0)' }} />
          </div>

          {/* Vertical Label */}
          <div className="cinematic-progress-label" style={{ position: 'absolute', left: '6vw', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888888', fontWeight: '600', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'sans-serif' }}>
              Our Story
            </span>
          </div>

          {/* Milestone Items */}
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {storyMilestones.map((milestone, idx) => (
              <div 
                key={idx} 
                className="cinematic-story-item"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: idx === 0 ? 1 : 0, // first one is visible initially
                  pointerEvents: 'none' // allow scroll to pass through
                }}
              >
                {/* Massive Background Number */}
                <div 
                  className="story-bg-num"
                  style={{
                  position: 'absolute',
                  fontSize: '40vw',
                  fontWeight: '900',
                  color: 'rgba(255, 255, 255, 0.03)',
                  lineHeight: 1,
                  fontFamily: 'sans-serif',
                  letterSpacing: '-0.05em',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}>
                  {milestone.num}
                </div>

                {/* Foreground Content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 2rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '300', color: '#888888', fontFamily: 'serif', display: 'block', marginBottom: '1rem' }}>
                    Chapter {milestone.num}
                  </span>
                  <h3 className="story-chapter-title" style={{ fontSize: '4.5rem', fontWeight: '300', textTransform: 'uppercase', margin: '0 0 2rem 0', fontFamily: 'serif', letterSpacing: '0.02em', color: '#ffffff' }}>
                    {milestone.title}
                  </h3>
                  <p className="story-chapter-desc" style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#aaaaaa', margin: '0 auto', fontWeight: '300', fontFamily: 'serif', maxWidth: '600px' }}>
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lower Content Wrapper (Constrained to 1200px) */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'block', padding: '0 2rem', boxSizing: 'border-box' }}>

        {/* ================= OUR PHILOSOPHY / MANIFESTO ================= */}
        <section 
          className="scroll-reveal" 
          onMouseMove={handlePhilosophyMouseMove}
          style={{ display: 'flex', flexDirection: 'column', gap: '4rem', borderTop: 'none', paddingTop: '5rem', position: 'relative', marginBottom: '8rem' }}
        >
          <div style={{ maxWidth: '950px' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#475569', fontWeight: '700', fontFamily: 'monospace', display: 'block', marginBottom: '1.2rem' }}>
              ABOUT RISING MEDIA WORKS
            </span>
            <h2 style={{
              fontSize: 'calc(2.2rem + 1.8vw)',
              fontWeight: '300',
              lineHeight: '1.2',
              textTransform: 'uppercase',
              color: '#000000',
              fontFamily: 'serif',
              margin: 0
            }}>
              Creativity With Direction.<br />
              <span style={{ fontStyle: 'italic', fontSize: 'calc(1.8rem + 1.2vw)', borderBottom: '2px solid #000', paddingBottom: '3px' }}>
                We Believe Good Creative Work Should Do More Than Look Good.
              </span>
            </h2>

            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', margin: '1rem 0' }}>
                {['It should communicate.', 'It should create recognition.', 'It should build trust.', 'And help a brand move forward.'].map((pt, i) => (
                  <div key={i} style={{ borderLeft: '2px solid #0f172a', paddingLeft: '1.2rem', fontSize: '1.05rem', fontWeight: '600', color: '#111827', fontFamily: 'sans-serif' }}>
                    {pt}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#4b5563', fontWeight: '300', fontFamily: 'serif', margin: 0 }}>
                At Rising Media Works, we bring together creative thinking, visual design, video production, motion graphics, digital experiences, branding, and publishing to create work with purpose.
              </p>

              <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#4b5563', fontWeight: '300', fontFamily: 'serif', margin: 0 }}>
                Whether we are developing a brand identity, producing a commercial video, designing a website, creating social media content, or designing a book, our focus remains the same: <strong>Create something meaningful, distinctive, and built to last.</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {philosophyPrinciples.map((principle, idx) => (
              <div 
                key={idx} 
                className="philosophy-card"
                onMouseEnter={() => setHoveredPhilosophy(idx)}
                onMouseLeave={() => setHoveredPhilosophy(null)}
              >
                <div style={{ display: 'flex', gap: '3rem', alignItems: 'baseline', flex: '1 1 300px' }}>
                  <span className="phil-num">
                    {principle.num}
                  </span>
                  <h3 className="phil-title">
                    {principle.title}
                  </h3>
                </div>
                <div style={{ flex: '1 1 450px' }}>
                  <p className="phil-desc">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ================= OUR CAPABILITIES ================= */}
        <section className="scroll-reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem 6rem', borderTop: 'none', paddingTop: '5rem', marginBottom: '8rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888888', fontWeight: '600', display: 'block', marginBottom: '0.5rem', fontFamily: 'sans-serif' }}>
              Service Offerings
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '300', textTransform: 'uppercase', fontFamily: 'serif', letterSpacing: '-0.02em', margin: 0, marginBottom: '2rem' }}>
              Our Capabilities
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#666666', fontWeight: '300', fontFamily: 'serif' }}>
              We deploy systematic strategies and creative methodologies to solve complex product identity and layout puzzles.
            </p>
          </div>

          <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {capabilities.map((cap, idx) => {
              const isActive = activeCapability === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveCapability(idx)}
                  style={{
                    padding: '1.5rem 0',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: isActive ? '400' : '300',
                      textTransform: 'uppercase',
                      color: isActive ? '#000000' : '#888888',
                      fontFamily: 'serif',
                      transition: 'color 0.3s ease'
                    }}>
                      {cap.title}
                    </h3>
                    <span style={{
                      fontSize: '1.25rem',
                      color: isActive ? '#000000' : '#cccccc',
                      transition: 'all 0.3s ease',
                      transform: isActive ? 'rotate(90deg)' : 'none'
                    }}>→</span>
                  </div>
                  
                  {/* Expanded block description */}
                  <div style={{
                    maxHeight: isActive ? '100px' : '0px',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    marginTop: isActive ? '1rem' : '0'
                  }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#555555', margin: 0, fontWeight: '300', fontFamily: 'serif' }}>
                      {cap.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>



        </div> {/* Close the 1200px wrapper */}

        {/* ================= WHY RISING MEDIA WORKS (FULL SCREEN) ================= */}
        <section 
          className="scroll-reveal why-works-wrapper" 
          style={{ 
            width: '100vw', 
            minHeight: '100vh', 
            backgroundColor: '#000000', 
            color: '#ffffff',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: '6rem 6vw',
            boxSizing: 'border-box',
            position: 'relative',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginBottom: '8rem'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ marginBottom: '6rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888888', fontWeight: '600', display: 'block', marginBottom: '1rem', fontFamily: 'sans-serif' }}>
                Value Proposition
              </span>
              <h2 className="why-works-title" style={{ fontSize: '3.5rem', fontWeight: '300', textTransform: 'uppercase', fontFamily: 'serif', letterSpacing: '-0.02em', margin: 0, color: '#ffffff' }}>
                Why Rising Media Works
              </h2>
            </div>

            <div className="why-works-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem 3rem' }}>
              {whyUs.map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '1px solid #333333', paddingLeft: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', textTransform: 'uppercase', margin: 0, fontFamily: 'sans-serif', letterSpacing: '0.05em', color: '#ffffff' }}>
                    {reason.title}
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#aaaaaa', margin: 0, fontWeight: '300', fontFamily: 'serif' }}>
                    {reason.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reopen 1200px wrapper for FINAL CTA */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'block', padding: '0 2rem', boxSizing: 'border-box' }}>

        {/* ================= FINAL CTA ================= */}
        <section className="scroll-reveal" style={{ borderTop: 'none', paddingTop: '6rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
          <h2 className="final-cta-title" style={{
            fontSize: 'calc(1.8rem + 1.8vw)',
            fontWeight: '300',
            textTransform: 'uppercase',
            color: '#000000',
            fontFamily: 'serif',
            margin: 0,
            maxWidth: '800px',
            lineHeight: '1.2'
          }}>
            Let's Create Something <br />
            <span style={{ fontStyle: 'italic', borderBottom: '2px solid #000', paddingBottom: '3px' }}>Worth Remembering.</span>
          </h2>
          
          <p style={{
            fontSize: '1.15rem',
            lineHeight: '1.75',
            color: '#555555',
            fontWeight: '300',
            maxWidth: '600px',
            margin: '0 auto',
            fontFamily: 'serif'
          }}>
            Have an idea, a brand, or a layout challenge? Let's turn it into something meaningful.
          </p>

          <Link to="/contact" style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '1px solid #000000',
            padding: '1.25rem 3rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            fontFamily: 'sans-serif',
            textDecoration: 'none',
            marginTop: '1.5rem',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#000000';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            Start a Conversation →
          </Link>
        </section>
      </div>
    </div>

      {/* Philosophy Floating Image Overlay */}
      <div 
        ref={floatingImageRef}
        className="floating-image-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '180px',
          pointerEvents: 'none',
          zIndex: 1000,
          overflow: 'hidden',
          borderRadius: '4px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          opacity: hoveredPhilosophy !== null ? 1 : 0,
          transform: `scale(${hoveredPhilosophy !== null ? 1 : 0.8})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      >
        {philosophyPrinciples.map((principle, idx) => (
          <img 
            key={idx}
            src={principle.image} 
            alt="" 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              filter: 'grayscale(100%)',
              opacity: hoveredPhilosophy === idx ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default About;
