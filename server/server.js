require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');

const connectDB = require('./config/database');
const jwt = require('jsonwebtoken');
const { handleTutorMessage } = require('./services/aiTutor');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const virtualClassRoutes = require('./routes/virtualClass');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:3001", "http://localhost:5500", "http://127.0.0.1:5500", "null"],
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:3001", "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:5500", "null"],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/virtual-class', virtualClassRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Digital Learning Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      teacher: '/api/teacher',
      student: '/api/student',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join virtual class
  socket.on('join-virtual-class', (data) => {
    const { classId, userId, userType } = data;
    socket.join(classId);
    socket.userId = userId;
    socket.userType = userType;
    socket.classId = classId;

    // Notify others about new participant
    socket.to(classId).emit('participant-joined', {
      userId,
      userType,
      socketId: socket.id
    });

    console.log(`${userType} ${userId} joined virtual class ${classId}`);
  });

  // Leave virtual class
  socket.on('leave-virtual-class', (classId) => {
    socket.leave(classId);
    socket.to(classId).emit('participant-left', {
      userId: socket.userId,
      userType: socket.userType,
      socketId: socket.id
    });
    console.log(`User ${socket.userId} left virtual class ${classId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    io.to(data.classId).emit('chat-message', {
      message: data.message,
      sender: data.sender,
      userId: data.userId,
      timestamp: new Date()
    });
  });

  // WebRTC signaling for video calls
  socket.on('video-offer', (data) => {
    socket.to(data.targetSocketId).emit('video-offer', {
      offer: data.offer,
      fromSocketId: socket.id,
      fromUserId: socket.userId
    });
  });

  socket.on('video-answer', (data) => {
    socket.to(data.targetSocketId).emit('video-answer', {
      answer: data.answer,
      fromSocketId: socket.id,
      fromUserId: socket.userId
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.targetSocketId).emit('ice-candidate', {
      candidate: data.candidate,
      fromSocketId: socket.id,
      fromUserId: socket.userId
    });
  });

  // Attendance tracking
  socket.on('mark-attendance', (data) => {
    if (socket.userType === 'teacher') {
      io.to(socket.classId).emit('attendance-marked', data);
    }
  });

  // Screen sharing
  socket.on('start-screen-share', () => {
    socket.to(socket.classId).emit('screen-share-started', {
      userId: socket.userId,
      socketId: socket.id
    });
  });

  socket.on('stop-screen-share', () => {
    socket.to(socket.classId).emit('screen-share-stopped', {
      userId: socket.userId,
      socketId: socket.id
    });
  });

  // Mute/unmute controls (teacher only)
  socket.on('mute-participant', (data) => {
    if (socket.userType === 'teacher') {
      io.to(socket.classId).emit('participant-muted', data);
    }
  });

  socket.on('disconnect', () => {
    if (socket.classId) {
      socket.to(socket.classId).emit('participant-left', {
        userId: socket.userId,
        userType: socket.userType,
        socketId: socket.id
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

// AI Tutor Namespace
io.of("/tutor").use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
}).on("connection", async (socket) => {
  console.log("Tutor connected:", socket.user.id);

  socket.on("user_message", async (data) => {
    try {
      const aiResponse = await handleTutorMessage({
        userId: socket.user.id,
        message: data.message,
        type: data.type, // text | image | pdf | docx
        file: data.file
      });

      socket.emit("ai_response", aiResponse);
    } catch (error) {
      console.error("Tutor Error:", error);
      socket.emit("error", { message: "Failed to process message" });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});