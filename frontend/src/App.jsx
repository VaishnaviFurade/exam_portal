import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import OTPVerification from './components/OTPVerification';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';

import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import CreateExam from './components/CreateExam';
import AllExams from './components/AllExams';
import AdminResults from './components/AdminResults';
import AdminAllExams from './components/AdminAllExams';
import ViewExamDetails from './components/ViewExamDetails';
import TakeExam from './components/TakeExam';
import Result from './components/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/take-exam/:examId"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <TakeExam />
            </PrivateRoute>
          }
        />
        <Route
          path="/view-results"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Result />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-exam"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <CreateExam />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-results"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminResults />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-all-exams"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminAllExams />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-exam-details/:examId"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <ViewExamDetails />
            </PrivateRoute>
          }
        />

        {/* Shared (Student/Admin) */}
        <Route
          path="/all-exams"
          element={
            <PrivateRoute allowedRoles={['student', 'admin']}>
              <AllExams />
            </PrivateRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<p className="text-center mt-5">404 - Page Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
