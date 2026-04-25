import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Admin API
export const adminAPI = {
    login: (email, password) => api.post('/admin/login', { email, password }),
    getOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}`, { status }),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data)
};

// Product API
export const productAPI = {
    getProducts: () => api.get('/products'),
    getProduct: (id) => api.get(`/products/${id}`),
    addProduct: (data) => api.post('/products/add', data)
};

// Order API
export const orderAPI = {
    createOrder: (orderData) => api.post('/orders', orderData)
};

export default api;