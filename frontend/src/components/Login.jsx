import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';

function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', form);

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('userId', res.data.user._id);
                console.log("User ID stored:", res.data.user._id);

                const role = res.data.user.role;
                if (role === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else if (role === 'student') {
                    window.location.href = '/student-dashboard';
                } else {
                    setMessage('Unknown user role');
                }
            } else {
                localStorage.setItem('otp_username', form.username);
                navigate('/verify-otp');
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row>
                <Col>
                    <Card className="p-4 shadow-lg" style={{ minWidth: '300px' }}>
                        <h3 className="text-center mb-4">Login</h3>
                        {message && <Alert variant="danger">{message}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formUsername" className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="username"
                                    placeholder="Enter username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid mb-3">
                                <Button variant="primary" type="submit">
                                    Login
                                </Button>
                            </div>

                            <div className="text-center">
                                <span>Don't have an account? </span>
                                <Link to="/register">Register here</Link>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
