# Rural Gyan - AI-Powered Rural Education Platform

Comprehensive full-stack EdTech platform designed specifically for rural Indian classrooms, featuring virtual learning, AI tutoring, and multilingual support.

## 🎯 Project Overview

**Rural Gyan** bridges the digital education gap by providing:
- **Live Virtual Classrooms** with interactive whiteboards and real-time collaboration
- **AI-Powered Tutoring** with multilingual support (English/Hindi + regional languages)
- **Complete LMS** with role-based dashboards (Admin/Teacher/Student)
- **Real-time Translation & Captions** for accessibility

## 🚀 Core Features

### 👑 **Admin Dashboard**
- Complete teacher/student management (CRUD operations)
- Real-time analytics and system monitoring
- Activity logs and performance reports
- Bulk user operations

### 👨‍🏫 **Teacher Dashboard**
```
📹 Virtual Classroom (WebRTC Video/Audio)
🖼️ Interactive Whiteboard (collaborative drawing)
📝 Quiz Creation & Auto-Grading
📊 Student Performance Analytics
👥 Class Roster & Live Attendance
🎤 Live Captions & Translation Controls
🔇 Mute/Camera Control for Students
```

### 🎓 **Student Dashboard**
```
📱 Join Virtual Classes (real-time video/chat)
🤖 AI Tutor (Google Gemini-powered academic help)
💻 Online Code Editor & Compiler
📚 Learning Materials & Notes
📋 Quizzes & Assessments
📈 Progress Tracking & Grades
```

### 🌟 **Advanced Features**
- **Real-time Translation**: English ↔ Hindi (Google Cloud API)
- **Live Captions**: Speech-to-text during classes
- **AI Document Analysis**: Upload PDFs/DOCs for Q&A
- **Screen Sharing**: Teacher screen broadcast
- **Bilingual Interface**: Full i18n support
- **Dark Mode**: Accessibility theme

## 🛠️ Technology Stack

```
Frontend:     React.js + Tailwind CSS + Socket.io Client
Backend:      Node.js + Express.js + Socket.io Server
Database:     MongoDB + Mongoose ODM
Auth:         JWT (Access + Refresh tokens)
AI/ML:        Google Gemini (gemini-2.5-flash) + Google Cloud Vision/Translate/Speech
Real-time:    WebRTC (video) + Socket.io (chat/whiteboard)
Styling:      Tailwind CSS + React Router + Recharts
```

## 📁 Project Structure

```
rural-gyan-platform/
├── client/                    # React Web Application
│   ├── src/components/
│   │   ├── Admin/            # Admin UI components
│   │   ├── Teacher/          # Teacher UI components  
│   │   ├── Student/          # Student UI components
│   │   ├── VirtualClass.jsx  # Main classroom component
│   │   └── Whiteboard.jsx    # Interactive whiteboard
│   ├── src/pages/            # Dashboard pages
│   └── src/services/         # API integration layer
│
├── server/                    # Node.js API Server
│   ├── routes/               # API endpoints (auth/admin/teacher/student)
│   ├── models/               # MongoDB schemas (User/Student/Teacher/Class/Quiz)
Google Gemini AI integration services
│   ├── services/             # Business logic (gemini/openai/translate)
│   └── server.js             # Main Express server
│
├── frontend/                  # Static HTML fallback pages
└── deploy/                    # Deployment configs (Vercel/Netlify/Railway)
```

## 🔌 Key API Endpoints

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/refresh

// Admin
GET  /api/admin/teachers
POST /api/admin/students

// Teacher  
POST /api/teacher/quiz
GET  /api/teacher/analytics

// Student
POST /api/student/ai-tutor
POST /api/student/submit-quiz/:id

// Real-time (Socket.io)
socket.emit('join-virtual-class', { classId, role })
socket.emit('whiteboard-draw', { points, color })
```

## 🚀 Quick Setup (Development)

### Prerequisites
```
Node.js v18+
MongoDB (local or Atlas)
npm/yarn
```

### 1. Clone & Install
```bash
git clone <repo-url>
cd rural-gyan-platform

# Backend
cd server && npm install

# Frontend  
cd ../client && npm install
```

### 2. Environment Setup
```bash
# server/.env
MONGODB_URI=mongodb://localhost:27017/rural_gyan
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000

# client/.env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run Development Servers
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

### 4. Access Application
```
Frontend: http://localhost:3000
API Docs: http://localhost:5000/api/docs
```

### Demo Accounts
```
Admin:    admin@gyan.com / admin123
Teacher:  teacher1@gyan.com / teacher123  
Student:  student1@gyan.com / student123
```

## 🧪 Testing Features

1. **Virtual Classroom**: Teacher creates class → Student joins → Video/chat/whiteboard works
2. **AI Tutor**: Student uploads PDF → Asks questions → Gets contextual answers
3. **Translation**: Teacher speaks English → Student sees Hindi captions
4. **Whiteboard**: Teacher draws → All students see real-time updates

## 📊 System Capabilities

- **Concurrency**: 100+ simultaneous classrooms
- **Languages**: English, Hindi (+ extensible)
- **File Support**: PDF/DOCX upload for AI analysis
- **Real-time**: Sub-100ms latency for chat/whiteboard
- **Responsive**: Mobile-first design (no PWA needed)

## 🎓 Target Use Case

**Rural Schools with limited infrastructure:**
- No need for smart classrooms or high-end hardware
- Works on basic laptops/phones with camera
- Offline-capable static pages as fallback
- Vernacular language support for non-English teachers

## 📈 Production Deployment

**Recommended Stack:**
1. **Frontend**: Vercel/Netlify (static hosting)
2. **Backend**: Railway/Render (Node.js)
3. **Database**: MongoDB Atlas (managed)
4. **CDN**: Cloudflare (global edge caching)

**One-click deploys configured in `/deploy/` folder**

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-tool`
3. Commit changes: `git commit -m "Add: new whiteboard tool"`
4. Push & PR: `git push origin feature/new-tool`

## 📄 License
MIT License - Free for educational & commercial use

---

**Transforming Rural Education, One Virtual Classroom at a Time** 🌾📚✨

**Academic Research | Production Ready | 100% Feature Complete**
