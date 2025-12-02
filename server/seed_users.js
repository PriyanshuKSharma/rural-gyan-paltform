const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
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

const generateUsers = async () => {
  await connectDB();

  const grades = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  const usersList = [];
  const password = 'password123'; // Default password for all

  try {
    for (const grade of grades) {
      const gradeName = `${grade}th Grade`;
      console.log(`Generating users for ${gradeName}...`);

      // 1. Create Teacher for this grade
      const randomSuffixT = Math.floor(1000 + Math.random() * 9000);
      const teacherUsername = `t_g${grade}_${randomSuffixT}`;
      const teacherEmail = `t.g${grade}.${randomSuffixT}@school.com`;
      
      const teacherUser = new User({
        username: teacherUsername,
        password: password, // Will be hashed by pre-save hook
        role: 'teacher',
        fullName: `Teacher Grade ${grade}`,
        email: teacherEmail,
        isActive: true
      });

      const savedTeacherUser = await teacherUser.save();

      const teacherProfile = new Teacher({
        userId: savedTeacherUser._id,
        qualifications: 'B.Ed, M.Sc',
        subjects: ['Mathematics', 'Science', 'English'],
        assignedClasses: [gradeName],
        isClassTeacher: true,
        classTeacherOf: gradeName
      });

      await teacherProfile.save();

      usersList.push({
        role: 'Teacher',
        grade: gradeName,
        username: teacherUsername,
        password: password,
        email: teacherEmail
      });

      // 2. Create 10-12 Students for this grade
      const numStudents = Math.floor(Math.random() * 3) + 10; // 10 to 12 students
      
      for (let i = 1; i <= numStudents; i++) {
        // Shorten username: s_g{grade}_{i}_{random4digits}
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const studentUsername = `s_g${grade}_${i}_${randomSuffix}`;
        const studentEmail = `s.g${grade}.${i}.${randomSuffix}@school.com`;
        const enrollNo = `EN${grade}${i}${randomSuffix}`;

        const studentUser = new User({
          username: studentUsername,
          password: password,
          role: 'student',
          fullName: `Student ${i} Grade ${grade}`,
          email: studentEmail,
          isActive: true
        });

        const savedStudentUser = await studentUser.save();

        const studentProfile = new Student({
          userId: savedStudentUser._id,
          enrollNo: enrollNo,
          standard: gradeName,
          parentsContact: '1234567890',
          address: '123 School Lane, Education City',
          classTeacher: savedTeacherUser._id
        });

        await studentProfile.save();

        usersList.push({
          role: 'Student',
          grade: gradeName,
          username: studentUsername,
          password: password,
          email: studentEmail
        });
      }
    }

    // Write credentials to file
    let fileContent = '# Generated Test Users\n\n';
    fileContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    fileContent += '| Role | Grade | Username | Password | Email |\n';
    fileContent += '|---|---|---|---|---|\n';

    usersList.forEach(user => {
      fileContent += `| ${user.role} | ${user.grade} | ${user.username} | ${user.password} | ${user.email} |\n`;
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
