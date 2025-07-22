const express = require('express');
const router = express.Router();

// Destructure controller functions
const { register, login, verifyOTP } = require('../controllers/authController');

// Auth Routes
router.post('/register', register);     // 🆕 Register new user
router.post('/login', login);           // 🔐 Login existing user
router.post('/verify-otp', verifyOTP);  // ✅ OTP Verification

module.exports = router;
