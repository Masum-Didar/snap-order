import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 999,
            background: '#fff',
            borderBottom: `1px solid ${scrolled ? '#ddd' : '#ebebeb'}`,
            boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.07)' : 'none',
            transition: 'box-shadow 0.2s, border-color 0.2s',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>

                {/* Logo */}
                <Link to="/" style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none', letterSpacing: '-0.5px', marginRight: 8, flexShrink: 0 }}>
                    Q<span style={{ color: '#4ecdc4' }}>C</span>
                </Link>

                {/* Search — hidden on mobile */}
                <div style={{
                    flex: 1, maxWidth: 400,
                    display: 'flex', alignItems: 'center',
                    background: '#f7f7f7', border: '1px solid #ebebeb',
                    borderRadius: 8, padding: '0 12px', height: 36, gap: 8,
                    // hide on mobile via inline is tricky; we use a wrapper
                }} className="search-wrap">
                    <span style={{ fontSize: 13, color: '#aaa' }}>🔍</span>
                    <input
                        placeholder="What are you looking for?"
                        style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#333', outline: 'none', flex: 1, fontFamily: 'inherit' }}
                    />
                </div>

                {/* Right icons */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 4 }}>
                        🛒
                        <span style={{ position: 'absolute', top: -2, right: -2, background: '#4ecdc4', color: '#fff', fontSize: 9, fontWeight: 700, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 4 }}>♡</button>

                    {/* Admin link — desktop */}
                    <Link to="/admin/login" style={{ fontSize: 12, fontWeight: 600, color: '#555', textDecoration: 'none', background: '#f4f4f4', padding: '6px 12px', borderRadius: 7, border: '1px solid #ebebeb' }}
                          className="admin-link-desktop">
                        Admin
                    </Link>

                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="hamburger-btn"
                        style={{ background: 'none', border: '1px solid #ebebeb', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', display: 'none', flexDirection: 'column', gap: 4 }}>
                        <span style={{ display: 'block', width: 18, height: 2, background: '#1a1a1a', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
                        <span style={{ display: 'block', width: 18, height: 2, background: '#1a1a1a', borderRadius: 2, opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
                        <span style={{ display: 'block', width: 18, height: 2, background: '#1a1a1a', borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            <div style={{
                maxHeight: menuOpen ? 200 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
                borderTop: menuOpen ? '1px solid #f0f0f0' : 'none',
                background: '#fff',
            }} className="mobile-menu">
                <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Mobile search */}
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f7f7f7', border: '1px solid #ebebeb', borderRadius: 8, padding: '0 12px', height: 36, gap: 8 }}>
                        <span style={{ fontSize: 13, color: '#aaa' }}>🔍</span>
                        <input placeholder="Search products..." style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#333', outline: 'none', flex: 1, fontFamily: 'inherit' }} />
                    </div>
                    <Link to="/admin/login" onClick={() => setMenuOpen(false)}
                          style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                        Admin Panel →
                    </Link>
                    <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
                        {['Products', 'About', 'Contact'].map(l => (
                            <span key={l} style={{ fontSize: 13, color: '#666', cursor: 'pointer', fontWeight: 500 }}>{l}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Responsive CSS */}
            <style>{`
        @media (max-width: 640px) {
          .search-wrap { display: none !important; }
          .admin-link-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;