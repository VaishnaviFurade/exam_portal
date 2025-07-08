import React, { useState } from 'react';
import axios from '../axiosConfig';

function CreateExam() {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/exams/create', { title, questions }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Exam created successfully!');
        } catch (error) {
            alert('Error creating exam');
        }
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field === 'question') newQuestions[index].question = value;
        if (field === 'answer') newQuestions[index].answer = value;
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

    return (
        <div>
            <h2>Create New Exam</h2>
            <form onSubmit={handleSubmit}>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Exam Title" required />
                {questions.map((q, i) => (
                    <div key={i}>
                        <input value={q.question} onChange={e => handleQuestionChange(i, 'question', e.target.value)} placeholder="Question" />
                        {q.options.map((opt, j) => (
                            <input key={j} value={opt} onChange={e => handleOptionChange(i, j, e.target.value)} placeholder={`Option ${j + 1}`} />
                        ))}
                        <input value={q.answer} onChange={e => handleQuestionChange(i, 'answer', e.target.value)} placeholder="Correct Answer" />
                    </div>
                ))}
                <button type="button" onClick={addQuestion}>Add Question</button>
                <button type="submit">Create Exam</button>
            </form>
        </div>
    );
}

export default CreateExam;
