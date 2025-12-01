import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import StudentHome from '../components/Student/StudentHome';
import StudentVirtualClass from '../components/StudentVirtualClass';
import Materials from '../components/Student/Materials';
import AITutor from '../components/Student/AITutor';
import CodeEditor from '../components/Student/CodeEditor';
import Profile from '../components/Common/Profile';

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
      '/student/profile': t('profile')
    };
    return routes[pathname] || t('dashboard');
  };

  return (
    <div className="flex h-screen cyber-bg overflow-hidden font-mono">
      {/* Background Overlay Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900 pointer-events-none"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-5" style={{
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 51%)',
        backgroundSize: '100% 4px'
      }}></div>

      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        userRole="student" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(window.location.pathname)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-gray-900">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<StudentHome />} />
              <Route path="class" element={<StudentVirtualClass />} />
              <Route path="materials" element={<Materials />} />
              <Route path="ai-tutor" element={<AITutor />} />
              <Route path="code-editor" element={<CodeEditor />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;