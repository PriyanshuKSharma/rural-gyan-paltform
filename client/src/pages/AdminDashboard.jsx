import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import AdminHome from '../components/Admin/AdminHome';
import TeacherManagement from '../components/Admin/TeacherManagement';
import StudentManagement from '../components/Admin/StudentManagement';
import Analytics from '../components/Admin/Analytics';
import Logs from '../components/Admin/Logs';
import Profile from '../components/Common/Profile';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = (pathname) => {
    const routes = {
      '/admin': t('dashboard'),
      '/admin/teachers': t('teacherManagement'),
      '/admin/students': t('studentManagement'),
      '/admin/analytics': t('analytics'),
      '/admin/logs': t('logs'),
      '/admin/profile': t('profile')
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
        userRole="admin" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(window.location.pathname)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-slate-900/50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<AdminHome />} />
              <Route path="teachers" element={<TeacherManagement />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="logs" element={<Logs />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;