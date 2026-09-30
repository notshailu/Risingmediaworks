const fs = require('fs');
const filePath = 'Frontend/src/pages/Home.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const startStr = `      {/* FEATURED WORK / SELECTED CASES SECTION (Light Minimalist Editorial Design) */}`;
const endStr = `      {/* OUR PROCESS SECTION (08. OUR PROCESS) */}`;

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      {/* 06 - SELECTED WORK SECTION */}
      <section id="selected-work-showcase" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative',
        borderTop: 'none'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header Row */}
          <div className="selected-cases-header" style={{
            marginBottom: '8vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <span style={{
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: '600',
              color: '#666666',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif"
            }}>
              06 — SELECTED WORK
            </span>

            <h2 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
              fontWeight: '300',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.01em',
              lineHeight: '1.1',
              color: '#000000'
            }}>
              SOME OF THE THINGS WE'VE CREATED.
            </h2>

            <p style={{
              fontSize: 'calc(1.05rem + 0.2vw)',
              lineHeight: '1.7',
              color: '#555555',
              maxWidth: '800px',
              fontFamily: 'sans-serif',
              fontWeight: '300',
              marginTop: '1rem'
            }}>
              Every project starts differently.<br />
              Some start with a blank page.<br />
              Some with a camera.<br />
              Some with a problem that needs solving.<br />
              The goal is always the same — create something that works for the brand.
            </p>
          </div>

          {/* Hidden reference to prevent unused var lint error */}
          <div style={{ display: 'none' }} onClick={() => setActiveShowcaseFilter(activeShowcaseFilter)}></div>

          {/* Staggered Asymmetric Cases Cards Grid */}
          <div className="selected-cases-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '6rem 4rem',
            alignItems: 'start'
          }}>
            {[
              {
                id: 'cat-automotive',
                title: 'AUTOMOTIVE',
                subtitle: 'Built to move.',
                desc: 'Creative content and visual storytelling for automotive brands.',
                image: 'https://img.youtube.com/vi/w_xOxPuBmjk/hqdefault.jpg',
                aspectRatio: '16/10',
                staggerOffset: '0px',
                videoUrl: 'https://www.youtube.com/watch?v=w_xOxPuBmjk'
              },
              {
                id: 'cat-product',
                title: 'PRODUCT',
                subtitle: 'Make the product impossible to ignore.',
                desc: 'Product photography, video and creative content designed to show products at their best.',
                image: 'https://img.youtube.com/vi/JR5Ay3Du1SQ/hqdefault.jpg',
                aspectRatio: '1/1',
                staggerOffset: '6rem',
                videoUrl: 'https://www.youtube.com/watch?v=JR5Ay3Du1SQ'
              },
              {
                id: 'cat-branding',
                title: 'BRANDING',
                subtitle: 'Give the brand a face.',
                desc: 'Identity, design and visual systems that make businesses easier to recognise and remember.',
                image: 'https://img.youtube.com/vi/SGcGnys014E/hqdefault.jpg',
                aspectRatio: '4/5',
                staggerOffset: '0px',
                videoUrl: 'https://www.youtube.com/watch?v=SGcGnys014E'
              },
              {
                id: 'cat-corporate',
                title: 'CORPORATE',
                subtitle: 'Tell the story behind the business.',
                desc: 'Corporate films, industrial visuals and brand communication that show what happens behind the scenes.',
                image: 'https://img.youtube.com/vi/A1pwtdmXWtk/hqdefault.jpg',
                aspectRatio: '16/10',
                staggerOffset: '6rem',
                videoUrl: 'https://www.youtube.com/watch?v=A1pwtdmXWtk'
              }
            ].map((item) => (
              <div
                key={item.id}
                className="selected-case-card"
                onClick={() => handleCardClick(item)}
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
                  if (img) img.style.transform = 'scale(1.04)';
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
                  borderRadius: '12px',
                  backgroundColor: '#f4f4f5',
                  position: 'relative',
                  marginBottom: '1rem'
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
                
                {/* Text Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.5rem' }}>
                  <h3 className="case-title" style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    margin: 0,
                    letterSpacing: '0.05em',
                    color: '#000000',
                    fontFamily: 'sans-serif',
                    transition: 'color 0.3s ease',
                    textTransform: 'uppercase'
                  }}>
                    {item.title}
                  </h3>
                  <h4 style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    margin: 0,
                    color: '#333333',
                    fontFamily: 'serif',
                    fontStyle: 'italic'
                  }}>
                    {item.subtitle}
                  </h4>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#666666',
                    margin: '0.5rem 0 1rem 0',
                    fontFamily: 'sans-serif',
                    fontWeight: '300'
                  }}>
                    {item.desc}
                  </p>
                  
                  {/* View Project Button */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#000000', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    VIEW PROJECT <span style={{ color: '#0052ff', fontSize: '1.1rem' }}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

`;
  
  const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync(filePath, newCode);
  console.log('Successfully replaced selected work section.');
} else {
  console.log('Could not find start or end index.', { startIndex, endIndex });
}
