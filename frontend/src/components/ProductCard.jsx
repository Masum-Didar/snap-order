import React, { useState } from 'react';
import API from '../api/axios';

const ProductCard = ({ product }) => {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', address: '' });

    const handleOrder = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                ...form,
                orderItems: [{ productId: product._id, title: product.title, price: product.price, quantity: 1 }],
                totalAmount: product.price
            };
            await API.post('/orders', orderData);
            alert("✅ অর্ডার সফল হয়েছে!");
            setShow(false);
        } catch (err) {
            alert("❌ অর্ডার ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        }
    };

    return (
        <div className="card h-100 shadow-sm border-0">
            <img src={product.image} className="card-img-top" alt={product.title} style={{ height: '180px', objectFit: 'cover' }} />
            <div className="card-body text-center">
                <h6 className="card-title fw-bold">{product.title}</h6>
                <p className="text-primary fw-bold">৳ {product.price}</p>
                <button onClick={() => setShow(true)} className="btn btn-success btn-sm w-100 rounded-pill">অর্ডার করুন</button>
            </div>

            {show && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">অর্ডার নিশ্চিত করুন</h5>
                                <button className="btn-close btn-close-white" onClick={() => setShow(false)}></button>
                            </div>
                            <form onSubmit={handleOrder} className="modal-body p-4">
                                <input type="text" placeholder="আপনার নাম" className="form-control mb-3" required
                                       onChange={(e) => setForm({...form, name: e.target.value})} />
                                <input type="text" placeholder="মোবাইল নম্বর" className="form-control mb-3" required
                                       onChange={(e) => setForm({...form, phone: e.target.value})} />
                                <textarea placeholder="ডেলিভারি ঠিকানা" className="form-control mb-3" rows="3" required
                                          onChange={(e) => setForm({...form, address: e.target.value})}></textarea>
                                <button type="submit" className="btn btn-success w-100 py-2 fw-bold">অর্ডার কনফার্ম করুন</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProductCard;