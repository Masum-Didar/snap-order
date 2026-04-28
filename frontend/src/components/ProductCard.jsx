import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart, setShowCart } = useCart();
    const [selectedColor, setSelectedColor] = useState(product.colors?.length ? product.colors[0] : '');
    const [selectedSize, setSelectedSize] = useState(product.sizes?.length ? product.sizes[0] : '');
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (product.colors?.length && !selectedColor) {
            alert('Please select a color');
            return;
        }
        if (product.sizes?.length && !selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product, selectedColor, selectedSize, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
        setShowCart(true);
    };

    return (
        <div style={{
            background: '#fff',
            borderRadius: 16,
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            border: '1px solid #eee',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
        }}
        onClick={() => navigate(`/product/${product._id}`)}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
            <div style={{ height: 220, background: '#f5f5f3', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={product.image} alt={product.title}
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = '#e8e8e6'; }} />
                {product.badge && (
                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#1a1a1a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.5px' }}>
                        {product.badge}
                    </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: '#ff6b6b', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                        Only {product.stock} left
                    </div>
                )}
                {product.stock === 0 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ background: '#fff', color: '#1a1a1a', fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 20 }}>Out of Stock</span>
                    </div>
                )}
            </div>
            <div style={{ padding: 16 }}>
                <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                    {product.brand || product.category || 'Premium Brand'}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 8, lineHeight: 1.4 }}>{product.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>৳{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through', marginLeft: 6 }}>৳{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    {product.originalPrice && (
                        <span style={{ background: '#ff6b6b', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>

                {/* Color selector */}
                {product.colors?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                        {product.colors.map(c => (
                            <button key={c} onClick={(e) => { e.stopPropagation(); setSelectedColor(c); }}
                                style={{
                                    padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600,
                                    border: `2px solid ${selectedColor === c ? '#1a1a1a' : '#e0e0e0'}`,
                                    background: selectedColor === c ? '#1a1a1a' : '#fff',
                                    color: selectedColor === c ? '#fff' : '#666',
                                    cursor: 'pointer', transition: 'all 0.15s'
                                }}>
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                {/* Size selector */}
                {product.sizes?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                        {product.sizes.map(s => (
                            <button key={s} onClick={(e) => { e.stopPropagation(); setSelectedSize(s); }}
                                style={{
                                    width: 36, height: 36, borderRadius: 8, fontSize: 11, fontWeight: 700,
                                    border: `2px solid ${selectedSize === s ? '#1a1a1a' : '#e0e0e0'}`,
                                    background: selectedSize === s ? '#1a1a1a' : '#fff',
                                    color: selectedSize === s ? '#fff' : '#666',
                                    cursor: 'pointer', transition: 'all 0.15s'
                                }}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    style={{
                        width: '100%', background: added ? '#22c55e' : product.stock === 0 ? '#ccc' : '#1a1a1a',
                        color: '#fff', border: 'none', borderRadius: 10, padding: '11px 14px',
                        fontSize: 12, fontWeight: 700, cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit', letterSpacing: '0.5px', transition: 'background 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}>
                    {added ? (
                        <>✓ Added to Cart</>
                    ) : product.stock === 0 ? (
                        'Out of Stock'
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
