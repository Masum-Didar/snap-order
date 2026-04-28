import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/axios';

export default function CartDrawer() {
    const { cartItems, showCart, setShowCart, updateQuantity, updateVariant, removeFromCart, totalItems, totalAmount, clearCart } = useCart();
    const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', city: '' });
    const [ordering, setOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const navigate = useNavigate();

    const handleVariantChange = (variantKey, newColor, newSize) => {
        updateVariant(variantKey, newColor, newSize);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!orderForm.name?.trim() || !orderForm.phone?.trim() || !orderForm.address?.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setOrdering(true);
        try {
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await API.post('/orders', {
                customerDetails: {
                    name: orderForm.name,
                    phone: orderForm.phone,
                    address: orderForm.address,
                    city: orderForm.city || ''
                },
                orderItems: cartItems.map(item => ({
                    productId: item.productId,
                    productCode: item.productCode,
                    productName: item.productName,
                    productImage: item.productImage,
                    productBrand: item.productBrand,
                    productCategory: item.productCategory,
                    color: item.color,
                    size: item.size,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    discount: item.discount,
                    quantity: item.quantity
                })),
                subtotal,
                shippingCost: 0,
                totalAmount: subtotal,
                paymentMethod: 'COD'
            });

            setOrderSuccess(true);
            clearCart();
            setOrderForm({ name: '', phone: '', address: '', city: '' });

            setTimeout(() => {
                setOrderSuccess(false);
                setShowCart(false);
                navigate('/');
            }, 2500);
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setOrdering(false);
        }
    };

    if (!showCart) return null;

    return (
        <>
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999,
                backdropFilter: 'blur(4px)'
            }} onClick={() => setShowCart(false)} />

            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 480,
                background: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column',
                boxShadow: '-4px 0 30px rgba(0,0,0,0.15)', overflowY: 'auto'
            }}>
                {orderSuccess ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>Order Placed!</h2>
                        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                            Thank you for your order.<br />
                            We will contact you shortly.
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                            <div>
                                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>Shopping Cart</h2>
                                <p style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                            </div>
                            <button onClick={() => setShowCart(false)} style={{
                                width: 36, height: 36, background: '#f5f5f5', border: 'none', borderRadius: 10,
                                cursor: 'pointer', fontSize: 16, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>✕</button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {cartItems.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                                    <div style={{ fontSize: 60, marginBottom: 16 }}>🛒</div>
                                    <p style={{ fontSize: 16, fontWeight: 600, color: '#888' }}>Your cart is empty</p>
                                    <p style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>Add products to get started</p>
                                    <button onClick={() => setShowCart(false)} style={{
                                        marginTop: 20, background: '#1a1a1a', color: '#fff', border: 'none',
                                        borderRadius: 10, padding: '12px 28px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                                    }}>Continue Shopping</button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ padding: '8px 0' }}>
                                        {cartItems.map(item => (
                                            <div key={item.variantKey} style={{
                                                padding: '16px 24px', borderBottom: '1px solid #f5f5f5', display: 'flex', gap: 14,
                                                minWidth: 0, alignItems: 'center'
                                            }}>
                                                <img src={item.productImage} alt={item.productName} style={{
                                                    width: 90, height: 90, borderRadius: 12, objectFit: 'cover', background: '#f5f5f3', flexShrink: 0
                                                }} />
                                                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100% - 30px)' }}>{item.productName}</h4>
                                                        <button onClick={() => removeFromCart(item.variantKey)} style={{
                                                            background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 14, padding: 4, flexShrink: 0
                                                        }}>✕</button>
                                                    </div>

                                                    {item.availableColors?.length > 0 && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                                            <span style={{ fontSize: 11, color: '#aaa', minWidth: 40 }}>Color</span>
                                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                                {item.availableColors.map(c => (
                                                                    <button key={c} onClick={() => handleVariantChange(item.variantKey, c, item.size)}
                                                                        style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, border: `2px solid ${item.color === c ? '#4ecdc4' : '#e0e0e0'}`, background: item.color === c ? '#4ecdc4' : '#fff', color: item.color === c ? '#fff' : '#666', cursor: 'pointer' }}>
                                                                        {c}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {item.availableSizes?.length > 0 && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                                            <span style={{ fontSize: 11, color: '#aaa', minWidth: 40 }}>Size</span>
                                                            <div style={{ display: 'flex', gap: 4 }}>
                                                                {item.availableSizes.map(s => (
                                                                    <button key={s} onClick={() => handleVariantChange(item.variantKey, item.color, s)}
                                                                        style={{ width: 32, height: 23, borderRadius: 5, fontSize: 11, fontWeight: 700, border: `2px solid ${item.size === s ? '#4ecdc4' : '#e0e0e0'}`, background: item.size === s ? '#4ecdc4' : '#fff', color: item.size === s ? '#fff' : '#666', cursor: 'pointer' }}>
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <span style={{ fontSize: 11, color: '#aaa', minWidth: 40 }}>Qty</span>
                                                            <button onClick={() => updateQuantity(item.variantKey, item.quantity - 1)} style={{
                                                                width: 28, height: 23, background: '#f5f5f5', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 16, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                            }}>−</button>
                                                            <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.variantKey, item.quantity + 1)} style={{
                                                                width: 28, height: 23, background: '#f5f5f5', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 16, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                            }}>+</button>
                                                        </div>
                                                        <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>৳{(item.price * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ borderTop: '1px solid #eee', padding: '20px 24px 24px' }}>
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                <span style={{ fontSize: 13, color: '#666' }}>Subtotal</span>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>৳{totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: 13, color: '#666' }}>Shipping</span>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#16a34a' }}>Free</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' }}>
                                                <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
                                                <span style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>৳{totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <form onSubmit={handlePlaceOrder}>
                                            {[
                                                { label: 'Full Name *', id: 'name', placeholder: 'John Smith', type: 'text' },
                                                { label: 'Phone Number *', id: 'phone', placeholder: '+880 1XXX XXXXXX', type: 'tel' }
                                            ].map(({ label, id, placeholder, type }) => (
                                                <div key={id} style={{ marginBottom: 10 }}>
                                                    <input type={type} placeholder={placeholder} required value={orderForm[id]}
                                                           onChange={e => setOrderForm({ ...orderForm, [id]: e.target.value })}
                                                           style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
                                                </div>
                                            ))}
                                            <div style={{ marginBottom: 10 }}>
                                                <input type="text" placeholder="City (optional)" value={orderForm.city}
                                                       onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                                                       style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', boxSizing: 'border-box' }} />
                                            </div>
                                            <div style={{ marginBottom: 14 }}>
                                                <textarea placeholder="Full Address *" required rows={2} value={orderForm.address}
                                                          onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                                                          style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', background: '#fafafa', resize: 'none', boxSizing: 'border-box' }} />
                                            </div>

                                            <div style={{ background: '#f0fff4', border: '1px solid #c6f6d5', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ fontSize: 20 }}>💵</span>
                                                <div>
                                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#2d7a4f' }}>Cash on Delivery</div>
                                                    <div style={{ fontSize: 11, color: '#888' }}>Pay when you receive</div>
                                                </div>
                                            </div>

                                            <button type="submit" disabled={ordering} style={{
                                                width: '100%', background: ordering ? '#ccc' : '#1a1a1a', color: '#fff', border: 'none',
                                                borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 700, cursor: ordering ? 'not-allowed' : 'pointer',
                                                fontFamily: 'inherit', letterSpacing: '0.3px'
                                            }}>
                                                {ordering ? 'Placing Order...' : `Place Order — ৳${totalAmount.toLocaleString()}`}
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
