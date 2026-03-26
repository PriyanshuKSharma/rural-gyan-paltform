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

// Trust proxy for rate limiting
app.set('trust proxy', 1);

const io = socketIo(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"]
  }
});

// Make io accessible to routes
app.set('io', io);

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: true,
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

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

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
    const { classId, userId, userType, userName } = data;
    socket.join(classId);
    socket.userId = userId;
    socket.userType = userType;
    socket.userName = userName;
    socket.classId = classId;

    // Get existing participants in the room
    const room = io.sockets.adapter.rooms.get(classId);
    const existingParticipants = [];
    if (room) {
      room.forEach(socketId => {
        if (socketId !== socket.id) {
          const existingSocket = io.sockets.sockets.get(socketId);
          if (existingSocket) {
            existingParticipants.push({
              socketId,
              userId: existingSocket.userId,
              userType: existingSocket.userType,
              userName: existingSocket.userName
            });
          }
        }
      });
    }

    // Send existing participants to the new joiner
    socket.emit('existing-participants', existingParticipants);

    // Notify others about new participant
    socket.to(classId).emit('participant-joined', {
      userId,
      userType,
      userName,
      socketId: socket.id
    });

    // Tell the new joiner to initiate offers to all existing participants (if they have stream)
    socket.emit('initiate-with-existing', existingParticipants);

    console.log(`${userType} ${userName} joined virtual class ${classId}`);
  });

  // Leave virtual class
  socket.on('leave-virtual-class', (classId) => {
    socket.leave(classId);
    socket.to(classId).emit('participant-left', {
      socketId: socket.id,
      userId: socket.userId
    });
    console.log(`User ${socket.userId} left virtual class ${classId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    const messageWithTimestamp = {
      message: data.message,
      sender: data.sender,
      userName: data.userName,
      userId: data.userId,
      timestamp: new Date()
    };
    console.log('Broadcasting message:', messageWithTimestamp);
    // Broadcast to everyone in the room INCLUDING sender
    io.to(data.classId).emit('chat-message', messageWithTimestamp);
  });

  // WebRTC signaling for video calls
  socket.on('video-offer', (data) => {
    console.log('video-offer from', socket.id, 'to', data.targetSocketId);
    socket.to(data.targetSocketId).emit('video-offer', {
      offer: data.offer,
      fromSocketId: socket.id,
      fromUserId: socket.userId,
      userName: data.userName || socket.userName,
      userType: data.userType || socket.userType
    });
  });

  socket.on('video-answer', (data) => {
    console.log('video-answer from', socket.id, 'to', data.targetSocketId);
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

  // Live captions
  socket.on('caption-update', (data) => {
    socket.to(data.classId).emit('caption-update', {
      caption: data.caption,
      userId: data.userId,
      userName: data.userName
    });
  });

  // Mute/unmute controls (teacher only)
  socket.on('mute-participant', (data) => {
    if (socket.userType === 'teacher') {
      io.to(socket.classId).emit('participant-muted', data);
    }
  });

  // Teacher controls for students
  socket.on('teacher-mute-student', (data) => {
    if (socket.userType === 'teacher') {
      io.to(data.targetSocketId).emit('force-mute');
    }
  });

  socket.on('teacher-video-off-student', (data) => {
    if (socket.userType === 'teacher') {
      io.to(data.targetSocketId).emit('force-video-off');
    }
  });

  socket.on('disconnect', () => {
    if (socket.classId) {
      socket.to(socket.classId).emit('participant-left', {
        userId: socket.userId,
        userType: socket.userType,
        userName: socket.userName,
        socketId: socket.id
      });
    }
    console.log('User disconnected:', socket.id);
  });

  // Handle class ended by teacher
  socket.on('end-class-broadcast', (data) => {
    io.to(data.classId).emit('class-ended', {
      classId: data.classId,
      endedBy: socket.userId
    });
  });

  // Whiteboard events
  socket.on('whiteboard-draw', (data) => {
    console.log('Server: Received whiteboard-draw:', data);
    socket.to(data.classId).emit('whiteboard-draw', data);
  });

  socket.on('whiteboard-clear', (data) => {
    console.log('Server: Received whiteboard-clear:', data);
    socket.to(data.classId).emit('whiteboard-clear', data);
  });

  // Raise hand events
  socket.on('raise-hand', (data) => {
    io.to(data.classId).emit('hand-raised', {
      userId: data.userId,
      userName: data.userName,
      socketId: socket.id
    });
  });

  socket.on('lower-hand', (data) => {
    io.to(data.classId).emit('hand-lowered', {
      userId: data.userId
    });
  });

  socket.on('lower-all-hands', (data) => {
    if (socket.userType === 'teacher') {
      io.to(data.classId).emit('all-hands-lowered');
    }
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