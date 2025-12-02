const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'code'],
    default: 'mcq'
  },
  question: {
    type: String,
    required: true
  },
  // For MCQ
  options: [{
    type: String
  }],
  correctAnswer: {
    type: Number,
    min: 0,
    max: 3
  },
  // For Code
  codeConfig: {
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'sql']
    },
    testCases: [{
      input: String,
      output: String
    }]
  },
  marks: {
    type: Number,
    default: 1
  }
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [questionSchema]
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classAssigned: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  // New structure: Sections containing questions
  sections: [sectionSchema],
  
  totalMarks: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  submissions: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    answers: [{
      sectionId: mongoose.Schema.Types.ObjectId, // Track which section
      questionId: mongoose.Schema.Types.ObjectId, // Track which question
      selectedOption: Number, // For MCQ
      codeAnswer: String,     // For Code
      isCorrect: Boolean,
      marksObtained: Number
    }],
    score: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    timeTaken: Number // in minutes
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Helper to flatten questions for easier access if needed
quizSchema.virtual('allQuestions').get(function() {
  return this.sections.reduce((acc, section) => acc.concat(section.questions), []);
});

module.exports = mongoose.model('Quiz', quizSchema);