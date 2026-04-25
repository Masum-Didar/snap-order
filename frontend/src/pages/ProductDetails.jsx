import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showOrder, setShowOrder] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '' });
    const [ordering, setOrdering] = useState(false);

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

    const handleOrder = async (e) => {
        e.preventDefault();
        if ((product.colors?.length && !selectedColor) || (product.sizes?.length && !selectedSize)) {
            alert('Please select both color and size.');
            return;
        }
        setOrdering(true);
        try {
            await API.post('/orders', {
                customerDetails: {
                    name: orderForm.name,
                    phone: orderForm.phone,
                    address: orderForm.address
                },
                orderItems: [{
                    productId: product._id,
                    productCode: product.productCode || '',
                    productName: product.title,
                    productImage: product.image,
                    productBrand: product.brand || '',
                    productCategory: product.category || '',
                    color: selectedColor,
                    size: selectedSize,
                    price: product.price,
                    originalPrice: product.originalPrice || 0,
                    discount: product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0,
                    quantity: 1
                }],
                subtotal: product.price,
                shippingCost: 0,
                totalAmount: product.price,
                paymentMethod: 'COD'
            });
            alert('Order placed! We will contact you shortly.');
            setShowOrder(false);
            navigate('/');
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setOrdering(false);
        }
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
                <div style={{ fontSize: 48 }}>😕</div>
                <p style={{ color: '#888', marginTop: 12 }}>Product not found</p>
                <button onClick={() => navigate('/')} style={{ marginTop: 16, background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Go Back</button>
            </div>
        </div>
    );

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8f8f8', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>
                <div style={{ fontSize: 12, color: '#aaa', marginBottom: 20 }}>
                    Home / <span style={{ color: '#666' }}>{product.category || 'Products'}</span> / <span style={{ color: '#1a1a1a' }}>{product.title}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{ aspectRatio: '3/4', background: '#f5f5f3', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                        </div>
                        {product.badge && (
                            <div style={{ position: 'absolute', top: 16, left: 16, background: '#1a1a1a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '5px 14px', borderRadius: 20 }}>{product.badge}</div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{product.brand || 'Premium Brand'}</div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>{product.title}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <span style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a' }}>${product.price}</span>
                            {product.originalPrice && (
                                <span style={{ fontSize: 18, color: '#aaa', textDecoration: 'line-through' }}>${product.originalPrice}</span>
                            )}
                            {product.originalPrice && (
                                <span style={{ background: '#ff6b6b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        {product.description && (
                            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 20 }}>{product.description}</p>
                        )}

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
                                                padding: '7px 18px', borderRadius: 25, fontSize: 12, fontWeight: 600,
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
                                                width: 48, height: 48, borderRadius: 10, fontSize: 13, fontWeight: 700,
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

                        {/* Order Summary Row */}
                        <div style={{ background: '#f8f8f8', borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 120 }}>
                                <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Selected Color</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{selectedColor || '-'}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 120 }}>
                                <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Selected Size</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{selectedSize || '-'}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 120 }}>
                                <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Stock</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: product.stock > 0 ? '#2d7a4f' : '#e74c3c' }}>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</div>
                            </div>
                        </div>

                        <button onClick={() => setShowOrder(true)} disabled={product.stock === 0}
                                style={{ width: '100%', background: product.stock === 0 ? '#ccc' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 14, fontWeight: 700, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.5px', transition: 'background 0.2s', marginBottom: 12 }}>
                            {product.stock === 0 ? 'Out of Stock' : 'Order Now — Cash on Delivery'}
                        </button>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1, background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 18 }}>💵</span>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: '#2d7a4f' }}>Cash on Delivery</div>
                                    <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>Pay when you receive</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {['Trusted Shipping', 'Easy 7-Day Returns', '100% Secure Shopping'].map(t => (
                                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#666' }}>
                                    <span style={{ width: 6, height: 6, background: '#4ecdc4', borderRadius: '50%', display: 'inline-block' }} />{t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Modal - Scrollable */}
            {showOrder && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                     onClick={e => e.target === e.currentTarget && setShowOrder(false)}>
                    <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '90vh', fontFamily: "'Inter', sans-serif", overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                            <div>
                                <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a1a' }}>Place Order</div>
                                <div style={{ fontSize: 11, color: '#4ecdc4', fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 6, height: 6, background: '#4ecdc4', borderRadius: '50%', display: 'inline-block' }} />
                                    Cash on Delivery
                                </div>
                            </div>
                            <button onClick={() => setShowOrder(false)} style={{ width: 30, height: 30, background: '#f5f5f5', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>

                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {/* Product Info */}
                            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                                <img src={product.image} alt={product.title} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', background: '#e8e8e6', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{product.title}</div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#4ecdc4', marginTop: 2 }}>${product.price}</div>
                                </div>
                            </div>

                            {/* Selected Variant */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px 24px', borderBottom: '1px solid #f0f0f0' }}>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: 4 }}>Color</div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', background: '#f5f5f5', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>{selectedColor || '-'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: 4 }}>Size</div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', background: '#f5f5f5', padding: '6px 12px', borderRadius: 8, display: 'inline-block' }}>{selectedSize || '-'}</div>
                                </div>
                            </div>

                            {/* Order Form */}
                            <form onSubmit={handleOrder} style={{ padding: '20px 24px 24px' }}>
                                {[
                                    { label: 'Full Name', id: 'name', placeholder: 'John Smith', type: 'text' },
                                    { label: 'Phone Number', id: 'phone', placeholder: '+880 1XXX XXXXXX', type: 'tel' }
                                ].map(({ label, id, placeholder, type }) => (
                                    <div key={id} style={{ marginBottom: 14 }}>
                                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
                                        <input type={type} placeholder={placeholder} required value={orderForm[id]}
                                               onChange={e => setOrderForm({ ...orderForm, [id]: e.target.value })}
                                               style={{ width: '100%', border: '1.5px solid #ebebeb', borderRadius: 10, padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
                                    </div>
                                ))}
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 6 }}>Delivery Address</label>
                                    <textarea placeholder="House #, Road #, Area, City" required rows={2} value={orderForm.address}
                                              onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                                              style={{ width: '100%', border: '1.5px solid #ebebeb', borderRadius: 10, padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', resize: 'none', boxSizing: 'border-box' }} />
                                </div>

                                {/* COD Badge */}
                                <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 10, padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 22 }}>💵</span>
                                    <div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#2d7a4f' }}>Cash on Delivery</div>
                                        <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>Pay when you receive your order</div>
                                    </div>
                                </div>

                                <button type="submit" disabled={ordering}
                                        style={{ width: '100%', background: ordering ? '#ccc' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, cursor: ordering ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.5px' }}>
                                    {ordering ? 'Placing Order...' : 'Confirm Order — Pay on Delivery'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
