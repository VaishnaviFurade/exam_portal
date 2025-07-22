import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';

function ViewExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/exams/${examId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setExam(res.data.exam);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch exam details');
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-4 text-center">{error}</Alert>;
  }

  if (!exam) {
    return <p className="text-center mt-4">No exam found.</p>;
  }

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
        ⬅️ Go Back
      </Button>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h3 className="text-center text-primary mb-3">{exam.title}</h3>
          <p className="text-center"><strong>Description:</strong> {exam.description}</p>
          <p className="text-center">
            <Badge bg="info" pill>Duration: {exam.duration} min</Badge>
          </p>

          {exam.plainPassword && (
            <p className="text-center">
              <Badge bg="danger">Password: {exam.plainPassword}</Badge>
            </p>
          )}
        </Card.Body>
      </Card>

      {exam.questions && exam.questions.length > 0 ? (
        <div>
          <h5 className="mb-4">Questions:</h5>
          {exam.questions.map((q, idx) => (
            <Card key={idx} className="mb-3 shadow-sm border-0">
              <Card.Body>
                <Card.Title>
                  <span className="fw-semibold">Q{idx + 1}:</span> {q.question}
                </Card.Title>
                <ul className="mt-3 ps-3">
                  {q.options.map((opt, i) => (
                    <li key={i} className="mb-1">
                      {opt === q.answer ? (
                        <span className="text-success fw-bold">
                          {opt} ✅
                        </span>
                      ) : (
                        <span>{opt}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center">No questions found.</p>
      )}
    </Container>
  );
}

export default ViewExamDetails;
