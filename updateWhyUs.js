const fs = require('fs');
const filePath = 'Frontend/src/pages/Home.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const startStr = `      {/* OUR PROCESS SECTION (08. OUR PROCESS) */}`;
const endStr = `      {/* TESTIMONIALS SECTION */}`;

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      {/* 08 - WHY RISING MEDIA WORKS SECTION */}
      <section id="why-rising-media-works" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative',
        borderTop: 'none'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header Row */}
          <div className="why-header" style={{
            marginBottom: '8vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <span style={{
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif"
            }}>
              08 — WHY RISING MEDIA WORKS
            </span>

            <h2 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              fontWeight: '300',
              fontFamily: "'Valley Sans', 'Manrope', sans-serif",
              textTransform: 'uppercase',
              margin: 0,
              letterSpacing: '0.01em',
              lineHeight: '1.1',
              color: '#ffffff'
            }}>
              WHY US?
            </h2>

            <p style={{
              fontSize: 'calc(1.1rem + 0.2vw)',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.75)',
              maxWidth: '600px',
              fontFamily: 'sans-serif',
              fontWeight: '300',
              marginTop: '0.5rem'
            }}>
              Because your brand deserves more than just another post.
            </p>
          </div>

          {/* Grid Layout for Points */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '4rem 3rem'
          }}>
            {[
              {
                id: '01',
                title: 'STRATEGY',
                subtitle: 'Create with a reason.',
                desc: 'We start by understanding what you\\'re trying to achieve before we start creating.'
              },
              {
                id: '02',
                title: 'CREATIVITY',
                subtitle: 'Make people stop and look.',
                desc: 'Ideas should have a purpose — but they should also have personality.'
              },
              {
                id: '03',
                title: 'PRODUCTION',
                subtitle: 'From concept to final frame.',
                desc: 'We bring strategy, design, shooting, editing and motion together under one roof.'
              },
              {
                id: '04',
                title: 'CONSISTENCY',
                subtitle: 'Make every touchpoint feel like your brand.',
                desc: 'From Instagram to your website, every piece of content should feel connected.'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="why-us-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  paddingTop: '2rem',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  playHoverSound();
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  const num = e.currentTarget.querySelector('.why-num');
                  if (num) num.style.color = '#0052ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  const num = e.currentTarget.querySelector('.why-num');
                  if (num) num.style.color = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <div className="why-num" style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontFamily: 'monospace',
                  color: 'rgba(255, 255, 255, 0.3)',
                  transition: 'color 0.3s ease',
                  letterSpacing: '0.1em'
                }}>
                  {item.id}
                </div>
                
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: '700',
                  margin: 0,
                  letterSpacing: '0.05em',
                  color: '#ffffff',
                  fontFamily: 'sans-serif',
                  textTransform: 'uppercase'
                }}>
                  {item.title}
                </h3>
                
                <h4 style={{
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  margin: 0,
                  color: '#dddddd',
                  fontFamily: 'serif',
                  fontStyle: 'italic'
                }}>
                  {item.subtitle}
                </h4>
                
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: 'rgba(255, 255, 255, 0.65)',
                  margin: 0,
                  fontFamily: 'sans-serif',
                  fontWeight: '300'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

`;
  
  const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync(filePath, newCode);
  console.log('Successfully replaced why us section.');
} else {
  console.log('Could not find start or end index.', { startIndex, endIndex });
}
