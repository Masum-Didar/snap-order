import { useState, useEffect } from 'react';
import { adminAPI, productAPI } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '', price: '', originalPrice: '', description: '', image: '',
        brand: '', category: '', badge: '', colors: '', sizes: '', stock: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/admin/login'); return; }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                adminAPI.getOrders(),
                productAPI.getProducts()
            ]);
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await adminAPI.updateOrderStatus(id, status);
            fetchData();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
                stock: Number(newProduct.stock),
                colors: newProduct.colors ? newProduct.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
                sizes: newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
            };
            await productAPI.addProduct(productData);
            setShowAddProduct(false);
            setNewProduct({ title: '', price: '', originalPrice: '', description: '', image: '', brand: '', category: '', badge: '', colors: '', sizes: '', stock: '' });
            fetchData();
        } catch (err) {
            alert('Failed to add product');
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await adminAPI.deleteProduct(id);
            fetchData();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    if (loading) return <div className="text-center mt-5"><h4>Loading...</h4></div>;

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-dark" style={{ background: '#1a1a1a' }}>
                <span className="navbar-brand mb-0 h4">SnapOrder Admin</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </nav>

            <div className="container-fluid py-4">
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            Orders ({orders.length})
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                            Products ({products.length})
                        </button>
                    </li>
                </ul>

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-4">All Orders</h5>
                            {orders.length === 0 ? (
                                <p className="text-muted">No orders yet</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Customer</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>City</th>
                                                <th>Items</th>
                                                <th>Subtotal</th>
                                                <th>Shipping</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order, idx) => (
                                                <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                                                    <td>{idx + 1}</td>
                                                    <td><small>{order._id.slice(-6).toUpperCase()}</small></td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="fw-bold">{order.customerDetails?.name || '-'}</td>
                                                    <td>{order.customerDetails?.phone || '-'}</td>
                                                    <td>{order.customerDetails?.email || '-'}</td>
                                                    <td><small>{order.customerDetails?.address || '-'}</small></td>
                                                    <td>{order.customerDetails?.city || '-'}</td>
                                                    <td>
                                                        <span className="badge bg-dark">{order.orderItems?.length || 0}</span>
                                                    </td>
                                                    <td>৳{order.subtotal || order.totalAmount}</td>
                                                    <td>৳{order.shippingCost || 0}</td>
                                                    <td className="fw-bold text-success">৳{order.totalAmount}</td>
                                                    <td>
                                                        <span className={`badge ${order.paymentMethod === 'COD' ? 'bg-info' : 'bg-secondary'}`}>
                                                            {order.paymentMethod || 'COD'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${
                                                            order.status === 'Delivered' ? 'bg-success' :
                                                            order.status === 'Pending' ? 'bg-warning text-dark' :
                                                            order.status === 'Processing' ? 'bg-primary' :
                                                            order.status === 'Shipped' ? 'bg-info' :
                                                            order.status === 'Cancelled' ? 'bg-danger' : 'bg-secondary'
                                                        }`}>
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td onClick={e => e.stopPropagation()}>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                            style={{ width: '130px' }}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedOrder(null)}>
                        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Order Details</h5>
                                    <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <h6 className="text-muted mb-2">Customer Info</h6>
                                            <p className="mb-1"><strong>Name:</strong> {selectedOrder.customerDetails?.name}</p>
                                            <p className="mb-1"><strong>Phone:</strong> {selectedOrder.customerDetails?.phone}</p>
                                            <p className="mb-1"><strong>Email:</strong> {selectedOrder.customerDetails?.email || '-'}</p>
                                            <p className="mb-1"><strong>Address:</strong> {selectedOrder.customerDetails?.address}</p>
                                            <p className="mb-0"><strong>City:</strong> {selectedOrder.customerDetails?.city || '-'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="text-muted mb-2">Order Info</h6>
                                            <p className="mb-1"><strong>Order ID:</strong> <small>{selectedOrder._id}</small></p>
                                            <p className="mb-1"><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                            <p className="mb-1"><strong>Subtotal:</strong> ৳{selectedOrder.subtotal || selectedOrder.totalAmount}</p>
                                            <p className="mb-1"><strong>Shipping:</strong> ৳{selectedOrder.shippingCost || 0}</p>
                                            <p className="mb-1"><strong>Total:</strong> <span className="text-success fw-bold">৳{selectedOrder.totalAmount}</span></p>
                                            <p className="mb-0"><strong>Payment:</strong> {selectedOrder.paymentMethod || 'COD'}</p>
                                        </div>
                                        <div className="col-12">
                                            <h6 className="text-muted mb-2 mt-2">Order Items</h6>
                                            <table className="table table-sm table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Code</th>
                                                        <th>Brand</th>
                                                        <th>Color</th>
                                                        <th>Size</th>
                                                        <th>Price</th>
                                                        <th>Qty</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedOrder.orderItems?.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    {item.productImage && <img src={item.productImage} alt="" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 4 }} />}
                                                                    <small>{item.productName || item.title || '-'}</small>
                                                                </div>
                                                            </td>
                                                            <td><small>{item.productCode || '-'}</small></td>
                                                            <td><small>{item.productBrand || '-'}</small></td>
                                                            <td><small>{item.color || '-'}</small></td>
                                                            <td><small>{item.size || '-'}</small></td>
                                                            <td>৳{item.price}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>৳{item.price * item.quantity}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {selectedOrder.orderNotes && (
                                            <div className="col-12">
                                                <h6 className="text-muted mb-2">Notes</h6>
                                                <p className="mb-0">{selectedOrder.orderNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">All Products</h5>
                                <button className="btn btn-dark" onClick={() => setShowAddProduct(!showAddProduct)}>
                                    {showAddProduct ? 'Cancel' : '+ Add Product'}
                                </button>
                            </div>

                            {showAddProduct && (
                                <div className="card bg-light mb-4 border-0">
                                    <div className="card-body">
                                        <h6 className="mb-3">Add New Product</h6>
                                        <form onSubmit={handleAddProduct}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold text-muted">Product Title *</label>
                                                    <input type="text" className="form-control" placeholder="e.g. Classic Fit Cotton Shirt"
                                                        value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} required />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small fw-bold text-muted">Price ($) *</label>
                                                    <input type="number" className="form-control" placeholder="29.99"
                                                        value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
                                                </div>
                                                <div className="col-md-3">
                                                    <label className="form-label small fw-bold text-muted">Original Price ($)</label>
                                                    <input type="number" className="form-control" placeholder="49.99"
                                                        value={newProduct.originalPrice} onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-muted">Brand</label>
                                                    <input type="text" className="form-control" placeholder="e.g. Zara, H&M"
                                                        value={newProduct.brand} onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-muted">Category</label>
                                                    <input type="text" className="form-control" placeholder="e.g. Men, Women, Electronics"
                                                        value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-muted">Badge / Tag</label>
                                                    <input type="text" className="form-control" placeholder="e.g. NEW, SALE, HOT"
                                                        value={newProduct.badge} onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})} />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label small fw-bold text-muted">Image URL *</label>
                                                    <input type="text" className="form-control" placeholder="https://..."
                                                        value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} required />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label small fw-bold text-muted">Description</label>
                                                    <textarea className="form-control" placeholder="Product details..."
                                                        rows="2" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold text-muted">Colors</label>
                                                    <input type="text" className="form-control" placeholder="Red, Blue, Green (comma separated)"
                                                        value={newProduct.colors} onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})} />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small fw-bold text-muted">Sizes</label>
                                                    <input type="text" className="form-control" placeholder="S, M, L, XL (comma separated)"
                                                        value={newProduct.sizes} onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small fw-bold text-muted">Stock Quantity *</label>
                                                    <input type="number" className="form-control" placeholder="100"
                                                        value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-success px-4">Save Product</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {products.length === 0 ? (
                                <p className="text-muted">No products yet. Add your first product!</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Brand</th>
                                                <th>Price</th>
                                                <th>Colors</th>
                                                <th>Sizes</th>
                                                <th>Stock</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id}>
                                                    <td><img src={product.image} alt={product.title} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} /></td>
                                                    <td><div className="fw-bold">{product.title}</div><div className="small text-muted">{product.category}</div></td>
                                                    <td>{product.brand || '-'}</td>
                                                    <td>
                                                        <div className="fw-bold">৳{product.price}</div>
                                                        {product.originalPrice && <div className="small text-decoration-line-through text-muted">৳{product.originalPrice}</div>}
                                                    </td>
                                                    <td>
                                                        {product.colors?.length > 0 ? (
                                                            <div className="d-flex gap-1 flex-wrap">
                                                                {product.colors.map(c => <span key={c} className="badge bg-secondary">{c}</span>)}
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                    <td>
                                                        {product.sizes?.length > 0 ? (
                                                            <div className="d-flex gap-1 flex-wrap">
                                                                {product.sizes.map(s => <span key={s} className="badge bg-dark">{s}</span>)}
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                            {product.stock}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(product._id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
