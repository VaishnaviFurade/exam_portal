import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  Form,
  Row,
  Col,
} from 'react-bootstrap';

function AllExams() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/exams/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExams(res.data.exams || []);
        setFilteredExams(res.data.exams || []);
      } catch (err) {
        setError('Failed to fetch exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    let results = exams;

    if (searchTerm.trim() !== '') {
      const lower = searchTerm.toLowerCase();
      results = results.filter(
        (exam) =>
          exam.title.toLowerCase().includes(lower) ||
          exam.description.toLowerCase().includes(lower)
      );
    }

    if (filterDuration !== '') {
      results = results.filter((exam) => exam.duration === parseInt(filterDuration));
    }

    setFilteredExams(results);
  }, [searchTerm, filterDuration, exams]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📋 Available Exams</h2>

      {/* 🔍 Search and ⏳ Filter */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6} className="mb-2">
              <Form.Control
                type="text"
                placeholder="🔍 Search by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={4} className="mb-2">
              <Form.Select
                value={filterDuration}
                onChange={(e) => setFilterDuration(e.target.value)}
              >
                <option value="">⏳ Filter by duration</option>
                <option value="1">1 min</option>
                <option value="5">5 mins</option>
                <option value="10">10 mins</option>
                <option value="30">30 mins</option>
                <option value="60">1 hour</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mb-2 text-md-end">
              <Button
                variant="secondary"
                className="w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterDuration('');
                }}
              >
                🔄 Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filteredExams.length === 0 ? (
        <Alert variant="info" className="text-center">
          No exams match your search or filter.
        </Alert>
      ) : (
        filteredExams.map((exam) => (
          <Card key={exam._id} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-2">{exam.title}</Card.Title>
              <Card.Text>{exam.description}</Card.Text>
              <Card.Text>
                <strong>Duration:</strong> {exam.duration} minutes
              </Card.Text>

              {user?.role === 'admin' ? (
                <Button
                  variant="primary"
                  onClick={() => navigate(`/admin-exam-details/${exam._id}`)}
                >
                  👁️ Admin Preview
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => navigate(`/take-exam/${exam._id}`)}
                >
                  📝 Take Exam
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default AllExams;
