const fs = require('fs');
const filePath = 'Frontend/src/pages/Home.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const startStr = `      {/* TESTIMONIALS SECTION */}`;
const endStr = `      {/* CTA SECTION (11. FINAL CTA SECTION) */}`;

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      {/* 09 - FOUNDER SECTION */}
      <section id="founder" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Manrope', sans-serif",
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '16px', overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80" alt="Gaurav Sharma, Founder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: '600', color: '#666666' }}>
                09 — FOUNDER
              </span>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4vw, 4rem)', fontWeight: '300', textTransform: 'uppercase', margin: '1rem 0 0 0', lineHeight: '1.1', color: '#000000' }}>
                BUILT BY PEOPLE<br />WHO UNDERSTAND BRANDS.
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1.1rem', lineHeight: '1.6', color: '#555555', fontWeight: '300' }}>
              <p style={{ margin: 0 }}><strong>I'm Gaurav Sharma, founder of Rising Media Works.</strong></p>
              <p style={{ margin: 0 }}>We started Rising Media Works with a simple idea — businesses shouldn't have to look ordinary just because they're growing.</p>
              <p style={{ margin: 0 }}>We work with businesses, creators and brands to turn ideas into strong visual identities, meaningful content and experiences people remember.</p>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', marginTop: '1rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 0.3rem 0', color: '#000000' }}>Gaurav Sharma</h4>
              <p style={{ fontSize: '0.9rem', color: '#666666', margin: '0 0 2rem 0', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Founder, Rising Media Works</p>
              
              <Link to="/contact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1rem 2.5rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                borderRadius: '50px',
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.35s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0052ff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000000'; e.currentTarget.style.transform = 'none'; }}
              >
                WORK WITH US →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10 - TESTIMONIALS SECTION */}
      <section id="testimonials" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: "'Manrope', sans-serif"
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '6vh', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>
              10 — TESTIMONIALS
            </span>
            <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', fontWeight: '300', textTransform: 'uppercase', margin: '1rem 0', lineHeight: '1.1' }}>
              DON'T JUST TAKE OUR WORD FOR IT.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', fontWeight: '300' }}>
              Real words from the people we've worked with.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ borderLeft: '2px solid #0052ff', paddingLeft: '2rem' }}>
                <p style={{ fontSize: '1.3rem', lineHeight: '1.6', fontFamily: 'serif', fontStyle: 'italic', marginBottom: '2rem' }}>
                  “[CLIENT TESTIMONIAL]”
                </p>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.3rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>— Client Name</h4>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Company / Brand</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 - PROCESS SECTION */}
      <section id="process" className="scroll-fade-in" style={{
        width: '100%',
        padding: '12vh 6vw',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: "'Manrope', sans-serif"
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '8vh' }}>
            <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: '600', color: '#666666' }}>
              11 — PROCESS
            </span>
            <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', fontWeight: '300', textTransform: 'uppercase', margin: '1rem 0 0 0', lineHeight: '1.1', maxWidth: '800px' }}>
              FROM FIRST CONVERSATION<br />TO FINAL DELIVERY.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {[
              { num: '01', title: 'DISCOVER', desc: "Tell us about your business, your idea and what you're trying to achieve." },
              { num: '02', title: 'DEFINE', desc: "We understand the direction, audience, requirements and creative approach." },
              { num: '03', title: 'CREATE', desc: "Our team brings the idea to life through design, content, film or digital." },
              { num: '04', title: 'DELIVER', desc: "You get the final work, ready to launch and use." }
            ].map((step) => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '200', color: '#e5e7eb', lineHeight: '1' }}>{step.num}</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: 0, letterSpacing: '0.05em' }}>— {step.title}</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555555', margin: 0, fontWeight: '300' }}>{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

`;
  
  const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync(filePath, newCode);
  console.log('Successfully updated founder, testimonials, and process sections.');
} else {
  console.log('Could not find start or end index.', { startIndex, endIndex });
}
