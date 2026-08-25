import { Outlet, Link } from 'react-router-dom';
import React from 'react';

const AdminLayout = () => {
  return (
    <div className="admin-panel" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9', color: '#000', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .admin-panel, .admin-panel * {
          cursor: auto !important;
        }
      `}</style>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#ffffff', padding: '2rem', borderRight: '1px solid #e0e0e0' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#000', letterSpacing: '-0.5px' }}>
          Rising Media Admin
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/admin/books" style={{ color: '#000', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '4px', backgroundColor: '#f0f0f0', fontWeight: '500', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e4e4e4'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
            Books Management
          </Link>
          <Link to="/admin/works" style={{ color: '#000', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '4px', backgroundColor: '#f0f0f0', fontWeight: '500', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e4e4e4'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f0f0f0'}>
            Works Management
          </Link>
          <Link to="/" style={{ color: '#666', textDecoration: 'none', padding: '0.75rem 1rem', borderRadius: '4px', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = '#000'}
            onMouseOut={(e) => e.target.style.color = '#666'}>
            ← Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
