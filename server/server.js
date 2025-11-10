require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:5500", "null"],
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:5500", "null"],
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

  // Join classroom
  socket.on('join-classroom', (classroomId) => {
    socket.join(classroomId);
    console.log(`User ${socket.id} joined classroom ${classroomId}`);
  });

  // Leave classroom
  socket.on('leave-classroom', (classroomId) => {
    socket.leave(classroomId);
    console.log(`User ${socket.id} left classroom ${classroomId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    io.to(data.classroomId).emit('chat-message', {
      message: data.message,
      sender: data.sender,
      timestamp: new Date()
    });
  });

  // Handle video call signaling
  socket.on('video-offer', (data) => {
    socket.to(data.classroomId).emit('video-offer', data);
  });

  socket.on('video-answer', (data) => {
    socket.to(data.classroomId).emit('video-answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.classroomId).emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
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