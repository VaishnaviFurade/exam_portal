const Result = require('../models/result');
const Exam = require('../models/exam');

// ✅ Submit Exam and Calculate Result
exports.submitExam = async (req, res) => {
    const { examId, answers } = req.body;
    const studentId = req.user?.userId;

    if (!examId || !answers || typeof answers !== 'object') {
        return res.status(400).json({ error: 'examId and valid answers object are required.' });
    }

    try {
        // Fetch exam and correct answers
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found.' });
        }

        const correctAnswers = exam.questions.reduce((acc, question) => {
            acc[question._id.toString()] = question.correctAnswer;
            return acc;
        }, {});

        // Score calculation
        let score = 0;
        const total = Object.keys(correctAnswers).length;

        for (const qid in answers) {
            if (
                answers[qid]?.trim().toLowerCase() ===
                correctAnswers[qid]?.trim().toLowerCase()
            ) {
                score++;
            }
        }

        // Save result
        const result = new Result({
            examId,
            studentId,
            answers,
            score,
            total,
        });

        await result.save();

        res.status(201).json({
            message: 'Exam submitted successfully',
            score,
            total
        });
    } catch (error) {
        console.error('Submit Exam Error:', error.message);
        res.status(500).json({ error: 'An error occurred while submitting the exam.' });
    }
};

// ✅ Get My Results (For Students)
exports.getMyResults = async (req, res) => {
    const studentId = req.user?.userId;

    try {
        const results = await Result.find({ studentId }).populate('examId');
        res.status(200).json(results);
    } catch (error) {
        console.error('Get My Results Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching results.' });
    }
};
