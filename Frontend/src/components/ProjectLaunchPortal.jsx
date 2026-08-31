import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const ProjectLaunchContext = createContext();

export const useProjectLaunch = () => useContext(ProjectLaunchContext);

export const ProjectLaunchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const overlayRef = useRef(null);
  const sheetRef = useRef(null);
  const textRef = useRef(null);

  const triggerLaunch = (e, targetPath = '/contact') => {
    if (e && e.preventDefault) e.preventDefault();

    // Get click target bounds for seamless expanding button effect
    let startRect = { left: window.innerWidth / 2 - 100, top: window.innerHeight / 2 - 25, width: 200, height: 50 };
    if (e && e.currentTarget) {
      startRect = e.currentTarget.getBoundingClientRect();
    } else if (e && e.clientX && e.clientY) {
      startRect = { left: e.clientX - 100, top: e.clientY - 25, width: 200, height: 50 };
    }

    setIsActive(true);

    // Subtle luxury audio feedback (gentle low sine wave tone)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (err) {
      // Audio fallback
    }

    // GSAP Ultra-Clean Button Expansion Animation
    requestAnimationFrame(() => {
      if (!sheetRef.current || !overlayRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          navigate(targetPath);
          setTimeout(() => {
            // Smoothly drop sheet down to reveal contact page underneath
            gsap.to(sheetRef.current, {
              y: '100%',
              duration: 0.6,
              ease: 'power3.inOut',
              onComplete: () => {
                setIsActive(false);
              }
            });
          }, 300);
        }
      });

      // Set initial position matching the clicked button
      gsap.set(overlayRef.current, { opacity: 1, display: 'flex' });
      gsap.set(sheetRef.current, {
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        borderRadius: '50px',
        y: 0,
        opacity: 1
      });
      gsap.set(textRef.current, { opacity: 0, y: 20 });
      gsap.set('.sheet-line', { scaleX: 0 });

      // Step 1: Smoothly morph button into full screen canvas sheet
      tl.to(sheetRef.current, {
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        duration: 0.6,
        ease: 'power4.inOut'
      })

      // Step 2: Minimalist Kinetic Typography Reveal
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out'
      }, '-=0.25')

      // Step 3: Ultra-fine white divider line expand
      .to('.sheet-line', {
        scaleX: 1,
        duration: 0.35,
        ease: 'power2.inOut'
      }, '-=0.2');
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
          {/* Architectural Expanding Sheet */}
          <div
            ref={sheetRef}
            style={{
              position: 'absolute',
              backgroundColor: '#000000',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden'
            }}
          >
            {/* Minimalist Centered Content */}
            <div
              ref={textRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 2rem',
                gap: '1.2rem',
                maxWidth: '800px'
              }}
            >
              <span style={{
                fontSize: '0.72rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: '600',
                fontFamily: "'Valley Sans', 'Manrope', sans-serif"
              }}>
                RISING MEDIA WORKS
              </span>

              <h2 style={{
                fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
                fontWeight: '300',
                fontFamily: "'Valley Sans', 'Manrope', sans-serif",
                margin: 0,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                lineHeight: '1.1',
                color: '#ffffff'
              }}>
                LET'S TALK ABOUT YOUR PROJECT
              </h2>

              <div
                className="sheet-line"
                style={{
                  width: '120px',
                  height: '1.5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '0.5rem',
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </ProjectLaunchContext.Provider>
  );
};
