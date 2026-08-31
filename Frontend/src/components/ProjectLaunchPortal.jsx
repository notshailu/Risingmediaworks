import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const ProjectLaunchContext = createContext();

export const useProjectLaunch = () => useContext(ProjectLaunchContext);

export const ProjectLaunchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [clickPos, setClickPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [counter, setCounter] = useState(0);
  const overlayRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  const triggerLaunch = (e, targetPath = '/contact') => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      const x = e.clientX || window.innerWidth / 2;
      const y = e.clientY || window.innerHeight / 2;
      setClickPos({ x, y });
    } else {
      setClickPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }

    setIsActive(true);
    setCounter(0);

    // Audio chime synthesis
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      }
    } catch (err) {
      // Audio fallback
    }

    // Counter animation 0 to 100
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 8;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
      }
      setCounter(current);
    }, 45);

    // GSAP Portal Burst Animation
    requestAnimationFrame(() => {
      if (circleRef.current && overlayRef.current && textRef.current) {
        const maxRadius = Math.max(
          Math.hypot(clickPos.x, clickPos.y),
          Math.hypot(window.innerWidth - clickPos.x, clickPos.y),
          Math.hypot(clickPos.x, window.innerHeight - clickPos.y),
          Math.hypot(window.innerWidth - clickPos.x, window.innerHeight - clickPos.y)
        ) * 2.5;

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
                }
              });
            }, 250);
          }
        });

        // Reset
        gsap.set(overlayRef.current, { opacity: 1, display: 'flex' });
        gsap.set(circleRef.current, {
          width: 20,
          height: 20,
          left: clickPos.x - 10,
          top: clickPos.y - 10,
          scale: 1,
          opacity: 1
        });
        gsap.set(textRef.current, { opacity: 0, y: 30, scale: 0.9 });

        // Sequence
        tl.to(circleRef.current, {
          scale: maxRadius / 10,
          duration: 0.7,
          ease: 'power4.inOut'
        })
        .to(textRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out'
        }, '-=0.4')
        .to('.portal-tag', {
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: 0.35,
          ease: 'back.out(1.7)'
        }, '-=0.2');
      }
    });
  };

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
          {/* Shockwave Radial Energy Portal Expansion Circle */}
          <div
            ref={circleRef}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: '#000000',
              background: 'radial-gradient(circle at center, #0052ff 0%, #000000 70%)',
              boxShadow: '0 0 100px #0052ff',
              pointerEvents: 'none',
              transformOrigin: 'center center'
            }}
          />

          {/* Floating Kinetic Particles */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none'
          }}>
            {['[ VIDEO PRODUCTION ]', '[ BRANDING ]', '[ MOTION GRAPHICS ]', '[ WEB ARCHITECTURE ]'].map((tag, idx) => (
              <span
                key={idx}
                className="portal-tag"
                style={{
                  position: 'absolute',
                  fontSize: '0.75rem',
                  fontFamily: "'Valley Sans', 'Manrope', sans-serif",
                  fontWeight: '700',
                  letterSpacing: '0.25em',
                  color: 'rgba(255, 255, 255, 0.4)',
                  opacity: 0,
                  transform: `rotate(${(idx - 1.5) * 25}deg) translateY(${-140 - idx * 20}px)`
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Center Matrix Status Display */}
          <div
            ref={textRef}
            style={{
              position: 'relative',
              zIndex: 3,
              textAlign: 'center',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '600px',
              padding: '0 2rem'
            }}
          >
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#0052ff',
              fontWeight: '800',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '0.5rem 1.4rem',
              borderRadius: '50px',
              boxShadow: '0 0 30px rgba(0, 82, 255, 0.6)'
            }}>
              INITIALIZING INQUIRY PORTAL ⚡
            </span>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: '300',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              margin: 0,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              lineHeight: '1'
            }}>
              START YOUR VISION
            </h2>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#0052ff',
                boxShadow: '0 0 15px #0052ff',
                animation: 'pulseGlow 0.8s infinite alternate'
              }} />
              <span>{counter}%</span>
            </div>
          </div>
        </div>
      )}
    </ProjectLaunchContext.Provider>
  );
};
