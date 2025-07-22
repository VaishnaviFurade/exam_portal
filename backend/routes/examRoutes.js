const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Exam = require('../models/exam');

const {
  createExam,
  getMyExams,
  getAllExams,
  getExamById
} = require('../controllers/examController');

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// ✅ Auth check
router.get('/', authMiddleware, (req, res) => {
  res.status(200).json({ message: `✅ Welcome ${req.user.role}, you're authorized.` });
});

// ✅ Create exam (admin only)
router.post('/create', authMiddleware, isAdmin, createExam);

// ✅ Get exams created by logged-in user (admin only)
router.get('/my-exams', authMiddleware, isAdmin, getMyExams);

// ✅ Get all exams (for listing purposes – available to all authenticated users)
router.get('/all', authMiddleware, getAllExams);

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

router.post('/verify-password/:examId', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    const { examId } = req.params;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const isMatch = await bcrypt.compare(password, exam.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid exam password' });

    const examObj = exam.toObject();
    delete examObj.password;

    // 🔀 Shuffle questions and their options
    examObj.questions = shuffleArray(examObj.questions.map((q) => ({
      ...q,
      options: shuffleArray([...q.options])
    })));

    res.status(200).json({ message: '✅ Password verified', exam: examObj });
  } catch (err) {
    console.error('Password verification error:', err);
    res.status(500).json({ error: 'Server error verifying password' });
  }
});


// ✅ Admin: get all exams with full details
router.get('/admin/all-details', authMiddleware, isAdmin, async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.json({ exams });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching exams' });
  }
});

// ✅ Delete exam (admin only) – Place BEFORE the dynamic ':examId' route
router.delete('/:examId', authMiddleware, isAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.examId);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (err) {
    console.error('Delete Exam Error:', err);
    res.status(500).json({ error: 'Server error deleting exam' });
  }
});

// ✅ Get single exam by ID
router.get('/:examId', authMiddleware, isAdmin, getExamById);


// ✅ Admin: get single exam by ID (used for "View Exam Details" page)
router.get('/:examId', authMiddleware, isAdmin, getExamById);

// ✅ Optional: Debug route to test if ID exists (remove later)
router.get('/test/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    res.json(exam || { message: 'Not found' });
  } catch (e) {
    res.status(500).json({ error: 'Invalid ID format' });
  }
});



module.exports = router;
