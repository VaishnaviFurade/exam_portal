import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Container, Table, Alert, Spinner, Card } from 'react-bootstrap';

function Result() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/results/my-results', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (err) {
                console.error('Error fetching results:', err);
                setError('❌ Failed to load results');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    return (
        <Container className="py-5">
            <Card className="shadow-lg border-0">
                <Card.Body>
                    <h2 className="mb-4 text-center text-primary">📊 My Exam Results</h2>

                    {loading && (
                        <div className="text-center my-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}

                    {error && (
                        <Alert variant="danger" className="text-center">
                            {error}
                        </Alert>
                    )}

                    {!loading && results.length === 0 && (
                        <Alert variant="info" className="text-center">
                            No results found.
                        </Alert>
                    )}

                    {!loading && results.length > 0 && (
                        <Table striped bordered hover responsive className="text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Exam Title</th>
                                    <th>Score</th>
                                    <th>Total</th>
                                    <th>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r, index) => (
                                    <tr key={r._id}>
                                        <td>{index + 1}</td>
                                        <td>{r.examId?.title || 'Untitled Exam'}</td>
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

export default Result;
