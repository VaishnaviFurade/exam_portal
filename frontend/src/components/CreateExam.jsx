import React, { useState } from 'react';
import axios from '../axiosConfig';
import {
    Container,
    Card,
    Button,
    Form,
    Row,
    Col,
    Alert
} from 'react-bootstrap';

function CreateExam() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(30);
    const [password, setPassword] = useState('');
    const [questions, setQuestions] = useState([
        { question: '', options: ['', '', '', ''], answer: '' }
    ]);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const createdBy = localStorage.getItem('userId');

        if (!createdBy) return alert('❌ User not authenticated. Please log in again.');
        if (duration < 1) return alert('❌ Duration must be at least 1 minute.');
        if (questions.length === 0) return alert('❌ At least one question is required.');

        try {
            const token = localStorage.getItem('token');

            await axios.post(
                '/exams/create',
                { title, description, duration, password, questions, createdBy },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage('✅ Exam created successfully!');
            setTitle('');
            setDescription('');
            setDuration(30);
            setPassword('');
            setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
        } catch (error) {
            console.error('Create Exam Error:', error.response?.data || error.message);
            alert(error.response?.data?.error || '❌ Error creating exam');
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions.length > 0 ? newQuestions : [
            { question: '', options: ['', '', '', ''], answer: '' }
        ]);
    };

    return (
        <Container className="py-4">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-3">📝 Create New Exam</Card.Title>

                    {message && <Alert variant="success">{message}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Exam Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Exam Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Control
                                    type="number"
                                    placeholder="Duration (mins)"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    min={1}
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Set Exam Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Col>
                        </Row>

                        {questions.map((q, i) => (
                            <Card key={i} className="mb-4">
                                <Card.Body>
                                    <Card.Subtitle className="mb-3">
                                        🧾 Question {i + 1}
                                    </Card.Subtitle>

                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter question"
                                            value={q.question}
                                            onChange={(e) =>
                                                handleQuestionChange(i, 'question', e.target.value)
                                            }
                                            required
                                        />
                                    </Form.Group>

                                    {q.options.map((opt, j) => (
                                        <Form.Group key={j} className="mb-2">
                                            <Form.Control
                                                type="text"
                                                placeholder={`Option ${j + 1}`}
                                                value={opt}
                                                onChange={(e) =>
                                                    handleOptionChange(i, j, e.target.value)
                                                }
                                                required
                                            />
                                        </Form.Group>
                                    ))}

                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Correct Answer"
                                            value={q.answer}
                                            onChange={(e) =>
                                                handleQuestionChange(i, 'answer', e.target.value)
                                            }
                                            required
                                        />
                                    </Form.Group>

                                    {questions.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeQuestion(i)}
                                        >
                                            ❌ Delete Question
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}

                        <div className="d-grid gap-2">
                            <Button
                                variant="info"
                                type="button"
                                onClick={addQuestion}
                            >
                                ➕ Add Question
                            </Button>

                            <Button
                                variant="primary"
                                type="submit"
                            >
                                🚀 Create Exam
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CreateExam;
