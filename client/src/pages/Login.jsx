import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(formData);

    if (result.success) {
      toast.success('Login successful');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center cyber-bg font-mono overflow-hidden relative">
      {/* Background Overlay Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10" style={{
        background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 51%)',
        backgroundSize: '100% 4px'
      }}></div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 p-6 relative z-10">
        {/* Left Panel - Branding */}
        <div className="lg:w-1/2 flex flex-col justify-center space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border-2 border-cyan-500 relative flex items-center justify-center bg-gray-900/80 backdrop-blur">
              <div className="absolute inset-0 border border-cyan-500 blur-[2px] opacity-50"></div>
              <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white cyber-glitch-text" data-text="NDEMLP">
              NDEMLP
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 leading-tight">
              FUTURE OF<br/>LEARNING
            </h2>
            <p className="text-cyan-100/70 text-lg max-w-md border-l-2 border-cyan-500 pl-4">
              {t('platformTagline')}
            </p>
          </div>

          <div className="flex gap-4 text-xs font-bold tracking-widest text-cyan-700 uppercase">
            <span>System: Online</span>
            <span>//</span>
            <span>Ver: 2.0.77</span>
            <span>//</span>
            <span>Secured: True</span>
          </div>

          {/* Cyber Demo Credentials */}
          <div className="mt-auto pt-8">
            <div className="bg-black/40 border border-cyan-900/50 p-4 text-[10px] font-mono text-cyan-600 backdrop-blur-sm max-w-xs">
              <div className="uppercase mb-2 text-cyan-400 border-b border-cyan-900/50 pb-1 flex items-center gap-2">
                <Lock size={10} />
                Access Codes
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-y-1">
                <span>ADMIN:</span> <span className="text-cyan-100">admin / admin123</span>
                <span>TEACHER:</span> <span className="text-cyan-100">teacher1 / teacher123</span>
                <span>STUDENT:</span> <span className="text-cyan-100">student1 / student123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <div className="cyber-card w-full max-w-md p-8 lg:p-12">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="mb-8 text-center relative">
              <h3 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">
                {t('loginTitle')}
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto"></div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-400 text-sm font-bold tracking-wide flex items-center gap-3">
                <div className="w-1 h-full bg-red-500 absolute left-0 top-0"></div>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                  {t('username')}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="cyber-input"
                  placeholder="ENTER_USERNAME"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                    {t('password')}
                  </label>
                  <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider">
                    {t('forgotPassword')}?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="cyber-input pr-12"
                    placeholder="ENTER_PASSWORD"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-700 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cyber-btn-primary w-full mt-4 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'PROCESSING...' : t('login')}
                  {!loading && (
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
              <button
                onClick={toggleLanguage}
                className="text-xs font-bold text-gray-500 hover:text-cyan-400 transition-colors uppercase tracking-wider flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                {i18n.language === 'en' ? 'LANG: HI' : 'LANG: EN'}
              </button>
              
              <button
                onClick={() => navigate('/signup')}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-400 transition-colors uppercase tracking-wider"
              >
                {t('signUp')} &gt;
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Login;