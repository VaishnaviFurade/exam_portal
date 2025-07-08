import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function Dashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token'); // ✅ Read from localStorage
                
                console.log("Token being sent:", token); // ✅ Debug line

                const res = await axios.get('/exams', {
                    headers: {
                        Authorization: `Bearer ${token}` // ✅ Correct Bearer format
                    }
                });
                setMessage(res.data.message);
            } catch (err) {
                setMessage('Unauthorized or error: ' + (err.response?.data?.error || 'Something went wrong'));
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>{message}</p>
        </div>
    );
}

export default Dashboard;
