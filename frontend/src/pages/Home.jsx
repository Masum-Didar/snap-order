import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [sort, setSort] = useState('popular');
    const [view, setView] = useState('grid');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { setShowCart, totalItems } = useCart();

    useEffect(() => {
        API.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    }, []);

    const sorted = [...products]
        .filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'low') return a.price - b.price;
            if (sort === 'high') return b.price - a.price;
            return 0;
        });

    const featuredProducts = products.filter(p => p.badge)?.slice(0, 4);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8f9fa', minHeight: '100vh' }}>

            {/* Topbar */}
            <div style={{ background: '#1a1a1a', padding: '7px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                {['Trusted Shipping', 'Easy Returns', 'Secure Shopping'].map(t => (
                    <span key={t} style={{ fontSize: 11, color: '#aaa', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 5, height: 5, background: '#4ecdc4', borderRadius: '50%', display: 'inline-block' }} />
                        {t}
                    </span>
                ))}
            </div>

            <Navbar />

            {/* Hero */}
            <div style={{ position: 'relative', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', height: 'clamp(280px, 45vw, 420px)', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', zIndex: 1 }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <div style={{ width: 280, height: 280, borderRadius: '50%', background: 'rgba(78,205,196,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: 80 }}>🛍️</div>
                    </div>
                </div>
                <div style={{ position: 'relative', zIndex: 3, padding: 'clamp(24px, 4vw, 48px) clamp(20px, 5vw, 60px)', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <span style={{ width: 32, height: 2, background: '#4ecdc4', borderRadius: 2 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#4ecdc4' }}>New Season {new Date().getFullYear()}</span>
                    </div>
                    <div style={{ fontSize: 'clamp(32px, 7vw, 58px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 12 }}>
                        Discover<br /><strong style={{ fontWeight: 800, color: '#4ecdc4' }}>Your Style</strong>
                    </div>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 28, maxWidth: 360, lineHeight: 1.6 }}>Explore our curated collection of premium fashion and accessories</p>
                    <div style={{ display: 'flex', gap: 14 }}>
                        <button onClick={() => document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: '#4ecdc4', color: '#1a1a1a', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 15px rgba(78,205,196,0.4)' }}>
                            Shop Now
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                        <button onClick={() => setShowCart(true)} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)' }}>
                            Cart{totalItems > 0 ? ` (${totalItems})` : ''}
                        </button>
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 40, background: 'linear-gradient(to bottom, transparent, #f8f9fa)' }} />
            </div>

            {/* Featured / Banner Strip */}
            {featuredProducts.length > 0 && (
                <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, overflowX: 'auto', paddingBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>Featured:</span>
                            {featuredProducts.map(p => (
                                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8f9fa', padding: '8px 14px', borderRadius: 10, whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => window.location.href = `/product/${p._id}`}>
                                    <img src={p.image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{p.title}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>৳{p.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Filter Toggle */}
            <div className="mobile-filter-bar" style={{ display: 'none', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #ebebeb', gap: 8 }}>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: sidebarOpen ? '#1a1a1a' : '#f4f4f4', color: sidebarOpen ? '#fff' : '#333', border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ☰ {sidebarOpen ? 'Hide Filters' : 'Filters'}
                </button>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                />
                <select value={sort} onChange={e => setSort(e.target.value)}
                        style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', color: '#333', outline: 'none', background: '#fff' }}>
                    <option value="popular">Popular</option>
                    <option value="low">Low → High</option>
                    <option value="high">High → Low</option>
                </select>
            </div>

            {/* Mobile Sidebar Drawer */}
            {sidebarOpen && (
                <div className="mobile-sidebar-drawer" style={{ background: '#fff', borderBottom: '1px solid #ebebeb' }}>
                    <Sidebar />
                </div>
            )}

            {/* Main Content */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                {/* Desktop Sidebar */}
                <div className="desktop-sidebar">
                    <Sidebar />
                </div>

                {/* Product Area */}
                <main className="products-section" style={{ flex: 1, padding: 'clamp(16px, 3vw, 28px)', minWidth: 0 }}>

                    {/* Desktop Toolbar */}
                    <div className="desktop-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: 12, color: '#aaa' }}>Home › <span style={{ color: '#555' }}>All Products</span></div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginTop: 4 }}>{sorted.length} product{sorted.length !== 1 ? 's' : ''} found</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ display: 'flex', border: '1px solid #ebebeb', borderRadius: 8, overflow: 'hidden' }}>
                                {[['⊞', 'grid'], ['☰', 'list']].map(([icon, v]) => (
                                    <button key={v} onClick={() => setView(v)}
                                            style={{ background: view === v ? '#1a1a1a' : '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', color: view === v ? '#fff' : '#aaa', fontSize: 13 }}>
                                        {icon}
                                    </button>
                                ))}
                            </div>
                            <select value={sort} onChange={e => setSort(e.target.value)}
                                    style={{ border: '1px solid #ebebeb', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontFamily: 'inherit', color: '#555', outline: 'none', background: '#fff', cursor: 'pointer' }}>
                                <option value="popular">Sort: Popular</option>
                                <option value="low">Price: Low to High</option>
                                <option value="high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="desktop-search" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '0 16px', gap: 10, maxWidth: 480 }}>
                            <span style={{ fontSize: 14, color: '#aaa' }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search by name, brand, or category..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#333', outline: 'none', flex: 1, padding: '12px 0', fontFamily: 'inherit' }}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#aaa' }}>✕</button>
                            )}
                        </div>
                    </div>

                    {/* Product Grid */}
                    {sorted.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 0', background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                            <p style={{ fontWeight: 700, fontSize: 16, color: '#555', marginBottom: 4 }}>No products found</p>
                            <p style={{ fontSize: 13, color: '#aaa' }}>Try adjusting your search or filters</p>
                            <button onClick={() => { setSearchQuery(''); setSort('popular'); }} style={{ marginTop: 16, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Clear Filters</button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: view === 'list' ? '1fr' : 'repeat(auto-fill, minmax(249px, 1fr))',
                            gap: 20
                        }}>
                            {sorted.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </main>
            </div>

            {/* Footer */}
            <footer style={{ background: '#1a1a1a', color: '#fff', padding: '40px 20px', marginTop: 40 }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                                <rect width="40" height="40" rx="10" fill="#4ecdc4"/>
                                <path d="M10 12h4l3 8 5-12 4 12 3-8h3" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{ fontSize: 16, fontWeight: 800 }}>SnapOrder</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7 }}>Your trusted destination for premium fashion and accessories with cash on delivery nationwide.</p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, color: '#4ecdc4' }}>Quick Links</h4>
                        {['Home', 'Products', 'About', 'Contact'].map(l => (
                            <div key={l} style={{ fontSize: 13, color: '#888', marginBottom: 8, cursor: 'pointer' }}>{l}</div>
                        ))}
                    </div>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, color: '#4ecdc4' }}>Support</h4>
                        {['Help Center', 'Shipping Info', 'Returns', 'Privacy Policy'].map(l => (
                            <div key={l} style={{ fontSize: 13, color: '#888', marginBottom: 8, cursor: 'pointer' }}>{l}</div>
                        ))}
                    </div>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, color: '#4ecdc4' }}>Contact</h4>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>📞 +880 1993627246</p>
                        <p style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>✉️ support@snaporder.com</p>
                        <p style={{ fontSize: 13, color: '#888' }}>📍 Dhaka, Bangladesh</p>
                    </div>
                </div>
                <div style={{ maxWidth: 1200, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: 12, color: '#555' }}>
                    © {new Date().getFullYear()} SnapOrder. All rights reserved.
                </div>
            </footer>

            <style>{`
                @media (max-width: 768px) {
                    .topbar-strip { display: none !important; }
                    .desktop-sidebar { display: none !important; }
                    .mobile-filter-bar { display: flex !important; }
                    .desktop-toolbar { display: none !important; }
                    .desktop-search { display: none !important; }
                    .mobile-sidebar-drawer aside { width: 100% !important; border-right: none !important; border-bottom: 1px solid #ebebeb; }
                }
                @media (min-width: 769px) {
                    .mobile-filter-bar { display: none !important; }
                    .mobile-sidebar-drawer { display: none !important; }
                    .desktop-sidebar { display: block !important; }
                    .desktop-toolbar { display: flex !important; }
                    .desktop-search { display: block !important; }
                }
            `}</style>
        </div>
    );
};

export default Home;
