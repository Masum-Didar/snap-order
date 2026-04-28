import { useState, useEffect } from 'react';
import { adminAPI, productAPI } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
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

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...editingProduct,
                price: Number(editingProduct.price),
                originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
                stock: Number(editingProduct.stock),
                colors: editingProduct.colors ? editingProduct.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
                sizes: editingProduct.sizes ? editingProduct.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
            };
            await adminAPI.updateProduct(editingProduct._id, productData);
            setEditingProduct(null);
            fetchData();
        } catch (err) {
            alert('Failed to update product');
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

    const startEditProduct = (product) => {
        setEditingProduct({
            ...product,
            colors: product.colors?.join(', ') || '',
            sizes: product.sizes?.join(', ') || ''
        });
        setShowAddProduct(false);
    };

    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    if (loading) return (
        <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
        </div>
    );

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                            <path d="M2 17l10 5 10-5"/>
                            <path d="M2 12l10 5 10-5"/>
                        </svg>
                        <span>SnapOrder</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Dashboard
                    </button>
                    <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        Orders
                        {pendingOrders > 0 && <span className="badge">{pendingOrders}</span>}
                    </button>
                    <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                        Products
                        <span className="badge-count">{products.length}</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-left">
                        <h1>{activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'orders' ? 'Orders' : 'Products'}</h1>
                    </div>
                    <div className="topbar-right">
                        <span className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                <div className="content-area">
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-overview">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon orders">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                            <line x1="3" y1="6" x2="21" y2="6"/>
                                            <path d="M16 10a4 4 0 0 1-8 0"/>
                                        </svg>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{orders.length}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon pending">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="12 6 12 12 16 14"/>
                                        </svg>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{pendingOrders}</span>
                                        <span className="stat-label">Pending Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon delivered">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                            <polyline points="22 4 12 14.01 9 11.01"/>
                                        </svg>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{deliveredOrders}</span>
                                        <span className="stat-label">Delivered</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon revenue">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="1" x2="12" y2="23"/>
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                        </svg>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">৳{totalRevenue.toLocaleString()}</span>
                                        <span className="stat-label">Total Revenue</span>
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-sections">
                                <div className="section-card">
                                    <div className="section-header">
                                        <h3>Recent Orders</h3>
                                        <button className="view-all" onClick={() => setActiveTab('orders')}>View All</button>
                                    </div>
                                    <div className="table-wrapper">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Phone</th>
                                                    <th>Items</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.slice(0, 5).map(order => (
                                                    <tr key={order._id} onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}>
                                                        <td><code>#{order._id.slice(-6).toUpperCase()}</code></td>
                                                        <td>{order.customerDetails?.name || 'Guest'}</td>
                                                        <td>{order.customerDetails?.phone || '-'}</td>
                                                        <td>{order.orderItems?.length || 0}</td>
                                                        <td className="fw-600">৳{order.totalAmount}</td>
                                                        <td><span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status || 'Pending'}</span></td>
                                                    </tr>
                                                ))}
                                                {orders.length === 0 && <tr><td colSpan="6" className="empty-text">No orders yet</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="section-card">
                                    <div className="section-header">
                                        <h3>Products Overview</h3>
                                        <button className="view-all" onClick={() => setActiveTab('products')}>View All</button>
                                    </div>
                                    <div className="table-wrapper">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Price</th>
                                                    <th>Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.slice(0, 5).map(product => (
                                                    <tr key={product._id} onClick={() => setActiveTab('products')}>
                                                        <td><img src={product.image} alt="" className="table-img" /></td>
                                                        <td>{product.title}</td>
                                                        <td className="fw-600">৳{product.price}</td>
                                                        <td><span className={`stock-badge ${product.stock > 0 ? 'in' : 'out'}`}>{product.stock}</span></td>
                                                    </tr>
                                                ))}
                                                {products.length === 0 && <tr><td colSpan="4" className="empty-text">No products yet</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="orders-section">
                            <div className="section-card">
                                <div className="section-header">
                                    <h3>All Orders ({orders.length})</h3>
                                </div>
                                {orders.length === 0 ? (
                                    <p className="empty-text">No orders yet</p>
                                ) : (
                                    <div className="table-wrapper">
                                        <table className="data-table">
                                            <thead>
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
                                                    <tr key={order._id} onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
                                                        <td>{idx + 1}</td>
                                                        <td><code>#{order._id.slice(-6).toUpperCase()}</code></td>
                                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                        <td className="fw-600">{order.customerDetails?.name || '-'}</td>
                                                        <td>{order.customerDetails?.phone || '-'}</td>
                                                        <td>{order.customerDetails?.email || '-'}</td>
                                                        <td><small>{order.customerDetails?.address || '-'}</small></td>
                                                        <td>{order.customerDetails?.city || '-'}</td>
                                                        <td><span className="count-badge">{order.orderItems?.length || 0}</span></td>
                                                        <td>৳{order.subtotal || order.totalAmount}</td>
                                                        <td>৳{order.shippingCost || 0}</td>
                                                        <td className="fw-600 text-success">৳{order.totalAmount}</td>
                                                        <td><span className={`payment-badge ${order.paymentMethod === 'COD' ? 'cod' : 'paid'}`}>{order.paymentMethod || 'COD'}</span></td>
                                                        <td><span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status || 'Pending'}</span></td>
                                                        <td>
                                                            <select
                                                                className="status-select"
                                                                value={order.status}
                                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
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

                    {activeTab === 'products' && (
                        <div className="products-section">
                            <div className="section-card">
                                <div className="section-header">
                                    <h3>All Products ({products.length})</h3>
                                    <button className="btn-primary" onClick={() => { setShowAddProduct(!showAddProduct); setEditingProduct(null); }}>
                                        {showAddProduct || editingProduct ? 'Cancel' : '+ Add Product'}
                                    </button>
                                </div>

                                {(showAddProduct || editingProduct) && (
                                    <form className="product-form" onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                                        <div className="form-grid">
                                            <div className="form-field">
                                                <label>Product Title *</label>
                                                <input type="text" placeholder="e.g. Classic Fit Cotton Shirt"
                                                    value={editingProduct ? editingProduct.title : newProduct.title}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, title: e.target.value}) : setNewProduct({...newProduct, title: e.target.value})}
                                                    required />
                                            </div>
                                            <div className="form-field">
                                                <label>Price (৳) *</label>
                                                <input type="number" placeholder="299"
                                                    value={editingProduct ? editingProduct.price : newProduct.price}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, price: e.target.value}) : setNewProduct({...newProduct, price: e.target.value})}
                                                    required />
                                            </div>
                                            <div className="form-field">
                                                <label>Original Price (৳)</label>
                                                <input type="number" placeholder="499"
                                                    value={editingProduct ? editingProduct.originalPrice : newProduct.originalPrice}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, originalPrice: e.target.value}) : setNewProduct({...newProduct, originalPrice: e.target.value})} />
                                            </div>
                                            <div className="form-field">
                                                <label>Brand</label>
                                                <input type="text" placeholder="e.g. Zara, H&M"
                                                    value={editingProduct ? editingProduct.brand : newProduct.brand}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, brand: e.target.value}) : setNewProduct({...newProduct, brand: e.target.value})} />
                                            </div>
                                            <div className="form-field">
                                                <label>Category</label>
                                                <input type="text" placeholder="e.g. Men, Women"
                                                    value={editingProduct ? editingProduct.category : newProduct.category}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, category: e.target.value}) : setNewProduct({...newProduct, category: e.target.value})} />
                                            </div>
                                            <div className="form-field">
                                                <label>Badge / Tag</label>
                                                <input type="text" placeholder="e.g. NEW, SALE"
                                                    value={editingProduct ? editingProduct.badge : newProduct.badge}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, badge: e.target.value}) : setNewProduct({...newProduct, badge: e.target.value})} />
                                            </div>
                                            <div className="form-field full-width">
                                                <label>Image URL *</label>
                                                <input type="text" placeholder="https://..."
                                                    value={editingProduct ? editingProduct.image : newProduct.image}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, image: e.target.value}) : setNewProduct({...newProduct, image: e.target.value})}
                                                    required />
                                            </div>
                                            <div className="form-field full-width">
                                                <label>Description</label>
                                                <textarea placeholder="Product details..."
                                                    rows="2"
                                                    value={editingProduct ? editingProduct.description : newProduct.description}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct({...newProduct, description: e.target.value})} />
                                            </div>
                                            <div className="form-field">
                                                <label>Colors (comma separated)</label>
                                                <input type="text" placeholder="Red, Blue, Green"
                                                    value={editingProduct ? editingProduct.colors : newProduct.colors}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, colors: e.target.value}) : setNewProduct({...newProduct, colors: e.target.value})} />
                                            </div>
                                            <div className="form-field">
                                                <label>Sizes (comma separated)</label>
                                                <input type="text" placeholder="S, M, L, XL"
                                                    value={editingProduct ? editingProduct.sizes : newProduct.sizes}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, sizes: e.target.value}) : setNewProduct({...newProduct, sizes: e.target.value})} />
                                            </div>
                                            <div className="form-field">
                                                <label>Stock Quantity *</label>
                                                <input type="number" placeholder="100"
                                                    value={editingProduct ? editingProduct.stock : newProduct.stock}
                                                    onChange={(e) => editingProduct ? setEditingProduct({...editingProduct, stock: e.target.value}) : setNewProduct({...newProduct, stock: e.target.value})}
                                                    required />
                                            </div>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn-success">{editingProduct ? 'Update Product' : 'Save Product'}</button>
                                        </div>
                                    </form>
                                )}

                                {products.length === 0 ? (
                                    <p className="empty-text">No products yet. Add your first product!</p>
                                ) : (
                                    <div className="table-wrapper">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Brand</th>
                                                    <th>Category</th>
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
                                                        <td><img src={product.image} alt="" className="table-img" /></td>
                                                        <td className="fw-600">{product.title}</td>
                                                        <td>{product.brand || '-'}</td>
                                                        <td>{product.category || '-'}</td>
                                                        <td>
                                                            <span className="fw-600">৳{product.price}</span>
                                                            {product.originalPrice && <span className="original-price">৳{product.originalPrice}</span>}
                                                        </td>
                                                        <td>
                                                            {product.colors?.length > 0 ? (
                                                                <div className="color-chips">
                                                                    {product.colors.map((c, i) => <span key={i} className="color-chip">{c}</span>)}
                                                                </div>
                                                            ) : '-'}
                                                        </td>
                                                        <td>
                                                            {product.sizes?.length > 0 ? (
                                                                <div className="size-chips">
                                                                    {product.sizes.map((s, i) => <span key={i} className="size-chip">{s}</span>)}
                                                                </div>
                                                            ) : '-'}
                                                        </td>
                                                        <td>
                                                            <span className={`stock-badge ${product.stock > 0 ? 'in' : 'out'}`}>
                                                                {product.stock}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button className="btn-edit" onClick={() => startEditProduct(product)}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                                    </svg>
                                                                </button>
                                                                <button className="btn-delete" onClick={() => deleteProduct(product._id)}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <polyline points="3 6 5 6 21 6"/>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
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
            </main>

            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details</h3>
                            <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="order-detail-grid">
                                <div className="detail-section">
                                    <h4>Customer Info</h4>
                                    <div className="detail-row"><span>Name:</span><strong>{selectedOrder.customerDetails?.name}</strong></div>
                                    <div className="detail-row"><span>Phone:</span><strong>{selectedOrder.customerDetails?.phone}</strong></div>
                                    <div className="detail-row"><span>Email:</span><strong>{selectedOrder.customerDetails?.email || '-'}</strong></div>
                                    <div className="detail-row"><span>Address:</span><strong>{selectedOrder.customerDetails?.address}</strong></div>
                                    <div className="detail-row"><span>City:</span><strong>{selectedOrder.customerDetails?.city || '-'}</strong></div>
                                </div>
                                <div className="detail-section">
                                    <h4>Order Info</h4>
                                    <div className="detail-row"><span>Order ID:</span><code>#{selectedOrder._id.slice(-6).toUpperCase()}</code></div>
                                    <div className="detail-row"><span>Date:</span><strong>{new Date(selectedOrder.createdAt).toLocaleString()}</strong></div>
                                    <div className="detail-row"><span>Payment:</span><strong>{selectedOrder.paymentMethod || 'COD'}</strong></div>
                                    <div className="detail-row"><span>Subtotal:</span><strong>৳{selectedOrder.subtotal || selectedOrder.totalAmount}</strong></div>
                                    <div className="detail-row"><span>Shipping:</span><strong>৳{selectedOrder.shippingCost || 0}</strong></div>
                                    <div className="detail-row total"><span>Total:</span><strong>৳{selectedOrder.totalAmount}</strong></div>
                                </div>
                            </div>

                            <div className="order-items">
                                <h4>Order Items</h4>
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
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
                                                <td>{item.productName || item.title || '-'}</td>
                                                <td>{item.color || '-'}</td>
                                                <td>{item.size || '-'}</td>
                                                <td>৳{item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>৳{item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="status-update">
                                <label>Update Status:</label>
                                <select value={selectedOrder.status} onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            {selectedOrder.orderNotes && (
                                <div className="order-notes">
                                    <h4>Notes</h4>
                                    <p>{selectedOrder.orderNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .dashboard { display: flex; min-height: 100vh; background: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }

                .sidebar { width: 260px; background: #1a1a2e; color: white; display: flex; flex-direction: column; position: fixed; height: 100vh; }
                .sidebar-header { padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .logo { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; }
                .logo svg { color: #4ade80; }

                .sidebar-nav { flex: 1; padding: 16px 12px; }
                .nav-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: none; border: none; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500; border-radius: 10px; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; text-align: left; }
                .nav-item:hover { background: rgba(255,255,255,0.1); color: white; }
                .nav-item.active { background: #4ade80; color: #1a1a2e; }
                .nav-item .badge { margin-left: auto; background: #ef4444; color: white; font-size: 11px; padding: 2px 8px; border-radius: 10px; }
                .nav-item .badge-count { margin-left: auto; background: rgba(255,255,255,0.2); color: white; font-size: 11px; padding: 2px 8px; border-radius: 10px; }

                .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.1); }
                .logout-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; background: none; border: none; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500; border-radius: 10px; cursor: pointer; transition: all 0.2s; }
                .logout-btn:hover { background: rgba(239,68,68,0.2); color: #ef4444; }

                .main-content { flex: 1; margin-left: 260px; }
                .topbar { background: white; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10; }
                .topbar h1 { font-size: 20px; font-weight: 600; color: #1e293b; }
                .date { font-size: 13px; color: #64748b; }

                .content-area { padding: 24px 32px; }

                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
                .stat-card { background: white; border-radius: 14px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .stat-icon.orders { background: #eff6ff; color: #3b82f6; }
                .stat-icon.pending { background: #fef3c7; color: #f59e0b; }
                .stat-icon.delivered { background: #dcfce7; color: #22c55e; }
                .stat-icon.revenue { background: #f3e8ff; color: #a855f7; }
                .stat-info { display: flex; flex-direction: column; }
                .stat-value { font-size: 24px; font-weight: 700; color: #1e293b; }
                .stat-label { font-size: 13px; color: #64748b; }

                .dashboard-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .section-card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .section-header h3 { font-size: 15px; font-weight: 600; color: #1e293b; }
                .view-all { background: none; border: none; color: #3b82f6; font-size: 13px; font-weight: 500; cursor: pointer; }

                .table-wrapper { overflow-x: auto; }
                .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
                .data-table thead { background: #f8fafc; }
                .data-table th { padding: 12px 14px; text-align: left; font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; border-bottom: 1px solid #e5e7eb; }
                .data-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
                .data-table tbody tr:hover { background: #f8fafc; }
                .data-table tbody tr { cursor: pointer; }
                .fw-600 { font-weight: 600; }
                .text-success { color: #22c55e; }
                .table-img { width: 40px; height: 40px; object-fit: cover; border-radius: 8px; }

                .status-badge { font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 500; white-space: nowrap; }
                .status-badge.pending { background: #fef3c7; color: #d97706; }
                .status-badge.processing { background: #dbeafe; color: #2563eb; }
                .status-badge.shipped { background: #e0e7ff; color: #4f46e5; }
                .status-badge.delivered { background: #dcfce7; color: #16a34a; }
                .status-badge.cancelled { background: #fee2e2; color: #dc2626; }

                .count-badge { background: #1a1a2e; color: white; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500; }
                .payment-badge { font-size: 11px; padding: 3px 8px; border-radius: 6px; font-weight: 500; }
                .payment-badge.cod { background: #e0f2fe; color: #0369a1; }
                .payment-badge.paid { background: #dcfce7; color: #16a34a; }

                .status-select { padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 12px; background: white; cursor: pointer; }
                .status-select:focus { outline: none; border-color: #3b82f6; }

                .stock-badge { font-size: 11px; padding: 3px 8px; border-radius: 6px; font-weight: 500; }
                .stock-badge.in { background: #dcfce7; color: #16a34a; }
                .stock-badge.out { background: #fee2e2; color: #dc2626; }

                .original-price { text-decoration: line-through; color: #94a3b8; font-size: 12px; margin-left: 6px; }

                .color-chips, .size-chips { display: flex; gap: 4px; flex-wrap: wrap; }
                .color-chip { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 10px; color: #475569; }
                .size-chip { background: #1a1a2e; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; }

                .action-buttons { display: flex; gap: 6px; }
                .btn-edit, .btn-delete { width: 30px; height: 30px; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .btn-edit { background: #eff6ff; color: #3b82f6; }
                .btn-edit:hover { background: #dbeafe; }
                .btn-delete { background: #fef2f2; color: #ef4444; }
                .btn-delete:hover { background: #fee2e2; }

                .product-form { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
                .form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px; }
                .form-field { display: flex; flex-direction: column; gap: 6px; }
                .form-field.full-width { grid-column: span 4; }
                .form-field label { font-size: 12px; font-weight: 600; color: #475569; }
                .form-field input, .form-field textarea { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; transition: all 0.2s; }
                .form-field input:focus, .form-field textarea:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
                .form-actions { display: flex; gap: 12px; }

                .btn-primary { background: #1a1a2e; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
                .btn-primary:hover { background: #16213e; }
                .btn-success { background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
                .btn-success:hover { background: #16a34a; }

                .empty-text { text-align: center; color: #94a3b8; padding: 40px; font-size: 14px; }

                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
                .modal-content { background: white; border-radius: 16px; width: 90%; max-width: 700px; max-height: 90vh; overflow: auto; }
                .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
                .modal-header h3 { font-size: 18px; font-weight: 600; color: #1e293b; }
                .modal-close { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; }
                .modal-close:hover { color: #475569; }
                .modal-body { padding: 24px; }
                .order-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
                .detail-section h4 { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
                .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
                .detail-row span { color: #64748b; }
                .detail-row strong { color: #1e293b; }
                .detail-row.total { border-bottom: none; background: #f8fafc; margin: 8px -8px -8px; padding: 12px 8px; border-radius: 8px; }
                .detail-row.total strong { color: #22c55e; font-size: 18px; }
                .order-items { margin-bottom: 24px; }
                .order-items h4 { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
                .items-table { width: 100%; border-collapse: collapse; font-size: 13px; }
                .items-table th { background: #f8fafc; padding: 10px 12px; text: left; font-weight: 600; color: #475569; border-bottom: 1px solid #e5e7eb; }
                .items-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
                .status-update { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f8fafc; border-radius: 10px; }
                .status-update label { font-size: 13px; font-weight: 500; color: #475569; }
                .status-update select { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; background: white; }
                .order-notes { margin-top: 16px; padding: 16px; background: #fef3c7; border-radius: 10px; }
                .order-notes h4 { font-size: 13px; font-weight: 600; color: #92400e; margin-bottom: 8px; }
                .order-notes p { font-size: 13px; color: #78350f; }

                .dashboard-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; color: #64748b; }
                .spinner { width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 1200px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .dashboard-sections { grid-template-columns: 1fr; }
                    .form-grid { grid-template-columns: repeat(2, 1fr); }
                    .form-field.full-width { grid-column: span 2; }
                }
                @media (max-width: 768px) {
                    .sidebar { width: 100%; height: auto; position: relative; }
                    .main-content { margin-left: 0; }
                    .stats-grid { grid-template-columns: 1fr; }
                    .order-detail-grid { grid-template-columns: 1fr; }
                    .form-grid { grid-template-columns: 1fr; }
                    .form-field.full-width { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
}
