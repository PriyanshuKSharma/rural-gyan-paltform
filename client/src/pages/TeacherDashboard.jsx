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
import MaterialsManagement from '../components/Teacher/MaterialsManagement';
import Profile from '../components/Common/Profile';
import Timetable from '../components/Teacher/Timetable';

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
      '/teacher/materials': 'Materials Management',
      '/teacher/timetable': 'Weekly Timetable',
      '/teacher/profile': t('profile')
    };
    return routes[pathname] || t('dashboard');
  };

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
        userRole="teacher" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(window.location.pathname)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-slate-900/50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<TeacherHome />} />
              <Route path="virtual-class" element={<TeacherVirtualClass />} />
              <Route path="quiz" element={<QuizManagement />} />
              <Route path="subjects" element={<AllocatedSubjects />} />
              <Route path="students" element={<ClassManagement />} />
              <Route path="performance" element={<PerformanceAnalysis />} />
              <Route path="materials" element={<MaterialsManagement />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;