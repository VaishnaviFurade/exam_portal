import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function AdminDashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/exams', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessage(res.data.message || 'Welcome, admin!');
            } catch (err) {
                setMessage('Unauthorized or error: ' + (err.response?.data?.error || 'Something went wrong'));
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <p>{message}</p>
            <p>🛠️ Here you can create exams and view all student submissions.</p>
        </div>
    );
}

export default AdminDashboard;
