import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function StudentDashboard() {
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
                setMessage(res.data.message || 'Welcome, student!');
            } catch (err) {
                setMessage('Unauthorized or error: ' + (err.response?.data?.error || 'Something went wrong'));
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Student Dashboard</h2>
            <p>{message}</p>
            <p>✨ You can view upcoming exams, take exams, and see your results here.</p>
        </div>
    );
}

export default StudentDashboard;
