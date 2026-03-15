import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import StudentHome from '../components/Student/StudentHome';
import StudentVirtualClass from '../components/StudentVirtualClass';
import Materials from '../components/Student/Materials';
import AITutor from '../components/Student/AITutor';
import CodeEditor from '../components/Student/CodeEditor';
import QuizTaker from '../components/Student/QuizTaker';
import Profile from '../components/Common/Profile';
import StudentTimetable from '../components/Student/StudentTimetable';

const StudentDashboard = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = (pathname) => {
    const routes = {
      '/student': t('dashboard'),
      '/student/class': t('virtualClass'),
      '/student/materials': t('materials'),
      '/student/ai-tutor': t('aiTutor'),
      '/student/code-editor': t('virtualCodeEditor'),
      '/student/timetable': 'My Timetable',
      '/student/profile': t('profile')
    };
    return routes[pathname] || t('dashboard');
  };

  const location = useLocation();
  const isCodeEditor = location.pathname.includes('code-editor');

  return (
    <div className="flex h-screen bg-[#0a0f1c] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30 relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="student" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(location.pathname)}
        />
        
        <main className={`flex-1 overflow-y-auto ${isCodeEditor ? 'p-0 overflow-hidden' : 'p-6'} scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-slate-900/50 relative z-10`}>
          <div className={`${isCodeEditor ? 'h-full w-full' : 'max-w-7xl mx-auto'}`}>
            <Routes>
              <Route index element={<StudentHome />} />
              <Route path="class" element={<StudentVirtualClass />} />
              <Route path="materials" element={<Materials />} />
              <Route path="ai-tutor" element={<AITutor />} />
              <Route path="code-editor" element={<CodeEditor />} />
              <Route path="quiz/:quizId" element={<QuizTaker />} />
              <Route path="timetable" element={<StudentTimetable />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
