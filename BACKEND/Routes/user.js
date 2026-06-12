const express = require('express');
const verifyToken = require('../Middleware/auth');
const { isAdmin } = require('../Middleware/isAdmin');
const { getUserProfile, 
        updateUserProfile, 
        updatePassword, 
        getAllUsers 
    } = require('../Controllers/user');
    
const router = express.Router();

router.get('/get', verifyToken, getUserProfile);
router.put('/update', verifyToken, updateUserProfile);
router.put('/change-password', verifyToken, updatePassword);

// Admin only — get all users
router.get('/all-users', verifyToken, isAdmin, getAllUsers);

module.exports = router;
