import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import Proctoring from './Proctoring';

function TakeExam() {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submittedOnce, setSubmittedOnce] = useState(false);

    const requestFullscreen = async () => {
        if (document.fullscreenElement) return;
        try {
            await document.documentElement.requestFullscreen();
        } catch (err) {
            console.error('Fullscreen request failed:', err);
        }
    };

    const handlePasswordSubmit = async () => {
        if (!password) return alert("Please enter the exam password.");
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Step 1: Verify password
            const res = await axios.post(`/exams/verify-password/${examId}`, { password }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const examData = res.data.exam;

            // Step 2: Check if already submitted
            const resultRes = await axios.get('/results/my-results', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const alreadySubmitted = resultRes.data.some(result =>
                result.examId && result.examId._id && String(result.examId._id)  === String(examId)
            );

            if (alreadySubmitted) {
                alert('🛑 You have already attempted this exam. You cannot re-attempt.');
                navigate('/student-dashboard');
                return;
            }

            // Step 3: Allow access to exam
            setExam(examData);
            setPasswordVerified(true);
            setTimeLeft(examData.duration * 60);
            await requestFullscreen();

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Password verification failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!timeLeft) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleAutoSubmit = async () => {
        if (!submittedOnce) {
            alert('⏰ Time is up! Auto-submitting your exam...');
            await confirmSubmit();
        }
    };

    const handleSubmitClick = () => {
        setShowConfirmModal(true);
    };

    const confirmSubmit = async () => {
        if (submittedOnce) return;
        setSubmittedOnce(true);
        setShowConfirmModal(false);
        setSubmitting(true);

        const token = localStorage.getItem('token');
        const payload = { examId, answers };

        console.log('📤 Submitting:', payload);

        try {
            await axios.post('/results/submit', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('✅ Exam submitted successfully!');

            if (document.fullscreenElement && document.exitFullscreen) {
                await document.exitFullscreen();
            }

            navigate('/student-dashboard');
        } catch (err) {
            alert('❌ Submission failed.');
            setSubmittedOnce(false);
        } finally {
            setSubmitting(false);
        }
    };

    const cancelSubmit = () => {
        setShowConfirmModal(false);
    };

    // Re-request fullscreen if user exits it
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !submittedOnce) {
                console.warn('User exited fullscreen. Re-entering...');
                requestFullscreen();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [submittedOnce]);

    // Block Escape key
    useEffect(() => {
        const blockEscapeKey = (e) => {
            if (e.key === 'Escape' && !submittedOnce) {
                e.preventDefault();
                e.stopPropagation();
                console.warn('Escape key blocked.');
            }
        };

        document.addEventListener('keydown', blockEscapeKey);
        return () => document.removeEventListener('keydown', blockEscapeKey);
    }, [submittedOnce]);

    // Disable copy/paste/context menu
    useEffect(() => {
        const disableActions = (e) => e.preventDefault();
        document.addEventListener('copy', disableActions);
        document.addEventListener('paste', disableActions);
        document.addEventListener('contextmenu', disableActions);
        return () => {
            document.removeEventListener('copy', disableActions);
            document.removeEventListener('paste', disableActions);
            document.removeEventListener('contextmenu', disableActions);
        };
    }, []);

    // Prevent tab switching
    useEffect(() => {
        let lastAlertTime = 0;
        let alertShown = false;

        const handleBlur = () => {
            const now = Date.now();
            if (submitting) return;

            if (!alertShown && now - lastAlertTime > 5000) {
                alertShown = true;
                alert('⚠️ Please don’t switch tabs during the exam!');
                lastAlertTime = now;

                setTimeout(() => {
                    alertShown = false;
                }, 2000);
            }
        };

        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, [submitting]);

    if (!passwordVerified) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="text-center p-4 shadow rounded" style={{ maxWidth: '400px', width: '100%', background: '#f8f9fa' }}>
                    <h3 className="mb-4">🔐 Enter Exam Password</h3>
                    <input
                        type="password"
                        className="form-control mb-3"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Exam Password"
                        style={{ padding: '10px' }}
                    />
                    <button
                        className="btn btn-primary w-100"
                        onClick={handlePasswordSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Unlock Exam'}
                    </button>
                    {error && <p className="text-danger mt-3">{error}</p>}
                </div>
            </div>
        );
    } 

    if (!exam || exam.questions.length === 0) {
        return <p className="text-center mt-5">📭 No questions available.</p>;
    }

    return (
        <div className="container py-5">
            <div className="mb-4">
                <Proctoring />
            </div>
            <div className="bg-white p-4 shadow rounded">
                <h2 className="mb-3">{exam.title}</h2>
                <p className="text-muted mb-4"><strong>⏰ Time Left:</strong> {formatTime(timeLeft)}</p>

                <form>
                    {exam.questions.map((q, idx) => (
                        <div key={q._id || idx} className="mb-4">
                            <p className="fw-semibold">Q{idx + 1}: {q.question}</p>
                            {q.options.map((opt, i) => (
                                <div className="form-check" key={i}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`q${q._id}`}
                                        value={opt}
                                        checked={answers[q._id] === opt}
                                        onChange={() => handleChange(q._id, opt)}
                                        required
                                    />
                                    <label className="form-check-label">{opt}</label>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="text-center">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleSubmitClick}
                            style={{ marginTop: '10px', padding: '10px 20px' }}
                        >
              ✅ Submit Exam
                        </button>
                    </div>
                </form>
            </div>

            {showConfirmModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
                >
                    <div className="bg-white p-4 rounded shadow text-center" style={{ maxWidth: '400px', width: '90%' }}>
                        <h5 className="mb-4">Are you sure you want to submit the exam?</h5>
                        <div>
                            <button className="btn btn-success me-3" onClick={confirmSubmit}>✅ Yes, Submit</button>
                            <button className="btn btn-outline-secondary" onClick={cancelSubmit}>❌ Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TakeExam;