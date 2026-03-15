const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Quiz = require('../models/Quiz');
const Classroom = require('../models/Classroom');
const Schedule = require('../models/Schedule');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|mp4|avi|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// Apply auth and teacher authorization to all routes
router.use(auth, authorize('teacher'));

// Get teacher's assigned classes
router.get('/classes', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const classrooms = await Classroom.find({
      teacherId: req.user.id,
      className: { $in: teacher.assignedClasses }
    })
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
  body('sections').isArray({ min: 1 }),
  body('duration').isInt({ min: 1 }),
  body('startTime').isISO8601(),
  body('endTime').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, classAssigned, subject, sections, duration, startTime, endTime } = req.body;

    const totalMarks = sections.reduce((secSum, section) => {
      return secSum + section.questions.reduce((qSum, q) => qSum + (q.marks || 1), 0);
    }, 0);

    const quiz = new Quiz({
      title,
      description,
      createdBy: req.user.id,
      classAssigned,
      subject,
      sections,
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
    
    if (req.body.sections) {
      quiz.totalMarks = req.body.sections.reduce((secSum, section) => {
        return secSum + section.questions.reduce((qSum, q) => qSum + (q.marks || 1), 0);
      }, 0);
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

// Get materials
router.get('/materials', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const classrooms = await Classroom.find({ teacherId: req.user.id });
    const allMaterials = classrooms.flatMap(c => 
      c.materials.map(m => ({ ...m.toObject(), _id: m._id, classroomId: c._id }))
    );

    res.json({ success: true, data: allMaterials });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload material
router.post('/materials', upload.single('file'), async (req, res) => {
  try {
    const { title, category, subject, dueDate } = req.body;
    
    if (!title || !category || !subject) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    let classroom = await Classroom.findOne({ 
      teacherId: req.user.id, 
      subject 
    });

    if (!classroom) {
      classroom = new Classroom({
        teacherId: req.user.id,
        subject,
        className: teacher.assignedClasses[0] || 'General',
        students: []
      });
    }

    const materialData = {
      title,
      type: category === 'video' ? 'video' : 'document',
      category,
      url: fileUrl,
      uploadedAt: new Date()
    };

    if (dueDate) {
      materialData.dueDate = new Date(dueDate);
    }

    classroom.materials.push(materialData);
    await classroom.save();

    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      data: classroom.materials[classroom.materials.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete material
router.delete('/materials/:classroomId/:materialId', async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ 
      _id: req.params.classroomId, 
      teacherId: req.user.id 
    });
    
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    classroom.materials = classroom.materials.filter(
      m => m._id.toString() !== req.params.materialId
    );
    await classroom.save();

    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get performance analytics
router.get('/performance-analytics', async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }

    // Get all classes the teacher teaches
    const classrooms = await Classroom.find({ teacherId: req.user.id });
    const classNames = classrooms.map(c => c.className);
    const subjects = [...new Set(classrooms.map(c => c.subject))];

    // Get all students in teacher's classes
    const students = await Student.find({ standard: { $in: classNames } })
      .populate('userId', 'fullName email');

    // Calculate performance by subject
    const subjectPerformance = {};
    subjects.forEach(subject => {
      subjectPerformance[subject] = {
        totalStudents: 0,
        totalMarks: 0,
        highest: 0,
        lowest: 100,
        scores: []
      };
    });

    students.forEach(student => {
      if (student.performance && student.performance.length > 0) {
        student.performance.forEach(perf => {
          if (subjectPerformance[perf.subject]) {
            const percentage = (perf.marks / perf.totalMarks) * 100;
            subjectPerformance[perf.subject].totalStudents++;
            subjectPerformance[perf.subject].totalMarks += percentage;
            subjectPerformance[perf.subject].scores.push(percentage);
            if (percentage > subjectPerformance[perf.subject].highest) {
              subjectPerformance[perf.subject].highest = percentage;
            }
            if (percentage < subjectPerformance[perf.subject].lowest) {
              subjectPerformance[perf.subject].lowest = percentage;
            }
          }
        });
      }
    });

    // Format subject data
    const performanceData = Object.keys(subjectPerformance).map(subject => {
      const data = subjectPerformance[subject];
      return {
        subject,
        average: data.scores.length > 0 ? (data.totalMarks / data.scores.length).toFixed(1) : 0,
        highest: data.highest.toFixed(1),
        lowest: data.lowest === 100 ? 0 : data.lowest.toFixed(1),
        totalStudents: data.scores.length
      };
    });

    // Calculate overall class average
    let overallTotalMarks = 0;
    let overallCount = 0;
    let topPerformer = 0;
    
    performanceData.forEach(p => {
      overallTotalMarks += parseFloat(p.average) * p.totalStudents;
      overallCount += p.totalStudents;
      if (parseFloat(p.highest) > topPerformer) {
        topPerformer = parseFloat(p.highest);
      }
    });

    const classAverage = overallCount > 0 ? (overallTotalMarks / overallCount).toFixed(1) : 0;

    // Get trend data (mock for now - would need historical data)
    const trendData = [
      { month: 'Jan', performance: 75 },
      { month: 'Feb', performance: 78 },
      { month: 'Mar', performance: 82 },
      { month: 'Apr', performance: 85 },
      { month: 'May', performance: parseFloat(classAverage) || 88 },
      { month: 'Jun', performance: parseFloat(classAverage) ? parseFloat(classAverage) + 2 : 90 }
    ];

    // Get recent activity (from quiz submissions)
    const quizzes = await Quiz.find({ 
      createdBy: req.user.id,
      'submissions.0': { $exists: true }
    }).sort({ createdAt: -1 }).limit(10);

    const recentActivity = quizzes.map(quiz => {
      const submissionCount = quiz.submissions.length;
      const avgScore = quiz.submissions.reduce((acc, sub) => acc + sub.percentage, 0) / submissionCount;
      return {
        type: 'quiz',
        title: quiz.title,
        submissions: submissionCount,
        averageScore: avgScore.toFixed(1),
        date: quiz.createdAt
      };
    });

    // AI Insights based on real data
    const insights = [];
    
    // Check for low performers
    const lowPerformers = students.filter(s => {
      if (!s.performance || s.performance.length === 0) return false;
      const avg = s.performance.reduce((acc, p) => acc + (p.marks / p.totalMarks) * 100, 0) / s.performance.length;
      return avg < 60;
    });

    if (lowPerformers.length > 0) {
      insights.push({
        type: 'warning',
        title: '⚠️ Areas for Attention',
        message: `${lowPerformers.length} students are performing below 60%. Consider additional support or tutoring sessions.`
      });
    }

    // Check for high performers
    const highPerformers = students.filter(s => {
      if (!s.performance || s.performance.length === 0) return false;
      const avg = s.performance.reduce((acc, p) => acc + (p.marks / p.totalMarks) * 100, 0) / s.performance.length;
      return avg >= 85;
    });

    if (highPerformers.length > 0) {
      insights.push({
        type: 'positive',
        title: '🎯 High Performers',
        message: `${highPerformers.length} students are performing above 85%. Consider peer tutoring programs.`
      });
    }

    // Overall trend
    const improvement = overallCount > 0 ? ((parseFloat(classAverage) - 75) / 75 * 100).toFixed(0) : 0;
    insights.push({
      type: 'recommendation',
      title: '📈 Performance Overview',
      message: `Overall class average is ${classAverage}% with ${students.length} students assessed.`
    });

    res.json({
      success: true,
      data: {
        stats: {
          classAverage: parseFloat(classAverage) || 0,
          topPerformer: topPerformer.toFixed(1),
          totalStudents: students.length,
          improvement: parseFloat(improvement) || 0
        },
        performanceData,
        trendData,
        recentActivity,
        insights
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ============ SCHEDULE ROUTES ============

// Get teacher's schedule
router.get('/schedule', async (req, res) => {
  try {
    const schedules = await Schedule.find({ teacherId: req.user.id })
      .sort({ dayOfWeek: 1, startTime: 1 });
    
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get schedule by class
router.get('/schedule/class/:className', async (req, res) => {
  try {
    const schedules = await Schedule.find({ className: req.params.className })
      .populate('teacherId', 'fullName')
      .sort({ dayOfWeek: 1, startTime: 1 });
    
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create schedule
router.post('/schedule', [
  body('className').notEmpty(),
  body('subject').notEmpty(),
  body('dayOfWeek').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('startTime').notEmpty(),
  body('endTime').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { className, subject, dayOfWeek, startTime, endTime } = req.body;

    const schedule = new Schedule({
      className,
      subject,
      teacherId: req.user.id,
      dayOfWeek,
      startTime,
      endTime
    });

    await schedule.save();

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: schedule
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update schedule
router.put('/schedule/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id, teacherId: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    Object.assign(schedule, req.body);
    await schedule.save();

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete schedule
router.delete('/schedule/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, teacherId: req.user.id });
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
