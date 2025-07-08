import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function OTPVerification() {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const username = localStorage.getItem('otp_username');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/verify-otp', { username, otp });

            // Store full user info and token
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user)); // includes role
            localStorage.removeItem('otp_username');

            setMessage('Login successful!');

            // ✅ Redirect based on role
            const role = res.data.user.role;
            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'OTP verification failed');
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Verify</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default OTPVerification;
