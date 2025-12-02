const express = require('express');
const { body, validationResult } = require('express-validator');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');
const Classroom = require('../models/Classroom');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply auth and teacher authorization to all routes
router.use(auth, authorize('teacher'));

// Get teacher's assigned classes
router.get('/classes', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const classrooms = await Classroom.find({ teacherId: req.user.id })
      .populate('students', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        assignedClasses: teacher.assignedClasses,
        classrooms
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get students in a specific class
router.get('/students/:className', async (req, res) => {
  try {
    const students = await Student.find({ standard: req.params.className })
      .populate('userId', 'fullName email photo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create quiz
router.post('/quiz', [
  body('title').notEmpty().trim(),
  body('classAssigned').notEmpty(),
  body('subject').notEmpty(),
  body('questions').isArray({ min: 1 }),
  body('duration').isInt({ min: 1 }),
  body('startTime').isISO8601(),
  body('endTime').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, classAssigned, subject, questions, duration, startTime, endTime } = req.body;

    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

    const quiz = new Quiz({
      title,
      description,
      createdBy: req.user.id,
      classAssigned,
      subject,
      questions,
      totalMarks,
      duration,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher's quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id })
      .populate({
        path: 'submissions.studentId',
        select: 'fullName username email'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update quiz
router.put('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user.id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    Object.assign(quiz, req.body);
    if (req.body.questions) {
      quiz.totalMarks = req.body.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    }

    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete quiz
router.delete('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student performance
router.post('/performance/:studentId', [
  body('subject').notEmpty(),
  body('marks').isNumeric(),
  body('totalMarks').isNumeric(),
  body('examType').isIn(['quiz', 'test', 'midterm', 'final'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const student = await Student.findOne({ userId: req.params.studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.performance.push({
      subject: req.body.subject,
      marks: req.body.marks,
      totalMarks: req.body.totalMarks,
      examType: req.body.examType
    });

    await student.save();

    res.json({
      success: true,
      message: 'Performance updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;