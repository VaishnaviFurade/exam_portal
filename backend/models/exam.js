const mongoose = require('mongoose');

// ✅ Define the schema for individual questions with _id enabled
const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [
        {
            type: String,
            required: true
        }
    ],
    answer: {
        type: String,
        required: true
    }
}, { _id: true }); // ✅ Fix: Ensure each question has a unique _id

// ✅ Define the schema for the entire exam
const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        duration: {
            type: Number,
            required: true // in minutes
        },
        password: {
            type: String,
            required: true // for students to access the exam
        },
        questions: {
            type: [questionSchema],
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        plainPassword: {
            type: String,
            select: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Exam', examSchema);
