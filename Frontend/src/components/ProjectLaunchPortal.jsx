import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const ProjectLaunchContext = createContext();

export const useProjectLaunch = () => useContext(ProjectLaunchContext);

export const ProjectLaunchProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [countNumber, setCountNumber] = useState('3');
  const overlayRef = useRef(null);
  const shutterRef = useRef(null);
  const textContainerRef = useRef(null);

  const triggerLaunch = (e, targetPath = '/contact') => {
    if (e && e.preventDefault) e.preventDefault();

    setIsActive(true);
    setCountNumber('3');

    // Camera Mechanical Shutter Click Audio Synthesis
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        
        // Mechanical click sound (burst white noise)
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();

        // Secondary sub thud
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(150, ctx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
        subGain.gain.setValueAtTime(0.5, ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start();
        subOsc.stop(ctx.currentTime + 0.15);
      }
    } catch (err) {
      // Audio fallback
    }

    // High-speed Countdown Timer sequence (3.. 2.. 1.. GO!)
    setTimeout(() => setCountNumber('2'), 180);
    setTimeout(() => setCountNumber('1'), 360);
    setTimeout(() => setCountNumber('START'), 520);

    // GSAP 3D Camera Shutter & Tunnel Zoom Timeline
    requestAnimationFrame(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          navigate(targetPath);
          setTimeout(() => {
            gsap.to(overlayRef.current, {
              opacity: 0,
              duration: 0.5,
              ease: 'power2.inOut',
              onComplete: () => {
                setIsActive(false);
              }
            });
          }, 200);
        }
      });

      // Reset initial states
      gsap.set('.shutter-blade', { scale: 0, rotation: 0 });
      gsap.set(textContainerRef.current, { scale: 0.5, opacity: 0, rotation: -15 });
      gsap.set('.tunnel-card', { z: -1200, opacity: 0, scale: 0.2 });

      // Step 1: 3D Camera Iris Aperture Blades Spiral Shut
      tl.to('.shutter-blade', {
        scale: 1.5,
        rotation: 45,
        duration: 0.45,
        stagger: 0.04,
        ease: 'power4.inOut'
      })

      // Step 2: Giant Stencil Countdown Explosive Zoom
      .to(textContainerRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.35,
        ease: 'back.out(2)'
      }, '-=0.2')

      // Step 3: Floating 3D Tunnel Cards Rush Past Camera
      .to('.tunnel-card', {
        z: 600,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.in'
      }, '-=0.15')

      // Step 4: Final Flash Whiteout Transition
      .to('.flash-overlay', {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.in'
      }, '-=0.1');
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
            overflow: 'hidden',
            backgroundColor: '#000000',
            perspective: '1000px'
          }}
        >
          {/* White Flash Curtain */}
          <div
            className="flash-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              opacity: 0,
              zIndex: 20,
              pointerEvents: 'none'
            }}
          />

          {/* 8 Camera Aperture Iris Shutter Blades */}
          <div
            ref={shutterRef}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          >
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <div
                key={idx}
                className="shutter-blade"
                style={{
                  position: 'absolute',
                  width: '140vw',
                  height: '140vh',
                  backgroundColor: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transformOrigin: 'center center',
                  clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)',
                  transform: `rotate(${angle}deg)`
                }}
              />
            ))}
          </div>

          {/* 3D Flying Tunnel Project Preview Cards */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            zIndex: 5,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {[
              { title: 'VIDEO PRODUCTION', pos: 'translate3d(-250px, -180px, 0px)' },
              { title: 'BRANDING DESIGN', pos: 'translate3d(250px, -150px, 0px)' },
              { title: 'MOTION GRAPHICS', pos: 'translate3d(-280px, 180px, 0px)' },
              { title: 'WEB ARCHITECTURE', pos: 'translate3d(280px, 160px, 0px)' }
            ].map((card, i) => (
              <div
                key={i}
                className="tunnel-card"
                style={{
                  position: 'absolute',
                  padding: '1.2rem 2.4rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  borderRadius: '12px',
                  fontFamily: "'Valley Sans', 'Manrope', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: '800',
                  letterSpacing: '0.25em',
                  boxShadow: '0 20px 60px rgba(255, 255, 255, 0.4)',
                  transform: card.pos
                }}
              >
                {card.title}
              </div>
            ))}
          </div>

          {/* Center Cinematic Camera Countdown Badge */}
          <div
            ref={textContainerRef}
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <div style={{
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              PROJECT INITIATION
            </div>

            {/* Giant Countdown Number / Text */}
            <div style={{
              fontSize: 'clamp(4rem, 12vw, 9rem)',
              fontWeight: '900',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              lineHeight: '0.9',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textShadow: '0 0 40px rgba(255, 255, 255, 0.8)'
            }}>
              {countNumber}
            </div>

            <div style={{
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#ffffff',
              fontWeight: '700',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              marginTop: '1rem',
              borderBottom: '2px solid #ffffff',
              paddingBottom: '0.3rem'
            }}>
              RISING MEDIA WORKS
            </div>
          </div>
        </div>
      )}
    </ProjectLaunchContext.Provider>
  );
};
