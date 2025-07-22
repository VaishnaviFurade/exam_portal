const Result = require('../models/result');
const Exam = require('../models/exam');

// ✅ Submit Exam and Calculate Result
exports.submitExam = async (req, res) => {
    const { examId, answers } = req.body;
    const studentId = req.user?.userId;

    // Debug log for backend
    console.log('📥 SUBMIT PAYLOAD:', {
        examId,
        studentId,
        answers,
        answerKeys: answers ? Object.keys(answers) : [],
    });

    // ✅ Input validation
    if (!examId) {
        return res.status(400).json({ error: 'Missing examId in request.' });
    }
    if (!answers || typeof answers !== 'object' || Object.keys(answers).length === 0) {
        return res.status(400).json({ error: 'Answers object is missing or empty.' });
    }

    try {
        // ✅ Prevent duplicate submissions
        const existingResult = await Result.findOne({ examId, studentId });
        if (existingResult) {
            return res.status(400).json({ error: 'You have already attempted this exam.' });
        }

        // ✅ Fetch exam and validate
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found.' });
        }

        // ✅ Build answer key
        const correctAnswers = {};
        exam.questions.forEach(q => {
            correctAnswers[q._id.toString()] = q.answer;
        });

        // ✅ Score calculation
        let score = 0;
        const total = exam.questions.length;

        for (const qid in answers) {
            const submitted = answers[qid]?.trim().toLowerCase();
            const correct = correctAnswers[qid]?.trim().toLowerCase();
            if (submitted === correct) {
                score++;
            }
        }

        // ✅ Save result
        const result = new Result({
            examId,
            studentId,
            answers,
            score,
            total,
            submittedAt: new Date(),
        });

        await result.save();

        res.status(201).json({
            message: '✅ Exam submitted successfully',
            score,
            total,
        });
    } catch (error) {
        console.error('❌ Submit Exam Error:', error);
        res.status(500).json({ error: 'An error occurred while submitting the exam.' });
    }
};

// ✅ Get My Results (For Students)
exports.getMyResults = async (req, res) => {
    const studentId = req.user?.userId;

    try {
        const results = await Result.find({ studentId }).populate({
            path: 'examId',
            select: 'title questions',
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('❌ Get My Results Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching results.' });
    }
};


// Add this at the end of the file

// ✅ Admin: Get all submitted results
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('examId', 'title') // populate exam title
      .populate('studentId', 'username email'); // populate student info

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching all results:', error);
    res.status(500).json({ error: 'Failed to load results' });
  }
};
