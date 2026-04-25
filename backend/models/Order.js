const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    // Product Reference
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },

    // Product Basic Info
    productCode: String,
    productName: String,
    productImage: String,
    productBrand: String,
    productCategory: String,

    // Variant Info
    color: String,
    size: String,

    // Pricing
    price: Number,
    originalPrice: Number,
    discount: Number,

    // Quantity
    quantity: { type: Number, default: 1 }
}, { _id: true });

const orderSchema = new mongoose.Schema({
    // Customer Info
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: String,
        address: { type: String, required: true },
        city: String,
        postalCode: String
    },

    // Order Items
    orderItems: [orderItemSchema],

    // Order Summary
    subtotal: Number,
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Payment Info
    paymentMethod: { type: String, default: 'COD' },
    paymentStatus: { type: String, default: 'Unpaid' },

    // Order Status
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },

    // Order Notes
    orderNotes: String,

    // Timestamps
    orderDate: { type: Date, default: Date.now },
    deliveredDate: Date

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
