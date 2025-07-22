import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { Container, Row, Col, Button, Alert, Card } from 'react-bootstrap';

function AdminDashboard() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/exams/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessage(res.data.message || 'Welcome, Admin!');
            } catch (err) {
                setMessage('Unauthorized or error: ' + (err.response?.data?.error || 'Something went wrong'));
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow-lg rounded">
                <h2 className="text-center mb-4">Admin Dashboard</h2>
                <Alert variant="info">{message}</Alert>
                <p className="text-muted text-center mb-4">
                    🛠️ Here you can create exams and view all student submissions.
                </p>

                <Row className="justify-content-center">
                    <Col xs="auto" className="mb-2">
                        <Button variant="primary" onClick={() => navigate('/create-exam')}>
                            ➕ Create Exam
                        </Button>
                    </Col>
                    <Col xs="auto" className="mb-2">
                        <Button variant="success" onClick={() => navigate('/admin-all-exams')}>
                            📄 View All Exams
                        </Button>
                    </Col>
                    <Col xs="auto" className="mb-2">
                        <Button variant="warning" onClick={() => navigate('/admin-results')}>
                            📊 View All Student Results
                        </Button>
                    </Col>
                    <Col xs="auto" className="mb-2">
                        <Button variant="danger" onClick={handleLogout}>
                            🚪 Logout
                        </Button>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default AdminDashboard;
