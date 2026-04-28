import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import CartDrawer from './components/CartDrawer.jsx';

function App() {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Routes>
                <CartDrawer />
            </Router>
        </CartProvider>
    );
}

export default App;
