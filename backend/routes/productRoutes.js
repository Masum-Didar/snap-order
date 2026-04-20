const express = require('express');
const router = express.Router();
const { getProducts, addProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/add', addProduct); // পরে এখানে সিকিউরিটি অ্যাড করবো

module.exports = router;