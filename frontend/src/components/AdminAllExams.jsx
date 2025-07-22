import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    Spinner,
    Alert,
    Button,
    Form,
    Row,
    Col,
} from 'react-bootstrap';

function AdminAllExams() {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDuration, setFilterDuration] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/exams/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExams(res.data.exams || []);
                setFilteredExams(res.data.exams || []);
            } catch (err) {
                setError('Error fetching exams');
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    useEffect(() => {
        let results = exams;

        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            results = results.filter(exam =>
                exam.title.toLowerCase().includes(lowerSearch) ||
                exam.description.toLowerCase().includes(lowerSearch)
            );
        }

        if (filterDuration !== '') {
            results = results.filter(exam =>
                exam.duration === parseInt(filterDuration)
            );
        }

        setFilteredExams(results);
    }, [searchTerm, filterDuration, exams]);

    const handleDelete = async (examId) => {
        if (!window.confirm("Are you sure you want to delete this exam?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/exams/${examId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updated = exams.filter(exam => exam._id !== examId);
            setExams(updated);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to delete exam');
        }
    };

    if (loading) return (
        <Container className="text-center mt-5">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    if (error) return (
        <Container className="mt-4">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">🧾 All Exams</h2>

            {/* Search & Filter Controls */}
            <Card className="mb-4 shadow-sm p-3">
                <Row className="g-3">
                    <Col md={6}>
                        <Form.Control
                            type="text"
                            placeholder="🔍 Search by title or description"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
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
                    <Col md={2}>
                        <Button
                            variant="outline-secondary"
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
            </Card>

            {/* Exam List */}
            {filteredExams.length === 0 ? (
                <p className="text-muted text-center">No exams match the current filter.</p>
            ) : (
                filteredExams.map((exam) => (
                    <Card key={exam._id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>{exam.title}</Card.Title>
                            <Card.Text className="text-muted">{exam.description}</Card.Text>
                            <Card.Text><strong>Duration:</strong> {exam.duration} mins</Card.Text>
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/admin-exam-details/${exam._id}`)}
                                >
                                    🔍 View
                                </Button>
                                <Button
                                    variant="danger"
                                    className="ms-2"
                                    onClick={() => handleDelete(exam._id)}
                                >
                                    🗑️ Delete
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
}

export default AdminAllExams;
