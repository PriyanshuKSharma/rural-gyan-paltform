const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Classroom = require('./models/Classroom');
const Quiz = require('./models/Quiz');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Real Indian names for teachers
const teacherNames = [
  'Rajesh Kumar Sharma', 'Priya Ramesh Patel', 'Amit Singh Verma',
  'Sunita Devi Gupta', 'Vijay Kumar Reddy', 'Anita Maheshwari',
  'Deepak Chandrashekhar', 'Meera Krishnamurthy', 'Sanjay Narayanan',
  ' Kavita Subramani', 'Rahul Hiremath', 'Divya Raghavan'
];

// Real Indian names for students
const studentFirstNames = [
  'Aarav', 'Aanya', 'Arjun', 'Ananya', 'Vihaan', 'Saanvi',
  'Reyansh', 'Pari', 'Ayaan', 'Myra', 'Krishna', 'Aadhya',
  'Ishaan', 'Pihu', 'Atharv', 'Avni', 'Dhruv', 'Kavya',
  'Arnav', 'Anaya', 'Sai', 'Diya', 'Varun', 'Nisha',
  'Aditya', 'Riya', 'Karthik', 'Sneha', 'Raj', 'Priya',
  'Akhil', 'Lakshmi', 'Suresh', 'Gopal', 'Harsha', 'Uma'
];

const studentLastNames = [
  'Sharma', 'Patel', 'Singh', 'Gupta', 'Reddy', 'Kumar',
  'Joshi', 'Mehta', 'Shah', 'Verma', 'Chatterjee', 'Mukherjee',
  'Iyer', 'Rao', 'Nair', 'Menon', 'Pillai', 'Desai', 'Agarwal'
];

const generateUsers = async () => {
  await connectDB();

  const grades = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  const usersList = [];
  const password = 'password123'; // Default password for all

  // Shuffle arrays for variety
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffledTeacherNames = shuffleArray(teacherNames);
  const shuffledFirstNames = shuffleArray(studentFirstNames);
  const shuffledLastNames = shuffleArray(studentLastNames);

  let teacherNameIndex = 0;
  let studentNameIndex = 0;

  try {
    // Clear existing data to regenerate with new names
    console.log('Clearing existing users, students, teachers, classrooms, and quizzes...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Classroom.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Existing data cleared.');

    for (const grade of grades) {
      const gradeName = `${grade}th Grade`;
      console.log(`Generating users for ${gradeName}...`);

      // 1. Create Teacher for this grade
      const teacherName = shuffledTeacherNames[teacherNameIndex % shuffledTeacherNames.length];
      teacherNameIndex++;
      
      const randomSuffixT = Math.floor(1000 + Math.random() * 9000);
      const firstName = teacherName.split(' ')[0].toLowerCase();
      const lastName = teacherName.split(' ').pop().toLowerCase();
      const teacherUsername = `${firstName}_${lastName}_t${grade}`;
      const teacherEmail = `${firstName}.${lastName}${grade}@school.com`;
      
      const teacherUser = new User({
        username: teacherUsername,
        password: password, // Will be hashed by pre-save hook
        role: 'teacher',
        fullName: teacherName,
        email: teacherEmail,
        isActive: true
      });

      const savedTeacherUser = await teacherUser.save();

      // Assign subjects based on grade
      const subjects = grade <= 5 
        ? ['Mathematics', 'English', 'Environmental Studies']
        : grade <= 8
        ? ['Mathematics', 'Science', 'English', 'Social Studies']
        : ['Mathematics', 'Physics', 'Chemistry', 'English'];

      const teacherProfile = new Teacher({
        userId: savedTeacherUser._id,
        qualifications: 'B.Ed, M.Sc',
        subjects: subjects,
        assignedClasses: [gradeName],
        isClassTeacher: true,
        classTeacherOf: gradeName
      });

      await teacherProfile.save();

      // Create Classroom for this teacher
      const classroom = new Classroom({
        teacherId: savedTeacherUser._id,
        subject: subjects[0], // Default subject
        className: gradeName,
        students: [] // Will be populated later if needed
      });

      await classroom.save();

      usersList.push({
        role: 'Teacher',
        grade: gradeName,
        username: teacherUsername,
        password: password,
        email: teacherEmail,
        name: teacherName
      });

      // 2. Create 10-12 Students for this grade
      const numStudents = Math.floor(Math.random() * 3) + 10; // 10 to 12 students
      
      for (let i = 1; i <= numStudents; i++) {
        const firstName = shuffledFirstNames[studentNameIndex % shuffledFirstNames.length];
        const lastName = shuffledLastNames[(studentNameIndex + i) % shuffledLastNames.length];
        studentNameIndex++;
        
        const fullName = `${firstName} ${lastName}`;
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const studentUsername = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${grade}${i}`;
        const studentEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${grade}${i}@school.com`;
        const enrollNo = `EN${grade}${String(i).padStart(3, '0')}${randomSuffix}`;

        const studentUser = new User({
          username: studentUsername,
          password: password,
          role: 'student',
          fullName: fullName,
          email: studentEmail,
          isActive: true
        });

        const savedStudentUser = await studentUser.save();

        const studentProfile = new Student({
          userId: savedStudentUser._id,
          enrollNo: enrollNo,
          standard: gradeName,
          parentsContact: `9876543${String(i).padStart(3, '0')}`,
          address: `${100 + i}, School Road, Education City`,
          classTeacher: savedTeacherUser._id,
          performance: [] // Empty initially
        });

        await studentProfile.save();

        usersList.push({
          role: 'Student',
          grade: gradeName,
          username: studentUsername,
          password: password,
          email: studentEmail,
          name: fullName
        });
      }
    }

    // Write credentials to file
    let fileContent = '# Generated Test Users\n\n';
    fileContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    fileContent += '| Role | Grade | Name | Username | Password | Email |\n';
    fileContent += '|---|---|---|---|---|---|\n';

    usersList.forEach(user => {
      fileContent += `| ${user.role} | ${user.grade} | ${user.name} | ${user.username} | ${user.password} | ${user.email} |\n`;
    });

    const outputPath = path.join(__dirname, '..', 'GENERATED_USERS.md');
    fs.writeFileSync(outputPath, fileContent);

    console.log(`Successfully generated ${usersList.length} users.`);
    console.log(`Credentials saved to ${outputPath}`);

  } catch (error) {
    console.error('Error generating users:', error);
  } finally {
    mongoose.connection.close();
  }
};

generateUsers();
