const express = require("express");
const router = express.Router();

const verifyToken = require('../Middleware/auth');
const { addProduct,
         getProducts, 
         getProductsById, 
         updateProductId, 
         deleteProduct, 
        } = require('../Controllers/product');
        
const { isAdmin } = require("../Middleware/isAdmin");

//Add product (protected)
router.post("/add", verifyToken, isAdmin, addProduct);
router.put('/update/:id', verifyToken, isAdmin, updateProductId);
router.delete('/delete/:id', verifyToken, isAdmin, deleteProduct);

//get product (public)
router.get('/', getProducts);
router.get('/:id', getProductsById);

module.exports = router;