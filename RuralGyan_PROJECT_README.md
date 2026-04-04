# Rural Gyan - AI-Powered Rural Education Platform

A full-stack EdTech solution built for rural Indian classrooms, combining live virtual learning, AI tutoring, multilingual support, and role-based dashboards for Admin, Teacher, and Student.

## 📌 What is Rural Gyan?

Rural Gyan bridges the education gap in rural communities by delivering an accessible, scalable learning platform with:
- Live Virtual Classrooms
- AI-Powered Tutoring
- Interactive Whiteboard Collaboration
- Real-time Translation & Captions
- Role-based dashboards for Admin, Teacher, and Student

## 🎯 Project Goals

- Enable remote learning for rural schools with limited infrastructure
- Support multilingual learning with English and Hindi
- Provide real-time collaboration and classroom interaction
- Offer AI-assisted learning through document Q&A and tutoring
- Create a production-ready platform with cloud-friendly deployment

## 🚀 Core Features

### Admin
- Teacher and Student management (CRUD)
- System analytics and monitoring
- Activity logs and performance reports
- Bulk user operations

### Teacher
- Live Virtual Classroom with WebRTC video/audio
- Interactive whiteboard for collaborative drawing
- Quiz creation and auto-grading
- Student analytics and attendance tracking
- Live captions and translation controls
- Student camera and mute controls

### Student
- Join virtual classes with video/chat
- AI tutor for document analysis and question answering
- Online code editor and compiler
- Learning materials and notes
- Quizzes, assessments, and instant feedback
- Progress tracking and grades

## 🧠 Advanced Capabilities

- Real-time English ↔ Hindi translation
- Live speech-to-text captions
- AI document analysis for PDFs and DOCX
- Screen sharing for teachers
- Bilingual interface with i18n support
- Dark mode and responsive UI

## 🛠️ Technology Stack

**Frontend**
- React.js
- Tailwind CSS
- Socket.io Client
- React Router
- Recharts
- Monaco Editor

**Backend**
- Node.js
- Express.js
- Socket.io Server
- JWT authentication
- Nodemailer

**Database**
- MongoDB
- Mongoose ODM

**AI / Cloud Services**
- Google Gemini / OpenAI
- Google Cloud Vision
- Google Cloud Translate
- Google Cloud Speech-to-Text

**Real-time**
- WebRTC for video/audio
- Socket.io for chat, whiteboard, and events

## 📁 Directory Structure

```
RuralGyan_PROJECT/
├── client/                    # React web application
│   ├── src/components/        # UI components for Admin/Teacher/Student
│   ├── src/pages/             # Page routes and dashboard views
│   └── src/services/          # API integration and helper services
├── server/                    # Node.js backend API server
│   ├── routes/                # Auth, admin, teacher, student, virtual class routes
│   ├── models/                # MongoDB schemas
│   ├── services/              # Business logic, AI tutoring, file handling
│   ├── config/                # Database connection and config
│   ├── middlewares/           # Auth and validation middleware
│   ├── uploads/               # File upload storage
│   └── server.js              # Main express app and socket.io setup
├── frontend/                  # Static HTML fallback pages
└── deploy/                    # Deployment configuration files
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Environment configuration

Create a `.env` file in `server/` with values similar to:

```env
MONGODB_URI=mongodb://localhost:27017/edu_management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
```

Create a `.env` file in `client/` with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the application

Open two terminal windows:

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

### 4. Access the app

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## 🔐 Demo Accounts

Use these accounts to test each role:

- Admin: `admin@gyan.com` / `admin123`
- Teacher: `teacher1@gyan.com` / `teacher123`
- Student: `student1@gyan.com` / `student123`

## 🧪 Testing & Verification

Test main features:
- Teacher creates a class, Student joins, and virtual classroom functions
- Whiteboard drawing syncs across connected users
- AI Tutor answers questions from PDF/document uploads
- Real-time translation and captions display correctly
- Quizzes are created and auto-graded

## 🚚 Deployment

Recommended deployment stack:
- Frontend: Vercel or Netlify
- Backend: Railway or Render
- Database: MongoDB Atlas
- CDN: Cloudflare

The `deploy/` folder contains deployment configuration files for common hosting platforms.

## 💡 Notes

- The backend app uses `socket.io` for realtime collaboration and `WebRTC` for video/audio.
- MongoDB connection is configured through `server/config/database.js`.
- JWT authentication secures API access for all user roles.

## 🤝 Contribution

If you want to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-update`
3. Commit your changes: `git commit -m "Add: feature description"`
4. Push to your branch and create a pull request

## � Team

This project was developed by:

- Saylee Shelar
- Neha Gaikwad
- Meghana Prathipati

---

**Rural Gyan: Transforming rural education through AI-powered learning and real-time collaboration.**
