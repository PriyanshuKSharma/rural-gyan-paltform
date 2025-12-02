const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
require('dotenv').config();

const fixQuiz = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const result = await Quiz.updateMany(
      { classAssigned: '11' },
      { $set: { classAssigned: '11th Grade' } }
    );

    console.log(`Updated ${result.modifiedCount} quizzes.`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

fixQuiz();
