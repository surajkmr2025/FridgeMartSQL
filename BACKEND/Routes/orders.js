const express = require("express");
const { 
    checkOut, 
    getUserOrders, 
    getOrderById, 
    cancelOrder, 
    updateOrderStatus, 
    allOrders 
    } = require("../Controllers/orders");
    
const verifyToken = require("../Middleware/auth");
const { isAdmin } = require("../Middleware/isAdmin");
const router = express.Router();

router.post('/checkout', verifyToken ,checkOut);
router.get('/get-orders', verifyToken, getUserOrders);
router.get('/get-order/:orderId', verifyToken, getOrderById);
router.patch('/cancel/:orderId', verifyToken, cancelOrder);
router.put('/update/:orderId', verifyToken, isAdmin, updateOrderStatus);
router.get('/all-orders/', verifyToken, isAdmin, allOrders);
module.exports = router;