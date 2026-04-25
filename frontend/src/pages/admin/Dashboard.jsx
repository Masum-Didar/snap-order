import { useState, useEffect } from 'react';
import { adminAPI, productAPI } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    // New product form state
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        image: '',
        stock: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
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
                stock: Number(newProduct.stock)
            };
            await productAPI.addProduct(productData);
            setShowAddProduct(false);
            setNewProduct({ title: '', price: '', description: '', image: '', stock: '' });
            fetchData();
        } catch (err) {
            console.error('Add product error:', err);
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

    if (loading) {
        return <div className="text-center mt-5"><h4>Loading...</h4></div>;
    }

    return (
        <div className="min-vh-100 bg-light">
            {/* Header */}
            <nav className="navbar navbar-dark bg-primary px-4">
                <span className="navbar-brand mb-0 h1">SnapOrder Admin</span>
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </nav>

            <div className="container-fluid py-4">
                {/* Tabs */}
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
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Customer</th>
                                                <th>Phone</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>{order.customerDetails?.name}</td>
                                                    <td>{order.customerDetails?.phone}</td>
                                                    <td>{order.orderItems?.length}</td>
                                                    <td>৳{order.totalAmount}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            order.status === 'Delivered' ? 'bg-success' :
                                                            order.status === 'Pending' ? 'bg-warning' : 'bg-secondary'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                            style={{ width: '130px' }}
                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Processing">Processing</option>
                                                            <option value="Delivered">Delivered</option>
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

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">All Products</h5>
                                <button className="btn btn-primary" onClick={() => setShowAddProduct(!showAddProduct)}>
                                    {showAddProduct ? 'Cancel' : '+ Add Product'}
                                </button>
                            </div>

                            {/* Add Product Form */}
                            {showAddProduct && (
                                <div className="card bg-light mb-4">
                                    <div className="card-body">
                                        <h6>Add New Product</h6>
                                        <form onSubmit={handleAddProduct}>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control" placeholder="Product Title"
                                                        value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} required />
                                                </div>
                                                <div className="col-md-3">
                                                    <input type="number" className="form-control" placeholder="Price"
                                                        value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
                                                </div>
                                                <div className="col-md-3">
                                                    <input type="number" className="form-control" placeholder="Stock"
                                                        value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
                                                </div>
                                                <div className="col-12">
                                                    <input type="text" className="form-control" placeholder="Image URL"
                                                        value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} required />
                                                </div>
                                                <div className="col-12">
                                                    <textarea className="form-control" placeholder="Description" rows="2"
                                                        value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-success">Save Product</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {products.length === 0 ? (
                                <p className="text-muted">No products yet</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Stock</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id}>
                                                    <td><img src={product.image} alt={product.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /></td>
                                                    <td>{product.title}</td>
                                                    <td>৳{product.price}</td>
                                                    <td>{product.stock}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product._id)}>Delete</button>
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