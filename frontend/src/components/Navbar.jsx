import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { totalItems, setShowCart } = useCart();

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
                <Link to="/" style={{ textDecoration: 'none', marginRight: 8, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="40" rx="10" fill="#1a1a1a"/>
                        <path d="M10 12h4l3 8 5-12 4 12 3-8h3" stroke="#4ecdc4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="30" cy="28" r="4" fill="#4ecdc4"/>
                        <path d="M30 26v4M28 28h4" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px' }}>Snap<span style={{ color: '#4ecdc4' }}>Order</span></span>
                </Link>

                {/* Search */}
                <div style={{
                    flex: 1, maxWidth: 400,
                    display: 'flex', alignItems: 'center',
                    background: '#f7f7f7', border: '1px solid #ebebeb',
                    borderRadius: 8, padding: '0 12px', height: 36, gap: 8,
                }} className="search-wrap">
                    <span style={{ fontSize: 13, color: '#aaa' }}>🔍</span>
                    <input
                        placeholder="What are you looking for?"
                        style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#333', outline: 'none', flex: 1, fontFamily: 'inherit' }}
                    />
                </div>

                {/* Right icons */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 4 }}>
                        🛒
                        {totalItems > 0 && (
                            <span style={{ position: 'absolute', top: -4, right: -6, background: '#ff6b6b', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 4 }}>♡</button>

                    {/* Hamburger */}
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

            {/* Mobile dropdown */}
            <div style={{
                maxHeight: menuOpen ? 200 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
                borderTop: menuOpen ? '1px solid #f0f0f0' : 'none',
                background: '#fff',
            }} className="mobile-menu">
                <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f7f7f7', border: '1px solid #ebebeb', borderRadius: 8, padding: '0 12px', height: 36, gap: 8 }}>
                        <span style={{ fontSize: 13, color: '#aaa' }}>🔍</span>
                        <input placeholder="Search products..." style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#333', outline: 'none', flex: 1, fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 16, paddingTop: 4 }}>
                        {['Products', 'About', 'Contact'].map(l => (
                            <span key={l} style={{ fontSize: 13, color: '#666', cursor: 'pointer', fontWeight: 500 }}>{l}</span>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .search-wrap { display: none !important; }
                    .hamburger-btn { display: flex !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
