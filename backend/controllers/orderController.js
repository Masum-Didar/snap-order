const Order = require('../models/Order');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
    try {
        const { name, phone, address, orderItems, totalAmount } = req.body;

        // 1. Check if user exists by phone
        let user = await User.findOne({ phone });

        if (user) {
            // Update existing user info
            user.name = name;
            user.address = address;
            await user.save();
        } else {
            // Create new user
            user = await User.create({ name, phone, address });
        }

        // 2. Create the Order
        const newOrder = new Order({
            userId: user._id,
            customerDetails: { name, phone, address },
            orderItems,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order Placed!", order: newOrder });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};