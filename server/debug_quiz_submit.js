const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
require('dotenv').config();

const checkQuizStatus = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const quizId = '692e38088d6b079e9bd4baa4'; // ID from the error log
    // Note: If the ID in the log was truncated or incorrect, this might fail.
    // Let's try to find it.
    
    // If the ID is invalid, we might want to list all quizzes again to find the one created recently.
    const quiz = await Quiz.findById(quizId);
    
    if (quiz) {
      console.log('Quiz Found:', quiz.title);
      console.log('Start Time:', quiz.startTime);
      console.log('End Time:', quiz.endTime);
      console.log('Current Server Time:', new Date());
      
      const now = new Date();
      if (now < quiz.startTime) console.log('Status: Not Started Yet');
      else if (now > quiz.endTime) console.log('Status: Ended');
      else console.log('Status: Active');

      console.log('Submissions:', quiz.submissions.length);
      quiz.submissions.forEach(sub => {
        console.log(`- Student: ${sub.studentId}, Score: ${sub.score}`);
      });

    } else {
      console.log('Quiz not found with ID:', quizId);
      // List all quizzes to see if we can match
      const allQuizzes = await Quiz.find({});
      console.log('Listing all quizzes:');
      allQuizzes.forEach(q => {
        console.log(`- [${q._id}] ${q.title} (End: ${q.endTime})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkQuizStatus();
