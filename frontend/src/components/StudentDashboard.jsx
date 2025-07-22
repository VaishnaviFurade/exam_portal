import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function StudentDashboard() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWelcome = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get('/exams', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = JSON.parse(localStorage.getItem('user'));
        const name = user?.username || 'Student';
        setMessage(`👋 Welcome, ${name}!`);
      } catch (err) {
        setMessage('❌ Unauthorized: ' + (err.response?.data?.error || 'Something went wrong.'));
      } finally {
        setLoading(false);
      }
    };

    fetchWelcome();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <Card.Title className="text-center mb-4 fs-3 fw-bold text-primary">🎓 Student Dashboard</Card.Title>

              {message.startsWith('❌') ? (
                <Alert variant="danger" className="text-center">
                  {message}
                </Alert>
              ) : (
                <Alert variant="success" className="text-center">
                  {message}
                </Alert>
              )}

              <p className="text-center text-muted mb-4">
                ✨ You can view upcoming exams, take exams, and check your results here.
              </p>

              <div className="d-grid gap-3 mt-4">
                <Button variant="outline-primary" size="lg" onClick={() => navigate('/all-exams')}>
                  📝 Take Exam
                </Button>
                <Button variant="outline-success" size="lg" onClick={() => navigate('/view-results')}>
                  📊 View My Results
                </Button>
                <Button variant="outline-danger" size="lg" onClick={handleLogout}>
                  🚪 Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentDashboard;
