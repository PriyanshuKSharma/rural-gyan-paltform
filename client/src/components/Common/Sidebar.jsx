import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Users, 
  GraduationCap, 
  BarChart3, 
  FileText, 
  Video, 
  BookOpen, 
  Brain, 
  Code, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, setIsOpen, userRole }) => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success(t('logoutSuccess'));
    navigate('/login');
  };

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { path: '/admin', icon: Home, label: t('dashboard') },
          { path: '/admin/teachers', icon: Users, label: t('teacherManagement') },
          { path: '/admin/students', icon: GraduationCap, label: t('studentManagement') },
          { path: '/admin/analytics', icon: BarChart3, label: t('analytics') },
          { path: '/admin/logs', icon: FileText, label: t('logs') },
        ];
      case 'teacher':
        return [
          { path: '/teacher', icon: Home, label: t('dashboard') },
          { path: '/teacher/virtual-class', icon: Video, label: t('virtualClass') },
          { path: '/teacher/quiz', icon: BookOpen, label: t('quizSetup') },
          { path: '/teacher/subjects', icon: BookOpen, label: t('allocatedSubjects') },
          { path: '/teacher/students', icon: Users, label: t('classManagement') },
          { path: '/teacher/performance', icon: BarChart3, label: t('performanceAnalysis') },
        ];
      case 'student':
        return [
          { path: '/student', icon: Home, label: t('dashboard') },
          { path: '/student/class', icon: Video, label: t('virtualClass') },
          { path: '/student/materials', icon: BookOpen, label: t('materials') },
          { path: '/student/ai-tutor', icon: Brain, label: t('aiTutor') },
          { path: '/student/code-editor', icon: Code, label: t('virtualCodeEditor') },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">EduMS</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <NavLink
            to={`/${userRole}/profile`}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={18} />
            <span>{t('profile')}</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={18} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;