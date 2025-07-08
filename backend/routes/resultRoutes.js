const express = require('express');
const router = express.Router();

const {
    submitExam,
    getMyResults
} = require('../controllers/resultController');

const { authMiddleware } = require('../middleware/authMiddleware'); // ✅ Correct destructuring

// ✅ Routes for students
router.post('/submit', authMiddleware, submitExam);
router.get('/my-results', authMiddleware, getMyResults);

module.exports = router;
