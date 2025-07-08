import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

function Result() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/results/my-results', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(res.data);
        };
        fetchResults();
    }, []);

    return (
        <div>
            <h2>My Results</h2>
            {results.length === 0 ? (
                <p>No results found</p>
            ) : (
                <ul>
                    {results.map((r, i) => (
                        <li key={i}>
                            {r.examId.title} - Score: {r.score} / {r.total}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Result;
