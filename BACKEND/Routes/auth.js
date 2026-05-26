const express = require("express");
const router = express.Router();

// controllers import
const { signup, login, logout, forgotPassword, resetPassword } = require("../Controllers/auth");


// ================= AUTH ROUTES =================

// Signup Route

router.post("/signup", signup);

// Login Route
router.post("/login", login);

//Logout Route
router.post('/logout', logout);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password', resetPassword);

module.exports = router;