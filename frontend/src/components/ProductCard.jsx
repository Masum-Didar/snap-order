import React, { useState } from 'react';
import API from '../api/axios';

const ProductCard = ({ product }) => {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [wished, setWished] = useState(false);

    const handleOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/orders', {
                ...form,
                orderItems: [{ productId: product._id, title: product.title, price: product.price, quantity: 1 }],
                totalAmount: product.price
            });
            alert('Order placed successfully! We will contact you shortly.');
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
            <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', fontFamily: "'Inter', sans-serif", border: '1px solid #f0f0f0' }}>
                <div style={{ height: 200, background: '#e8e8e6', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={product.image} alt={product.title}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                         onError={e => e.target.style.display = 'none'} />
                    {product.badge && (
                        <div style={{ position: 'absolute', top: 10, left: 10, background: '#4ecdc4', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.5px' }}>
                            {product.badge}
                        </div>
                    )}
                    <button onClick={() => setWished(!wished)}
                            style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer', border: 'none', color: wished ? '#e74c3c' : '#888' }}>
                        {wished ? '♥' : '♡'}
                    </button>
                </div>
                <div style={{ padding: 12 }}>
                    <div style={{ fontSize: 10, color: '#aaa', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>
                        {product.brand || product.category || 'Product'}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6, lineHeight: 1.3 }}>{product.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#4ecdc4' }}>${product.price}.00</span>
                        <span style={{ fontSize: 10, color: '#f87171', fontWeight: 500 }}>{product.stock} items left</span>
                    </div>
                    <button onClick={() => setShow(true)}
                            style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Order Now
                    </button>
                </div>
            </div>

            {show && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                     onClick={e => e.target === e.currentTarget && setShow(false)}>
                    <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460, fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.3px' }}>Place your order</div>
                            <button onClick={() => setShow(false)} style={{ width: 28, height: 28, background: '#f4f4f4', border: 'none', borderRadius: 7, cursor: 'pointer', fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                            <img src={product.image} alt={product.title} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', background: '#e8e8e6', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{product.title}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#4ecdc4', marginTop: 2 }}>${product.price}.00</div>
                            </div>
                        </div>
                        <form onSubmit={handleOrder} style={{ padding: '20px 24px 24px' }}>
                            {[
                                { label: 'Full name', id: 'name', placeholder: 'John Smith', type: 'text' },
                                { label: 'Phone number', id: 'phone', placeholder: '+1 (555) 000-0000', type: 'tel' }
                            ].map(({ label, id, placeholder, type }) => (
                                <div key={id} style={{ marginBottom: 14 }}>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
                                    <input type={type} placeholder={placeholder} required value={form[id]}
                                           onChange={e => setForm({ ...form, [id]: e.target.value })}
                                           style={{ width: '100%', border: '1.5px solid #ebebeb', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
                                </div>
                            ))}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 6 }}>Delivery address</label>
                                <textarea placeholder="123 Main St, City, ZIP" required rows={2} value={form.address}
                                          onChange={e => setForm({ ...form, address: e.target.value })}
                                          style={{ width: '100%', border: '1.5px solid #ebebeb', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', resize: 'none', boxSizing: 'border-box' }} />
                            </div>
                            <button type="submit" disabled={loading}
                                    style={{ width: '100%', background: loading ? '#ccc' : '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                {loading ? 'Placing order...' : 'Confirm Order'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;