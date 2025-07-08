const Exam = require('../models/exam');

// ✅ Create Exam (Only for authenticated users)
exports.createExam = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ corrected
        const { title, description, duration } = req.body;

        const newExam = new Exam({
            title,
            description,
            duration,
            createdBy: userId
        });

        await newExam.save();

        res.status(201).json({ message: 'Exam created successfully', exam: newExam });
    } catch (error) {
        console.error('Create Exam Error:', error);
        res.status(500).json({ error: 'Server Error while creating exam' });
    }
};

// ✅ Get Exams created by the logged-in user
exports.getMyExams = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ corrected

        const exams = await Exam.find({ createdBy: userId });

        res.status(200).json(exams);
    } catch (error) {
        console.error('Fetch Exams Error:', error);
        res.status(500).json({ error: 'Server Error while fetching exams' });
    }
};

// ✅ Get All Exams (admin or public access)
exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find().populate('createdBy', 'username email');
        res.status(200).json(exams);
    } catch (error) {
        console.error('Fetch All Exams Error:', error);
        res.status(500).json({ error: 'Server Error while fetching all exams' });
    }
};
