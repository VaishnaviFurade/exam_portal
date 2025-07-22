// ✅ Load environment variables
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const resultRoutes = require('./routes/resultRoutes');


const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middlewares
app.use(cors()); // Handle Cross-Origin requests
app.use(express.json()); // Parse incoming JSON payloads

// ✅ API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// ✅ Health check route (optional)
app.get('/', (req, res) => {
  res.send('🟢 Exam Portal API is running...');
});

const Exam = require('./models/exam');
const Result = require('./models/result');

app.delete('/api/exams/:id', async (req, res) => {
  try {
    const examId = req.params.id;

    // Delete the exam
    await Exam.findByIdAndDelete(examId);

    // Delete all results related to that exam
    await Result.deleteMany({ examId: examId });

    res.status(200).json({ message: 'Exam and related results deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam and results.' });
  }
});



// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
