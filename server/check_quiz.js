const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const Student = require('./models/Student');
const User = require('./models/User');
require('dotenv').config();

const checkData = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // 1. Find the student
    // Note: You might need to adjust the username if the random suffix is different in your actual DB run
    // But let's search for any student in 11th Grade
    const student = await Student.findOne({ standard: '11th Grade' }).populate('userId');
    if (student) {
      console.log('Found Student:', student.userId.username);
      console.log('Student Standard:', student.standard);
    } else {
      console.log('No student found for 11th Grade');
    }

    // 2. Find ALL quizzes
    const quizzes = await Quiz.find({});
    console.log(`Found ${quizzes.length} total quizzes`);
    
    quizzes.forEach(q => {
      console.log('Quiz:', q.title);
      console.log('  Class Assigned:', q.classAssigned);
      console.log('  Is Active:', q.isActive);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkData();
