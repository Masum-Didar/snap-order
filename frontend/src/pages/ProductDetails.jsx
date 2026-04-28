import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, setShowCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        API.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data);
                if (res.data.colors?.length) setSelectedColor(res.data.colors[0]);
                if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0]);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (product.colors?.length && !selectedColor) {
            alert('Please select a color');
            return;
        }
        if (product.sizes?.length && !selectedSize) {
            alert('Please select a size');
            return;
        }
        if (quantity > product.stock) {
            alert('Not enough stock available');
            return;
        }
        addToCart(product, selectedColor, selectedSize, quantity);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            setShowCart(true);
        }, 800);
    };

    if (loading) return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: '3px solid #eee', borderTop: '3px solid #4ecdc4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#999', fontSize: 14 }}>Loading product...</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (!product) return (
        <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>😕</div>
                <p style={{ color: '#888', fontSize: 16, fontWeight: 600 }}>Product not found</p>
                <button onClick={() => navigate('/')} style={{ marginTop: 20, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Go Back to Shop</button>
            </div>
        </div>
    );

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 40px' }}>
                {/* Breadcrumb */}
                <div style={{ padding: '20px 0', fontSize: 12, color: '#aaa' }}>
                    <span style={{ cursor: 'pointer', color: '#666' }} onClick={() => navigate('/')}>Home</span>
                    <span style={{ margin: '0 8px' }}>›</span>
                    <span style={{ color: '#666' }}>{product.category || 'Products'}</span>
                    <span style={{ margin: '0 8px' }}>›</span>
                    <span style={{ color: '#1a1a1a' }}>{product.title}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
                    {/* Image Section */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ aspectRatio: '3/4', background: '#fff', borderRadius: 20, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                        </div>
                        {product.badge && (
                            <div style={{ position: 'absolute', top: 16, left: 16, background: '#1a1a1a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 20, letterSpacing: '0.5px' }}>{product.badge}</div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>{product.brand || 'Premium Brand'}</div>
                        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>{product.title}</h1>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                            <span style={{ fontSize: 34, fontWeight: 800, color: '#1a1a1a' }}>৳{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <>
                                    <span style={{ fontSize: 20, color: '#aaa', textDecoration: 'line-through' }}>৳{product.originalPrice.toLocaleString()}</span>
                                    <span style={{ background: '#ff6b6b', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>
                        )}

                        {/* Stock */}
                        <div style={{ marginBottom: 24 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: product.stock > 0 ? '#16a34a' : '#dc2626' }}>
                                {product.stock > 0 ? `✓ ${product.stock} items in stock` : '✕ Out of stock'}
                            </span>
                        </div>

                        {/* Color Selection */}
                        {product.colors?.length > 0 && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Color: <span style={{ color: '#1a1a1a', fontWeight: 800 }}>{selectedColor}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {product.colors.map(c => (
                                        <button key={c} onClick={() => setSelectedColor(c)}
                                            style={{
                                                padding: '8px 20px', borderRadius: 25, fontSize: 12, fontWeight: 600,
                                                border: `2px solid ${selectedColor === c ? '#1a1a1a' : '#e0e0e0'}`,
                                                background: selectedColor === c ? '#1a1a1a' : '#fff',
                                                color: selectedColor === c ? '#fff' : '#666',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.sizes?.length > 0 && (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Size: <span style={{ color: '#1a1a1a', fontWeight: 800 }}>{selectedSize}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {product.sizes.map(s => (
                                        <button key={s} onClick={() => setSelectedSize(s)}
                                            style={{
                                                width: 50, height: 50, borderRadius: 10, fontSize: 13, fontWeight: 700,
                                                border: `2px solid ${selectedSize === s ? '#1a1a1a' : '#e0e0e0'}`,
                                                background: selectedSize === s ? '#1a1a1a' : '#fff',
                                                color: selectedSize === s ? '#fff' : '#666',
                                                cursor: 'pointer', transition: 'all 0.2s'
                                            }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 42, height: 42, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ width: 50, textAlign: 'center', fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: 42, height: 42, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{ background: '#f8f9fa', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Total Price</span>
                            <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>৳{(product.price * quantity).toLocaleString()}</span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            style={{
                                width: '100%', background: added ? '#22c55e' : product.stock === 0 ? '#ccc' : '#1a1a1a',
                                color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 15, fontWeight: 700,
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                                letterSpacing: '0.5px', transition: 'background 0.2s', marginBottom: 12,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}>
                            {added ? (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                    Added to Cart!
                                </>
                            ) : product.stock === 0 ? (
                                'Out of Stock'
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                    </svg>
                                    Add to Cart
                                </>
                            )}
                        </button>

                        {/* Continue Shopping */}
                        <button onClick={() => navigate('/')} style={{
                            width: '100%', background: '#fff', color: '#1a1a1a', border: '1px solid #e5e7eb',
                            borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.3px'
                        }}>
                            ← Continue Shopping
                        </button>

                        {/* Trust Badges */}
                        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { icon: '🚚', title: 'Trusted Shipping', desc: 'Nationwide delivery' },
                                { icon: '↩️', title: 'Easy Returns', desc: '7-day return policy' },
                                { icon: '🔒', title: 'Secure Shopping', desc: '100% protected' }
                            ].map(t => (
                                <div key={t.title} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#555' }}>
                                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{t.title}</div>
                                        <div style={{ fontSize: 11, color: '#999' }}>{t.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
