const Order = require('../models/Order');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
    try {
        const { customerDetails, orderItems, subtotal, shippingCost, totalAmount, paymentMethod, orderNotes } = req.body;

        // 1. Check if user exists by phone
        let user = await User.findOne({ phone: customerDetails.phone });

        if (user) {
            user.name = customerDetails.name;
            user.address = customerDetails.address;
            if (customerDetails.email) user.email = customerDetails.email;
            if (customerDetails.city) user.city = customerDetails.city;
            await user.save();
        } else {
            user = await User.create({
                name: customerDetails.name,
                phone: customerDetails.phone,
                email: customerDetails.email,
                address: customerDetails.address,
                city: customerDetails.city,
                postalCode: customerDetails.postalCode
            });
        }

        // 2. Enrich orderItems with full product info
        const enrichedItems = orderItems.map(item => ({
            productId: item.productId,
            productCode: item.productCode || '',
            productName: item.productName || item.title || '',
            productImage: item.productImage || '',
            productBrand: item.productBrand || '',
            productCategory: item.productCategory || '',
            color: item.color || '',
            size: item.size || '',
            price: item.price || 0,
            originalPrice: item.originalPrice || 0,
            discount: item.discount || 0,
            quantity: item.quantity || 1
        }));

        // 3. Create the Order
        const newOrder = new Order({
            userId: user._id,
            customerDetails: {
                name: customerDetails.name,
                phone: customerDetails.phone,
                email: customerDetails.email || '',
                address: customerDetails.address,
                city: customerDetails.city || '',
                postalCode: customerDetails.postalCode || ''
            },
            orderItems: enrichedItems,
            subtotal: subtotal || totalAmount,
            shippingCost: shippingCost || 0,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: 'Unpaid',
            status: 'Pending',
            orderNotes: orderNotes || ''
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order Placed!", order: newOrder });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name phone email address').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus, orderNotes } = req.body;
        const updateData = {};
        if (status) {
            updateData.status = status;
            if (status === 'Delivered') updateData.deliveredDate = new Date();
        }
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (orderNotes) updateData.orderNotes = orderNotes;

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
