import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const ProjectLaunchContext = createContext();

export const useProjectLaunch = () => useContext(ProjectLaunchContext);

export const ProjectLaunchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const textRef = useRef(null);
  const animationFrameRef = useRef(null);

  const triggerLaunch = (e, targetPath = '/contact') => {
    if (e && e.preventDefault) e.preventDefault();

    const startX = e ? e.clientX : window.innerWidth / 2;
    const startY = e ? e.clientY : window.innerHeight / 2;

    setIsActive(true);

    // Audio synthesis - deep cinematic sub-bass swell
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        // Sub bass oscillator
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(60, ctx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.8);
        subGain.gain.setValueAtTime(0.3, ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.95);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start();
        subOsc.stop(ctx.currentTime + 0.95);

        // High shimmer frequency
        const chimOsc = ctx.createOscillator();
        const chimGain = ctx.createGain();
        chimOsc.type = 'sine';
        chimOsc.frequency.setValueAtTime(880, ctx.currentTime);
        chimOsc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.6);
        chimGain.gain.setValueAtTime(0.15, ctx.currentTime);
        chimGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
        chimOsc.connect(chimGain);
        chimGain.connect(ctx.destination);
        chimOsc.start();
        chimOsc.stop(ctx.currentTime + 0.65);
      }
    } catch (err) {
      // Audio fallback
    }

    // Particle Explosion Canvas setup
    requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');

      // Create 240 explosive particles radiating from click coordinates
      const particles = [];
      const colors = ['#ffffff', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#ffffff'];

      for (let i = 0; i < 240; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 22 + 4;
        particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          gravity: 0.12
        });
      }

      const renderParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeCount = 0;

        particles.forEach((p) => {
          if (p.alpha > 0) {
            activeCount++;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.alpha -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 20;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0, p.size * p.alpha), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        if (activeCount > 0) {
          animationFrameRef.current = requestAnimationFrame(renderParticles);
        }
      };

      renderParticles();

      // GSAP Panel Slicers & Kinetic Text Reveal Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          navigate(targetPath);
          setTimeout(() => {
            gsap.to(overlayRef.current, {
              opacity: 0,
              duration: 0.6,
              ease: 'power2.inOut',
              onComplete: () => {
                setIsActive(false);
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
              }
            });
          }, 350);
        }
      });

      // Panel Slice Sweep
      tl.to('.panel-slice', {
        scaleY: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power4.inOut'
      })
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out'
      }, '-=0.3')
      .to('.laser-accent-line', {
        scaleX: 1,
        duration: 0.45,
        ease: 'power3.inOut'
      }, '-=0.25');
    });
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <ProjectLaunchContext.Provider value={{ triggerLaunch }}>
      {children}
      {isActive && (
        <div
          ref={overlayRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            pointerEvents: 'all',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Explosive Particle Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 3
            }}
          />

          {/* 4 Architectural Slicing Panels Curtain Reveal */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            zIndex: 1,
            pointerEvents: 'none'
          }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="panel-slice"
                style={{
                  width: '105%',
                  height: '100%',
                  backgroundColor: '#000000',
                  background: 'linear-gradient(180deg, #18181b 0%, #000000 100%)',
                  transformOrigin: i % 2 === 0 ? 'top center' : 'bottom center',
                  transform: 'scaleY(0)',
                  boxShadow: '0 0 50px rgba(255, 255, 255, 0.15)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              />
            ))}
          </div>

          {/* Center High-End Kinetic Typography Overlay */}
          <div
            ref={textRef}
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem',
              maxWidth: '900px',
              padding: '0 2rem',
              opacity: 0,
              transform: 'translateY(40px) scale(0.95)'
            }}
          >
            <span style={{
              fontSize: '0.78rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#000000',
              fontWeight: '800',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              backgroundColor: '#ffffff',
              padding: '0.5rem 1.6rem',
              borderRadius: '50px',
              boxShadow: '0 0 35px rgba(255, 255, 255, 0.6)'
            }}>
              RISING MEDIA WORKS ⚡
            </span>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: '300',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              margin: 0,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              lineHeight: '1.05',
              color: '#ffffff'
            }}>
              LET'S BUILD <br />
              <span style={{ fontWeight: '700', color: '#ffffff' }}>THE FUTURE.</span>
            </h1>

            {/* Glowing Accent Laser Line */}
            <div
              className="laser-accent-line"
              style={{
                width: '180px',
                height: '3px',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 20px #ffffff, 0 0 40px #ffffff',
                borderRadius: '3px',
                marginTop: '0.5rem',
                transform: 'scaleX(0)',
                transformOrigin: 'center center'
              }}
            />
          </div>
        </div>
      )}
    </ProjectLaunchContext.Provider>
  );
};
