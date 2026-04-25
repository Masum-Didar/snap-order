const express = require('express');
const router = express.Router();
const { adminLogin, getOrders, updateOrderStatus, deleteProduct, updateProduct } = require('../controllers/adminController');

router.post('/login', adminLogin);
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrderStatus);
router.delete('/products/:id', deleteProduct);
router.put('/products/:id', updateProduct);

module.exports = router;