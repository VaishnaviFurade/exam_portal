// src/pages/AdminResults.jsx

import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Table, Spinner, Alert, Container, Card } from 'react-bootstrap';

function AdminResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/results/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Error fetching results');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-4">📊 All Student Submissions</Card.Title>

                    {loading && (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading results...</p>
                        </div>
                    )}

                    {error && <Alert variant="danger">{error}</Alert>}

                    {!loading && !error && results.length === 0 && (
                        <Alert variant="info">No submissions found.</Alert>
                    )}

                    {!loading && results.length > 0 && (
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>Student</th>
                                    <th>Email</th>
                                    <th>Exam</th>
                                    <th>Score</th>
                                    <th>Total</th>
                                    <th>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r) => (
                                    <tr key={r._id}>
                                        <td>{r.studentId?.username}</td>
                                        <td>{r.studentId?.email}</td>
                                        <td>{r.examId?.title}</td>
                                        <td>{r.score}</td>
                                        <td>{r.total}</td>
                                        <td>{new Date(r.submittedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminResults;
