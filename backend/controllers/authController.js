const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/sendOTP');

// ✅ User Registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Server Error during registration' });
    }
};

// ✅ Login Step 1 - Validate Credentials, Generate OTP or Token
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // 🔐 Admin: bypass OTP and directly return token
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
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        }

        // 👤 Student: send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // valid for 5 minutes
        await user.save();

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

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isOTPValid = user.otp === otp && Date.now() <= user.otpExpiry;
        if (!isOTPValid) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Clear OTP after verification
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
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
