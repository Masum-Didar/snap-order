import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('snaporder_cart');
        if (saved) setCartItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('snaporder_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, color, size, quantity = 1) => {
        const variantKey = `${product._id}-${color}-${size}`;
        const existing = cartItems.find(item => item.variantKey === variantKey);

        if (existing) {
            setCartItems(cartItems.map(item =>
                item.variantKey === variantKey
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCartItems([...cartItems, {
                variantKey,
                productId: product._id,
                productCode: product.productCode || '',
                productName: product.title,
                productImage: product.image,
                productBrand: product.brand || '',
                productCategory: product.category || '',
                color,
                size,
                price: product.price,
                originalPrice: product.originalPrice || 0,
                discount: product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0,
                quantity,
                maxStock: product.stock,
                availableColors: product.colors || [],
                availableSizes: product.sizes || []
            }]);
        }
    };

    const updateQuantity = (variantKey, quantity) => {
        if (quantity < 1) {
            removeFromCart(variantKey);
            return;
        }
        setCartItems(cartItems.map(item =>
            item.variantKey === variantKey ? { ...item, quantity } : item
        ));
    };

    const updateVariant = (variantKey, newColor, newSize) => {
        const newVariantKey = `${variantKey.split('-')[0]}-${newColor}-${newSize}`;
        const existing = cartItems.find(item => item.variantKey === newVariantKey);

        if (existing) {
            setCartItems(cartItems.map(item =>
                item.variantKey === variantKey
                    ? null
                    : item.variantKey === newVariantKey
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
            ).filter(Boolean));
        } else {
            setCartItems(cartItems.map(item =>
                item.variantKey === variantKey
                    ? { ...item, color: newColor, size: newSize, variantKey: newVariantKey }
                    : item
            ));
        }
    };

    const removeFromCart = (variantKey) => {
        setCartItems(cartItems.filter(item => item.variantKey !== variantKey));
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems, showCart, setShowCart,
            addToCart, updateQuantity, updateVariant, removeFromCart, clearCart,
            totalItems, totalAmount
        }}>
            {children}
        </CartContext.Provider>
    );
};
