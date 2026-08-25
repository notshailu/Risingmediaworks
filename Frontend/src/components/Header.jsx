import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  // Close nav when route changes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  // Lock body scroll when nav is open
  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isNavOpen]);

  const navLinkStyle = ({ isActive }) => ({
    color: 'var(--text-color)',
    textDecoration: isActive ? 'underline' : 'none',
    textUnderlineOffset: '6px',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.3s ease'
  });

  const mobileNavLinkStyle = ({ isActive }) => ({
    color: '#ffffff',
    textDecoration: isActive ? 'underline' : 'none',
    textUnderlineOffset: '8px',
    fontSize: '2rem',
    fontWeight: '300',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'serif',
    transition: 'all 0.3s ease',
    display: 'block'
  });

  return (
    <>
      <header className="header" style={{ zIndex: 1000 }}>
        <Link to="/" className="logo" style={{ color: isNavOpen ? '#ffffff' : 'inherit', position: 'relative', zIndex: 1001, pointerEvents: 'auto', transition: 'color 0.3s ease' }}>Rising Media Works</Link>
        
        {/* Desktop Nav */}
        <nav className="nav-links">
          <NavLink to="/work" style={navLinkStyle}>Works</NavLink>
          <NavLink to="/services" style={navLinkStyle}>Services</NavLink>
          <NavLink to="/special-books" style={navLinkStyle}>Books</NavLink>
          <NavLink to="/case-studies" style={navLinkStyle}>Case Studies</NavLink>
          <NavLink to="/about" style={navLinkStyle}>About</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>
        </nav>

        {/* Mobile Nav Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsNavOpen(!isNavOpen)}
          style={{
            position: 'relative',
            zIndex: 1001,
            pointerEvents: 'auto',
            background: 'none',
            border: 'none',
            color: isNavOpen ? '#ffffff' : 'inherit',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'flex-end',
            outline: 'none'
          }}
        >
          <span style={{ display: 'block', width: '30px', height: '2px', backgroundColor: isNavOpen ? '#ffffff' : 'currentColor', transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1), background-color 0.3s ease', transform: isNavOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: isNavOpen ? '#ffffff' : 'currentColor', transition: 'opacity 0.3s ease, background-color 0.3s ease', opacity: isNavOpen ? 0 : 1 }}></span>
          <span style={{ display: 'block', width: '30px', height: '2px', backgroundColor: isNavOpen ? '#ffffff' : 'currentColor', transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1), background-color 0.3s ease', transform: isNavOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
        </button>
      </header>

      {/* Mobile Full Screen Nav Overlay */}
      <div 
        className="mobile-nav-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#0a0a0a',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2.5rem',
          transform: isNavOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: isNavOpen ? 'auto' : 'none'
        }}
      >
        <NavLink to="/work" style={mobileNavLinkStyle}>Works</NavLink>
        <NavLink to="/services" style={mobileNavLinkStyle}>Services</NavLink>
        <NavLink to="/special-books" style={mobileNavLinkStyle}>Books</NavLink>
        <NavLink to="/case-studies" style={mobileNavLinkStyle}>Case Studies</NavLink>
        <NavLink to="/about" style={mobileNavLinkStyle}>About</NavLink>
        <NavLink to="/contact" style={mobileNavLinkStyle}>Contact</NavLink>
      </div>

      <style>{`
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
