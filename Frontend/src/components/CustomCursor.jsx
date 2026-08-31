import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Quick setters for performance
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setRingX = gsap.quickSetter(ring, 'x', 'px');
    const setRingY = gsap.quickSetter(ring, 'y', 'px');

    const handleMouseMove = (e) => {
      // Show cursor components once mouse has moved
      if (!hasMoved) {
        setHasMoved(true);
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      }

      // Small dot follows immediately
      setDotX(e.clientX);
      setDotY(e.clientY);

      // Large ring lags behind smoothly
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: 'power2.out'
      });
    };

    const handleMouseEnterLink = () => {
      gsap.to(ring, {
        scale: 1.8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: '#ffffff',
        duration: 0.3
      });
      gsap.to(dot, {
        scale: 0.5,
        backgroundColor: '#ffffff',
        duration: 0.3
      });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        duration: 0.3
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: '#ffffff',
        duration: 0.3
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Attach listeners to interactive elements
    const addLinkHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
      });
    };

    addLinkHoverListeners();

    // Create a MutationObserver to observe dynamic route changes/updates and re-attach hover listeners
    const observer = new MutationObserver(() => {
      addLinkHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnterLink);
        el.removeEventListener('mouseleave', handleMouseLeaveLink);
      });
    };
  }, [hasMoved]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: -4,
          left: -4,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          mixBlendMode: 'difference',
          opacity: 0
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          top: -20,
          left: -20,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          transition: 'border-color 0.3s ease, background-color 0.3s ease',
          mixBlendMode: 'difference',
          opacity: 0
        }}
      />
    </>
  );
};

export default CustomCursor;
