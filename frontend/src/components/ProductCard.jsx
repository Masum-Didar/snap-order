import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [loading, setLoading] = useState(false);
    const [wished, setWished] = useState(false);

    // Set default color/size when modal opens
    const openOrder = () => {
        if (product.colors?.length && !selectedColor) setSelectedColor(product.colors[0]);
        if (product.sizes?.length && !selectedSize) setSelectedSize(product.sizes[0]);
        setShow(true);
    };

    const handleOrder = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!form.name?.trim() || !form.phone?.trim() || !form.address?.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        if ((product.colors?.length > 0 && !selectedColor) || (product.sizes?.length > 0 && !selectedSize)) {
            alert('Please select color and size.');
            return;
        }

        setLoading(true);
        try {
            await API.post('/orders', {
                customerDetails: {
                    name: form.name,
                    phone: form.phone,
                    address: form.address
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
            alert('Order placed successfully! Cash on Delivery.');
            setShow(false);
            setForm({ name: '', phone: '', address: '' });
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
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
                    {product.stock < 10 && (
                        <div style={{ position: 'absolute', top: 12, right: 12, background: '#ff6b6b', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                            Only {product.stock} left
                        </div>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
                            style={{ position: 'absolute', bottom: 12, right: 12, width: 36, height: 36, background: 'rgba(255,255,255,0.95)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer', border: 'none', color: wished ? '#e74c3c' : '#ccc', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}>
                        {wished ? '♥' : '♡'}
                    </button>
                </div>
                <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
                        {product.brand || product.category || 'Premium Brand'}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 8, lineHeight: 1.4 }}>{product.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                            <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>${product.price}</span>
                            {product.originalPrice && (
                                <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through', marginLeft: 6 }}>${product.originalPrice}</span>
                            )}
                        </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); openOrder(); }}
                            style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.5px', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.target.style.background = '#333'}
                            onMouseLeave={e => e.target.style.background = '#1a1a1a'}>
                        ORDER NOW — Cash on Delivery
                    </button>
                </div>
            </div>

            {show && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                     onClick={e => e.target === e.currentTarget && setShow(false)}>
                    <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 460, fontFamily: "'Inter', sans-serif", overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.3px' }}>Place Order</div>
                                <div style={{ fontSize: 11, color: '#4ecdc4', fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 6, height: 6, background: '#4ecdc4', borderRadius: '50%', display: 'inline-block' }} />
                                    Cash on Delivery Available
                                </div>
                            </div>
                            <button onClick={() => setShow(false)} style={{ width: 32, height: 32, background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 16, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                            <img src={product.image} alt={product.title} style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover', background: '#e8e8e6', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{product.title}</div>
                                <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{product.brand || product.category}</div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a', marginTop: 6 }}>${product.price}</div>
                            </div>
                        </div>
                        {/* Color & Size in Modal */}
                        {product.colors?.length > 0 && (
                            <div style={{ padding: '14px 28px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', marginBottom: 8 }}>Color: <span style={{ color: '#1a1a1a' }}>{selectedColor}</span></div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {product.colors.map(c => (
                                        <button key={c} onClick={() => setSelectedColor(c)}
                                            style={{ padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: `2px solid ${selectedColor === c ? '#1a1a1a' : '#e0e0e0'}`, background: selectedColor === c ? '#1a1a1a' : '#fff', color: selectedColor === c ? '#fff' : '#666', cursor: 'pointer' }}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {product.sizes?.length > 0 && (
                            <div style={{ padding: '14px 28px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', marginBottom: 8 }}>Size: <span style={{ color: '#1a1a1a' }}>{selectedSize}</span></div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {product.sizes.map(s => (
                                        <button key={s} onClick={() => setSelectedSize(s)}
                                            style={{ width: 44, height: 44, borderRadius: 8, fontSize: 12, fontWeight: 700, border: `2px solid ${selectedSize === s ? '#1a1a1a' : '#e0e0e0'}`, background: selectedSize === s ? '#1a1a1a' : '#fff', color: selectedSize === s ? '#fff' : '#666', cursor: 'pointer' }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleOrder} style={{ padding: '24px 28px 28px' }}>
                            {[
                                { label: 'Full Name', id: 'name', placeholder: 'John Smith', type: 'text' },
                                { label: 'Phone Number', id: 'phone', placeholder: '+880 1XXX XXXXXX', type: 'tel' }
                            ].map(({ label, id, placeholder, type }) => (
                                <div key={id} style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
                                    <input type={type} placeholder={placeholder} required value={form[id]}
                                           onChange={e => setForm({ ...form, [id]: e.target.value })}
                                           style={{ width: '100%', border: '1.5px solid #ebebeb', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                           onFocus={e => e.target.style.borderColor = '#4ecdc4'}
                                           onBlur={e => e.target.style.borderColor = '#ebebeb'} />
                                </div>
                            ))}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>Delivery Address</label>
                                <textarea placeholder="House #, Road #, Area, City" required rows={2} value={form.address}
                                          onChange={e => setForm({ ...form, address: e.target.value })}
                                          style={{ width: '100%', border: '1.5px solid #ebebeb', borderRadius: 10, padding: '12px 16px', fontSize: 14, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', resize: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                          onFocus={e => e.target.style.borderColor = '#4ecdc4'}
                                          onBlur={e => e.target.style.borderColor = '#ebebeb'} />
                            </div>
                            <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 24 }}>💵</span>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#2d7a4f' }}>Cash on Delivery</div>
                                    <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>Pay when you receive your order</div>
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                    style={{ width: '100%', background: loading ? '#ccc' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12, padding: 15, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.5px', transition: 'background 0.2s' }}>
                                {loading ? 'Placing Order...' : 'Confirm Order — Pay on Delivery'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;