const Product = require('../models/Product');

// সব প্রোডাক্ট দেখার জন্য (কাস্টমার ও অ্যাডমিন উভয়ের জন্য)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// নতুন প্রোডাক্ট অ্যাড করার জন্য
exports.addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};