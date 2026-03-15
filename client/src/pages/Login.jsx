import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import indiaMapComplete from '../assets/india_map_complete.png';

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

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative flex items-center justify-center">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[100px] transform -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 p-6 relative z-10">
        
        {/* Left Panel - Branding */}
        <div className="lg:w-1/2 flex flex-col justify-center space-y-8 relative">
          {/* India Map Background */}
          <div 
            className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-no-repeat bg-center bg-contain"
            style={{ backgroundImage: `url(${indiaMapComplete})` }}
          />

          <div className="relative z-10 space-y-8">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Rural Gyan
              </span>
            </Link>
          
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 leading-tight pb-2">
              Welcome<br/>Back
            </h2>
            <p className="text-slate-400 text-xl max-w-md font-light">
              {t('platformTagline') || 'Sign in to continue your educational journey.'}
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 max-w-sm">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-5">
              <h4 className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Demo Access
              </h4>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-medium">ADMIN</span>
                  <span className="text-slate-400 font-mono">admin / admin123</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-medium">TEACHER</span>
                  <span className="text-slate-400 font-mono">teacher1 / teacher123</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">STUDENT</span>
                  <span className="text-slate-400 font-mono">student1 / student123</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-slate-800 p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
            {/* Glowing borders */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="mb-8 text-center relative z-10">
              <h3 className="text-3xl font-extrabold text-white mb-2">
                {t('loginTitle') || 'Log In'}
              </h3>
              <p className="text-slate-400">
                Access your personalized dashboard
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-center gap-3 relative z-10">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {t('username') || 'Username'}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-slate-500"
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">
                    {t('password') || 'Password'}
                  </label>
                  <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    {t('forgotPassword') || 'Forgot Password?'}
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
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder:text-slate-500 pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] focus:ring-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.7)] hover:-translate-y-0.5 mt-8 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
              >
                <span>{loading ? 'Processing...' : (t('login') || 'Log In')}</span>
                {!loading && (
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center relative z-10">
              <span className="text-slate-400 text-sm">
                Don't have an account?
              </span>
              <button
                onClick={() => navigate('/signup')}
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                {t('signUp') || 'Sign Up'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;