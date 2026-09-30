const fs = require('fs');
const filePath = 'Frontend/src/pages/Home.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Remove the old brand-partners section
const oldStart = `      <section id="brand-partners" style={{`;
const oldEnd = `      {/* SERVICES / AGENCY OVERVIEW SECTION (Modern Editorial UI matching Reference) */}`;

const startIndexOld = code.indexOf(oldStart);
const endIndexOld = code.indexOf(oldEnd);

if (startIndexOld === -1 || endIndexOld === -1) {
  console.log('Could not find old brand-partners section.');
  process.exit(1);
}

code = code.substring(0, startIndexOld) + code.substring(endIndexOld);

// 2. Insert the new brand-partners section before OUR PROCESS
const insertTarget = `      {/* OUR PROCESS SECTION (08. OUR PROCESS) */}`;
const insertIndex = code.indexOf(insertTarget);

if (insertIndex === -1) {
  console.log('Could not find insert target.');
  process.exit(1);
}

const newSection = `      {/* 07 - CLIENTS / LOGOS SECTION */}
      <section id="brand-partners" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative',
        borderTop: 'none',
        borderBottom: 'none'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          
          {/* Header Row */}
          <div className="clients-header" style={{
            marginBottom: '6vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <span style={{
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif"
            }}>
              07 — CLIENTS / LOGOS
            </span>

            <h2 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: '300',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.01em',
              lineHeight: '1.1',
              color: '#ffffff'
            }}>
              BRANDS WE'VE WORKED WITH.
            </h2>

            <p style={{
              fontSize: 'calc(1.05rem + 0.2vw)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '700px',
              fontFamily: 'sans-serif',
              fontWeight: '300',
              marginTop: '1rem'
            }}>
              A selection of businesses, brands and people we've had the opportunity to create with.
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

`;

code = code.substring(0, insertIndex) + newSection + code.substring(insertIndex);

fs.writeFileSync(filePath, code);
console.log('Successfully moved and updated brand partners section.');
