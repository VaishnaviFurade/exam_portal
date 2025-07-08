import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

function TakeExam() {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExam = async () => {
            const res = await axios.get(`/api/exams/${examId}`);
            setExam(res.data);
        };
        fetchExam();
    }, [examId]);

    const handleChange = (qIndex, value) => {
        setAnswers({ ...answers, [qIndex]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('/api/results/submit', {
                examId,
                answers
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Exam submitted!');
            navigate('/dashboard');
        } catch (err) {
            alert('Submission failed');
        }
    };

    if (!exam) return <p>Loading exam...</p>;

    return (
        <div>
            <h2>{exam.title}</h2>
            <form onSubmit={handleSubmit}>
                {exam.questions.map((q, idx) => (
                    <div key={idx}>
                        <p>{q.question}</p>
                        {q.options.map((opt, i) => (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name={`q${idx}`}
                                    value={opt}
                                    checked={answers[idx] === opt}
                                    onChange={() => handleChange(idx, opt)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default TakeExam;
