import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function ExamListStudent() {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        const fetchExams = async () => {
            const res = await axios.get('/api/exams/all');
            setExams(res.data);
        };
        fetchExams();
    }, []);

    return (
        <div>
            <h2>Available Exams</h2>
            <ul>
                {exams.map(exam => (
                    <li key={exam._id}>
                        {exam.title}
                        <button onClick={() => window.location.href = `/exam/${exam._id}`}>Take Exam</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExamListStudent;
