import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import OTPVerification from './components/OTPVerification';
import PrivateRoute from './components/PrivateRoute';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // contains role

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-otp" element={<OTPVerification />} />

                {/* Protected student dashboard */}
                <Route
                    path="/student-dashboard"
                    element={
                        <PrivateRoute>
                            <StudentDashboard />
                        </PrivateRoute>
                    }
                />

                {/* Protected admin dashboard */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <PrivateRoute>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<p>404 Not Found</p>} />
            </Routes>
        </Router>
    );
}

export default App;
