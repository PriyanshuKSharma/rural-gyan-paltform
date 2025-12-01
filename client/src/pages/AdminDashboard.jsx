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
        userRole="admin" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle(window.location.pathname)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-gray-900">
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