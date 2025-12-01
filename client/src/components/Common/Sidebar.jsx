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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-cyan-900/50 shadow-[0_0_30px_rgba(0,243,255,0.1)] transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        flex flex-col
      `}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900 pointer-events-none"></div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-cyan-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 border border-cyan-500 bg-cyan-900/20 relative flex items-center justify-center backdrop-blur-sm">
                <div className="absolute inset-0 border border-cyan-500 blur-[2px] opacity-50"></div>
                <GraduationCap className="text-cyan-400 relative z-10" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-wider cyber-glitch-text" data-text="NDEMLP">NDEMLP</h1>
                <p className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest">Sys.Ver.2.0</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-cyan-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="relative z-10 p-6 border-b border-cyan-900/30 bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-none border-2 border-purple-500 p-0.5 relative">
              <div className="w-full h-full bg-purple-900/20 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-lg">
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate uppercase tracking-wide">
                {user?.fullName}
              </p>
              <p className="text-xs text-cyan-500/70 truncate font-mono">
                {userRole} // {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 border-l-2 transition-all duration-200 group
                ${isActive 
                  ? 'border-cyan-500 bg-cyan-900/20 text-cyan-400 shadow-[inset_10px_0_20px_-10px_rgba(0,243,255,0.2)]' 
                  : 'border-transparent text-gray-400 hover:text-cyan-200 hover:bg-white/5'
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} className={`transition-transform duration-200 group-hover:scale-110 ${({isActive}) => isActive ? 'animate-pulse' : ''}`} />
              <span className="font-mono text-sm tracking-wide uppercase">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="relative z-10 p-4 border-t border-cyan-900/30 bg-gray-900/80 space-y-2">
          <NavLink
            to={`/${userRole}/profile`}
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-cyan-500/50"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={20} />
            <span className="font-mono text-sm tracking-wide uppercase">{t('profile')}</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-900/10 transition-colors border-l-2 border-transparent hover:border-red-500/50"
          >
            <LogOut size={20} />
            <span className="font-mono text-sm tracking-wide uppercase">{t('logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;