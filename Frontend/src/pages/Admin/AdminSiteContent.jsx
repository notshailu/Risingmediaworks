import { useState } from 'react';
import { getSiteContent, resetSiteContent, saveSiteContent } from '../../data/siteContent';

const fields = [
  ['heroLineOne', 'Hero tagline — first line'],
  ['heroLineTwo', 'Hero tagline — highlighted line'],
  ['servicesLineOne', 'Services tagline — first line'],
  ['servicesLineTwo', 'Services tagline — highlighted line'],
  ['showreelLabel', 'Showreel section label'],
  ['selectedWorkLabel', 'Selected Work section label'],
  ['selectedWorkHeading', 'Selected Work heading'],
  ['clientsLabel', 'Clients section label'],
  ['whyLabel', 'Why Rising Media Works section label'],
  ['founderLabel', 'Founder section label'],
  ['testimonialsLabel', 'Testimonials section label'],
  ['processLabel', 'Process section label'],
  ['footerTagline', 'Footer tagline']
];

const AdminSiteContent = () => {
  const [content, setContent] = useState(getSiteContent);
  const [saved, setSaved] = useState(false);
  const update = (key, value) => setContent((current) => ({ ...current, [key]: value }));
  const updateCategory = (key, value) => setContent((current) => ({ ...current, categories: { ...current.categories, [key]: value } }));

  const inputStyle = { width: '100%', padding: '0.8rem 0.9rem', boxSizing: 'border-box', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#0f172a' };
  const labelStyle = { display: 'block', marginBottom: '0.45rem', fontSize: '0.8rem', fontWeight: '700', color: '#334155' };

  return (
    <div className="admin-site-content" style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#0052ff', fontWeight: '800', letterSpacing: '0.12em' }}>SITE CONTENT</span>
        <h1 style={{ margin: '0.45rem 0', fontSize: '2rem' }}>Editable website text</h1>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>Update the homepage tagline, section names, and project category labels here. Changes appear on this browser immediately after saving.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); saveSiteContent(content); setSaved(true); }}>
        <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1.25rem' }}>Headings and taglines</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {fields.map(([key, label]) => <label key={key} style={labelStyle}>{label}<input value={content[key]} onChange={(event) => update(key, event.target.value)} style={inputStyle} /></label>)}
          </div>
        </section>

        <section style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1.25rem' }}>Selected Work category labels</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {Object.entries(content.categories).map(([key, value]) => <label key={key} style={labelStyle}>{key}<input value={value} onChange={(event) => updateCategory(key, event.target.value)} style={inputStyle} /></label>)}
          </div>
        </section>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" style={{ border: 0, background: '#0052ff', color: '#fff', borderRadius: '8px', padding: '0.85rem 1.2rem', fontWeight: '800', cursor: 'pointer' }}>Save changes</button>
          <button type="button" onClick={() => { resetSiteContent(); setContent(getSiteContent()); setSaved(false); }} style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#334155', borderRadius: '8px', padding: '0.85rem 1.2rem', fontWeight: '700', cursor: 'pointer' }}>Restore defaults</button>
          {saved && <span style={{ color: '#15803d', fontWeight: '700', fontSize: '0.9rem' }}>Saved successfully.</span>}
        </div>
      </form>
    </div>
  );
};

export default AdminSiteContent;
