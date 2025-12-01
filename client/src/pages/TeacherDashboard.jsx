import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import TeacherHome from '../components/Teacher/TeacherHome';
import TeacherVirtualClass from '../components/TeacherVirtualClass';
import QuizManagement from '../components/Teacher/QuizManagement';
import AllocatedSubjects from '../components/Teacher/AllocatedSubjects';
import ClassManagement from '../components/Teacher/ClassManagement';
import PerformanceAnalysis from '../components/Teacher/PerformanceAnalysis';
import Profile from '../components/Common/Profile';

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = (pathname) => {
    const routes = {
      '/teacher': t('dashboard'),
      '/teacher/virtual-class': t('virtualClass'),
      '/teacher/quiz': t('quizSetup'),
      '/teacher/subjects': t('allocatedSubjects'),
      '/teacher/students': t('classManagement'),
      '/teacher/performance': t('performanceAnalysis'),
      '/teacher/profile': t('profile')
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
        userRole="teacher" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(window.location.pathname)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-gray-900">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<TeacherHome />} />
              <Route path="virtual-class" element={<TeacherVirtualClass />} />
              <Route path="quiz" element={<QuizManagement />} />
              <Route path="subjects" element={<AllocatedSubjects />} />
              <Route path="students" element={<ClassManagement />} />
              <Route path="performance" element={<PerformanceAnalysis />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;