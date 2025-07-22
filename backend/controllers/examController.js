const Exam = require('../models/exam');
const bcrypt = require('bcryptjs');

// ✅ Create Exam
exports.createExam = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { title, description, duration, questions, password } = req.body;

    if (!title || !duration || !password || !questions || questions.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newExam = new Exam({
      title,
      description,
      duration,
      password: hashedPassword,
      plainPassword: password, // ✅ store original password for admin
      questions,
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
    const userId = req.user.userId;

    const exams = await Exam.find({ createdBy: userId });

    res.status(200).json(exams);
  } catch (error) {
    console.error('Fetch Exams Error:', error);
    res.status(500).json({ error: 'Server Error while fetching exams' });
  }
};

// ✅ Get All Exams with optional search/filter
exports.getAllExams = async (req, res) => {
  try {
    const { title, duration } = req.query;

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (duration) {
      query.duration = Number(duration);
    }

    const exams = await Exam.find(query).populate('createdBy', 'username email');
    res.status(200).json({ exams });
  } catch (error) {
    console.error('Fetch All Exams Error:', error);
    res.status(500).json({ error: 'Server Error while fetching all exams' });
  }
};

// ✅ Get Exam By ID — Customize response based on role
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const userRole = req.user.role;

    let examToSend = exam.toObject();

    if (userRole === 'student') {
      // Randomize question order and options
      examToSend.questions = examToSend.questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      examToSend.questions = shuffleArray(examToSend.questions);
      delete examToSend.password;
      delete examToSend.plainPassword;
    } else if (userRole === 'admin') {
      // Return everything including plainPassword
      examToSend.plainPassword = exam.plainPassword;
    }

    res.status(200).json({ exam: examToSend });
  } catch (err) {
    console.error('Error fetching exam by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Helper function to shuffle arrays
function shuffleArray(array) {
  return array
    .map((val) => ({ val, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ val }) => val);
}
