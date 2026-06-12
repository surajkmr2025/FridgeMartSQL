const express = require('express');
const verifyToken = require('../Middleware/auth');
const { addToCart, getUserCart, updateCartItem, removeCartItem } = require('../Controllers/cart');
const router = express.Router();

router.post('/add', verifyToken, addToCart);
router.get('/get', verifyToken, getUserCart);
router.put('/update/:id',verifyToken, updateCartItem);
router.delete('/remove/:id', verifyToken, removeCartItem); // :id = cart row id
module.exports = router;
