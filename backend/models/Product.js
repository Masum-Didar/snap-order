const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    description: String,
    image: { type: String, required: true },
    brand: String,
    category: String,
    badge: String,
    colors: [String],
    sizes: [String],
    stock: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
