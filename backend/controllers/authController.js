const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/sendOTP');

// ✅ User Registration
exports.register = async (req, res) => {

    try {
        const { username, email, password, role } = req.body;

        if (!role || !username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

        const newUser = new User({
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role
            // No `name` field set — and it's now optional in the model
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(400).json({ success: false, error: error.message || 'Registration failed' });
    }
};


// ✅ Login Step 1 - Username & Password
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await User.findOne({ username: username.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // ✅ Admin login (no OTP)
        if (user.role === 'admin') {
            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                message: 'Admin login successful',
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        }

        // ✅ Student or Examiner - Send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        await sendOTP(user.email, otp);
        res.status(200).json({ message: 'OTP sent to registered email' });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server Error during login' });
    }
};

// ✅ Login Step 2 - Verify OTP and Return JWT
exports.verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body;

        if (!username || !otp) {
            return res.status(400).json({ error: 'Username and OTP are required' });
        }

        const user = await User.findOne({ username: username.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isOTPValid = user.otp === otp && Date.now() <= user.otpExpiry;
        if (!isOTPValid) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        await User.updateOne(
            { _id: user._id },
            { $unset: { otp: "", otpExpiry: "" } }
        );

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ error: 'Server Error during OTP verification' });
    }
};
