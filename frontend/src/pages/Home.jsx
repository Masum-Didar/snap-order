import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [sort, setSort] = useState('popular');
    const [view, setView] = useState('grid');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        API.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.log(err));
    }, []);

    const sorted = [...products].sort((a, b) => {
        if (sort === 'low') return a.price - b.price;
        if (sort === 'high') return b.price - a.price;
        return 0;
    });

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f2f2f2', minHeight: '100vh' }}>

            {/* Topbar — hidden on mobile */}
            <div className="topbar-strip" style={{ background: '#1a1a1a', padding: '7px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                {['Trusted Shipping', 'Easy Returns', 'Secure Shopping'].map(t => (
                    <span key={t} style={{ fontSize: 11, color: '#aaa', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 5, height: 5, background: '#4ecdc4', borderRadius: '50%', display: 'inline-block' }} />
                        {t}
                    </span>
                ))}
            </div>

            {/* Sticky Navbar */}
            <Navbar />

            {/* Hero */}
            <div style={{ position: 'relative', background: '#d6d8dc', height: 'clamp(200px, 40vw, 320px)', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 65%)', zIndex: 1 }} />
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '55%', background: '#c8cacd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>👗</div>
                <div style={{ position: 'relative', zIndex: 2, padding: 'clamp(20px, 4vw, 40px) clamp(20px, 4vw, 32px)', color: '#fff' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>New Collection 2025</div>
                    <div style={{ fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 16 }}>
                        Simple<br /><strong style={{ fontWeight: 800 }}>is More</strong>
                    </div>
                    <button style={{ background: '#fff', color: '#1a1a1a', border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Shop Now
                    </button>
                </div>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="mobile-filter-bar" style={{ display: 'none', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #ebebeb', gap: 8 }}>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: sidebarOpen ? '#1a1a1a' : '#f4f4f4', color: sidebarOpen ? '#fff' : '#333', border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    ⚙ {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                </button>
                <select value={sort} onChange={e => setSort(e.target.value)}
                        style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', color: '#333', outline: 'none', background: '#fff' }}>
                    <option value="popular">Sort: Popular</option>
                    <option value="low">Price: Low → High</option>
                    <option value="high">Price: High → Low</option>
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
                <main style={{ flex: 1, padding: 'clamp(16px, 3vw, 24px)', minWidth: 0 }}>

                    {/* Desktop Toolbar */}
                    <div className="desktop-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                        <div>
                            <div style={{ fontSize: 12, color: '#aaa' }}>Home › <span style={{ color: '#555' }}>Products</span></div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginTop: 4 }}>{sorted.length} results found</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ display: 'flex', border: '1px solid #ebebeb', borderRadius: 6, overflow: 'hidden' }}>
                                {[['☰', 'list'], ['⊞', 'grid']].map(([icon, v]) => (
                                    <button key={v} onClick={() => setView(v)}
                                            style={{ background: view === v ? '#1a1a1a' : '#fff', border: 'none', padding: '6px 10px', cursor: 'pointer', color: view === v ? '#fff' : '#aaa', fontSize: 13 }}>
                                        {icon}
                                    </button>
                                ))}
                            </div>
                            <select value={sort} onChange={e => setSort(e.target.value)}
                                    style={{ border: '1px solid #ebebeb', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontFamily: 'inherit', color: '#555', outline: 'none', background: '#fff', cursor: 'pointer' }}>
                                <option value="popular">Sort by: Popular</option>
                                <option value="low">Price: Low to High</option>
                                <option value="high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {sorted.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa' }}>
                            <div style={{ fontSize: 48 }}>📦</div>
                            <p style={{ fontWeight: 600, marginTop: 12, color: '#888' }}>No products found.</p>
                            <p style={{ fontSize: 13, marginTop: 4 }}>Add products from the admin panel.</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: view === 'list' ? '1fr' : 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: 14
                        }}>
                            {sorted.map(p => <ProductCard key={p._id} product={p} />)}
                        </div>
                    )}
                </main>
            </div>

            {/* All responsive styles */}
            <style>{`
                @media (max-width: 768px) {
                    .topbar-strip { display: none !important; }
                    .desktop-sidebar { display: none !important; }
                    .mobile-filter-bar { display: flex !important; }
                    .desktop-toolbar { display: none !important; }
                    .mobile-sidebar-drawer aside {
                        width: 100% !important;
                        border-right: none !important;
                        border-bottom: 1px solid #ebebeb;
                    }
                }
                @media (min-width: 769px) {
                    .mobile-filter-bar { display: none !important; }
                    .mobile-sidebar-drawer { display: none !important; }
                    .desktop-sidebar { display: block !important; }
                    .desktop-toolbar { display: flex !important; }
                }
            `}</style>
        </div>
    );
};

export default Home;