const express = require('express');
const router = express.Router();
const {
    createExam,
    getMyExams,
    getAllExams
} = require('../controllers/examController');

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');

// ✅ Dashboard route — confirms auth + role
router.get('/', authMiddleware, (req, res) => {
    res.status(200).json({ message: `Welcome ${req.user.role}, you are authorized.` });
});

// ✅ Admin-only: Create exam
router.post('/create', authMiddleware, isAdmin, createExam);

// ✅ Student-only or authenticated: My exams
router.get('/my-exams', authMiddleware, getMyExams);

// ✅ Public route: View all exams
router.get('/all', getAllExams);

module.exports = router;
