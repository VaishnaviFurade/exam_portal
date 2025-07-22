const express = require('express');
const router = express.Router();

const {
    submitExam,
    getMyResults,
    getAllResults // <-- this should be defined in your resultController.js
} = require('../controllers/resultController');

const { authMiddleware, isAdmin } = require('../middleware/authMiddleware'); // ✅ Fixed import

// ✅ Student Routes
router.post('/submit', authMiddleware, submitExam);
router.get('/my-results', authMiddleware, getMyResults);

// ✅ Admin Route
router.get('/all', authMiddleware, isAdmin, getAllResults);

module.exports = router;
